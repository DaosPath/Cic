import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { saveSettings, getBackupData, restoreBackupData, clearLogsAndCycles, clearAndBulkInsert, upsertLog } from '../services/db.ts';
import { generateDevData, generateLogsForDateRange, generateTodayLog, fillMissingDays } from '../services/dev-data.ts';
import type { AppSettings } from '../types.ts';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';
import { useTranslation } from '../hooks/useTranslation.ts';
import { subDays } from 'date-fns/subDays';

const languageOptions = [
    { value: 'auto', labelKey: 'automatic' },
    { value: 'es', labelKey: 'spanish' },
    { value: 'en', labelKey: 'english' },
    { value: 'tr', labelKey: 'turkish' },
] as const;

export const SettingsPage: React.FC = () => {
    const { settings, setSettings, refreshData, logs } = useContext(AppContext);
    const { t, language, translateSymptomId } = useTranslation();
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [devModeIntent, setDevModeIntent] = useState<boolean | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        setLocalSettings(settings);
        setHasChanges(false);
    }, [settings]);

    useEffect(() => {
        const changed = JSON.stringify(localSettings) !== JSON.stringify(settings);
        setHasChanges(changed);
    }, [localSettings, settings]);

    const handleSave = async () => {
        await saveSettings(localSettings);
        setSettings(localSettings);
        setHasChanges(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleBackup = async () => {
        try {
            const data = await getBackupData();
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = `aura-ciclo-backup-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
        } catch (error) {
            console.error("Error creating backup:", error);
            alert(t('backupCreationError'));
        }
    };

    const handleRestore = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const data = JSON.parse(e.target?.result as string);
                        if (data.logs && data.cycles && data.settings) {
                            if (window.confirm(t('restoreConfirm'))) {
                                await restoreBackupData(data);
                                await refreshData();
                                alert(t('restoreSuccess'));
                            }
                        } else {
                            throw new Error(t('invalidBackupFile'));
                        }
                    } catch (error) {
                        console.error("Error restoring backup:", error);
                        alert(t('restoreFailed'));
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleToggleDevMode = () => {
        const newDevModeState = !localSettings.isDevMode;
        setLocalSettings(prev => ({ ...prev, isDevMode: newDevModeState }));
        setDevModeIntent(newDevModeState);
        setConfirmModalOpen(true);
    };

    const handleConfirmDevMode = async () => {
        if (devModeIntent === null) return;

        const newSettings = { ...localSettings, isDevMode: devModeIntent };
        try {
            if (devModeIntent) {
                const devData = generateDevData();
                await clearAndBulkInsert(devData);
                alert(t('devModeEnabled'));
            } else {
                await clearLogsAndCycles();
                alert(t('devModeDisabled'));
            }
            await saveSettings(newSettings);
            await refreshData();
        } catch (error) {
            console.error("Failed to toggle dev mode:", error);
            alert(t('devModeError'));
            setLocalSettings(prev => ({ ...prev, isDevMode: !devModeIntent }));
        } finally {
            setConfirmModalOpen(false);
            setDevModeIntent(null);
        }
    };

    const handleCancelDevMode = () => {
        setLocalSettings(prev => ({ ...prev, isDevMode: !devModeIntent }));
        setConfirmModalOpen(false);
        setDevModeIntent(null);
    };

    // New dev tools functions
    const handleFillLast7Days = async () => {
        try {
            const endDate = new Date();
            const startDate = subDays(endDate, 6);
            const newLogs = generateLogsForDateRange(startDate, endDate);
            
            for (const log of newLogs) {
                await upsertLog(log);
            }
            
            await refreshData();
            alert(`✅ Se generaron ${newLogs.length} registros para los últimos 7 días`);
        } catch (error) {
            console.error('Error filling last 7 days:', error);
            alert('❌ Error al generar registros');
        }
    };

    const handleFillLast30Days = async () => {
        try {
            const endDate = new Date();
            const startDate = subDays(endDate, 29);
            const newLogs = generateLogsForDateRange(startDate, endDate);
            
            for (const log of newLogs) {
                await upsertLog(log);
            }
            
            await refreshData();
            alert(`✅ Se generaron ${newLogs.length} registros para los últimos 30 días`);
        } catch (error) {
            console.error('Error filling last 30 days:', error);
            alert('❌ Error al generar registros');
        }
    };

    const handleGenerateTodayLog = async () => {
        try {
            const todayLog = generateTodayLog();
            await upsertLog(todayLog);
            await refreshData();
            alert('✅ Registro de hoy generado correctamente');
        } catch (error) {
            console.error('Error generating today log:', error);
            alert('❌ Error al generar registro de hoy');
        }
    };

    const handleFillMissingDays = async () => {
        try {
            const endDate = new Date();
            const startDate = subDays(endDate, 90); // Last 3 months
            const newLogs = fillMissingDays(logs, startDate, endDate);
            
            if (newLogs.length === 0) {
                alert('ℹ️ No hay días faltantes en los últimos 90 días');
                return;
            }
            
            for (const log of newLogs) {
                await upsertLog(log);
            }
            
            await refreshData();
            alert(`✅ Se rellenaron ${newLogs.length} días faltantes`);
        } catch (error) {
            console.error('Error filling missing days:', error);
            alert('❌ Error al rellenar días faltantes');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = 'checked' in e.target ? e.target.checked : false;
        setLocalSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) || 0 : value
        }));
    };

    const handleClearData = async () => {
        setShowDeleteModal(false);
        try {
            await clearLogsAndCycles();
            await refreshData();
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error("Error clearing data:", error);
            alert(t('deleteDataError'));
        }
    };

    const handleExportLogs = async () => {
        try {
            const data = await getBackupData();
            const csvHeader = [t('date'), t('menstruationIntensity'), t('mood'), t('symptoms'), t('notes')].join(',');
            const csvContent = [
                csvHeader,
                ...data.logs.map(log => [
                    log.date,
                    log.periodIntensity ?? 'N/A',
                    log.mood ?? 'N/A',
                    (log.symptoms.length > 0 ? log.symptoms.map(translateSymptomId).join(';') : '') || 'N/A',
                    (log.notes || '').replace(/,/g, ';')
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `aura-ciclo-logs-${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting logs:", error);
            alert(t('exportError'));
        }
    };

    const copyDebugInfo = () => {
        const debugInfo = {
            version: "1.0.0",
            userAgent: navigator.userAgent,
            language,
            locale: Intl.DateTimeFormat().resolvedOptions().locale,
            localStorageSize: JSON.stringify(localStorage).length,
            indexedDB: 'available'
        };

        navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
            .then(() => alert(t('debugCopySuccess')))
            .catch(() => alert(t('debugCopyError')));
    };

    const devModeConfirmationMessage = devModeIntent
        ? t('devModeEnableConfirm')
        : t('devModeDisableConfirm');

    return (
        <>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                title={t('confirm')}
                onConfirm={handleConfirmDevMode}
                onCancel={handleCancelDevMode}
                confirmText={t('confirm')}
                cancelText={t('cancel')}
            >
                {devModeConfirmationMessage}
            </ConfirmationModal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                title="⚠️ Eliminar todos los datos"
                onConfirm={handleClearData}
                onCancel={() => setShowDeleteModal(false)}
                confirmText="Eliminar"
                cancelText="Cancelar"
            >
                Esta acción eliminará permanentemente todos tus ciclos, registros y datos. No se puede deshacer.
            </ConfirmationModal>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
                    <div className="bg-brand-surface border border-brand-primary/30 rounded-[18px] px-6 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center gap-3">
                        <svg className="w-5 h-5 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-brand-text font-medium">Cambios guardados correctamente</span>
                    </div>
                </div>
            )}

            <div className="min-h-screen px-4 md:px-8 pt-12 pb-32 md:pb-24">
                <div className="max-w-[1140px] mx-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 md:p-8 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                            {t('configuration')}
                        </h1>
                        <p className="text-base text-brand-text-dim" style={{ fontWeight: 500, lineHeight: 1.5 }}>
                            {t('personalizeExperience')}
                        </p>
                    </div>

                    {/* Two Column Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Cycle Configuration */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-xl bg-brand-primary/15">
                                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                        {t('cycleConfiguration')}
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="cycleLength" className="block text-sm font-semibold text-brand-text mb-2" style={{ fontWeight: 600 }}>
                                            {t('averageCycleDuration')}
                                        </label>
                                        <input
                                            type="number"
                                            name="cycleLength"
                                            id="cycleLength"
                                            value={localSettings.cycleLength}
                                            onChange={handleInputChange}
                                            placeholder="28"
                                            className="w-full bg-brand-surface text-brand-text placeholder:text-brand-text-dim/70 p-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lutealPhaseLength" className="block text-sm font-semibold text-brand-text mb-2" style={{ fontWeight: 600 }}>
                                            {t('lutealPhaseDuration')}
                                        </label>
                                        <input
                                            type="number"
                                            name="lutealPhaseLength"
                                            id="lutealPhaseLength"
                                            value={localSettings.lutealPhaseLength}
                                            onChange={handleInputChange}
                                            placeholder="14"
                                            className="w-full bg-brand-surface text-brand-text placeholder:text-brand-text-dim/70 p-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="language" className="block text-sm font-semibold text-brand-text mb-2" style={{ fontWeight: 600 }}>
                                            {t('language')}
                                        </label>
                                        <select
                                            id="language"
                                            name="language"
                                            value={localSettings.language}
                                            onChange={handleInputChange}
                                            className="w-full bg-brand-surface text-brand-text p-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150"
                                        >
                                            {languageOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {t(option.labelKey)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Privacy */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-xl bg-brand-primary/15">
                                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                        {t('privacy')}
                                    </h2>
                                </div>
                                <div className="bg-brand-surface-2 p-4 rounded-xl border border-brand-border flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="font-semibold text-brand-text mb-1" style={{ fontWeight: 600 }}>
                                            {t('discreteMode')}
                                        </div>
                                        <p className="text-xs text-brand-text-dim leading-relaxed">
                                            Oculta términos específicos en la interfaz para mayor privacidad en espacios públicos
                                        </p>
                                    </div>
                                    <label htmlFor="discreteMode" className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input 
                                            type="checkbox" 
                                            name="discreteMode" 
                                            id="discreteMode" 
                                            checked={localSettings.discreteMode} 
                                            onChange={handleInputChange} 
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-brand-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Data Management */}
                            <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-brand-border shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-xl bg-brand-primary/15">
                                        <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-brand-text" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                        {t('dataManagement')}
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleBackup}
                                        className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-brand-border hover:border-brand-primary/30 flex items-center justify-center gap-2"
                                        style={{ fontWeight: 500 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        {t('createBackup')}
                                    </button>
                                    <button
                                        onClick={handleRestore}
                                        className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-brand-border hover:border-brand-primary/30 flex items-center justify-center gap-2"
                                        style={{ fontWeight: 500 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        {t('restoreData')}
                                    </button>
                                    <button
                                        onClick={handleExportLogs}
                                        className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-brand-border hover:border-brand-primary/30 flex items-center justify-center gap-2"
                                        style={{ fontWeight: 500 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {t('exportToCsv')}
                                    </button>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-gradient-to-br from-red-950/30 to-red-900/20 p-5 md:p-6 rounded-[18px] backdrop-blur-lg border border-red-500/30 shadow-[0_4px_16px_rgba(239,68,68,0.15)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-red-500/15">
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-red-400" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                        Zona de peligro
                                    </h2>
                                </div>
                                <p className="text-sm text-brand-text-dim mb-4 leading-relaxed">
                                    Esta acción es permanente y no se puede deshacer. Todos tus datos serán eliminados.
                                </p>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 px-4 rounded-xl transition-all duration-150 border border-red-500/30 hover:border-red-500/50 flex items-center justify-center gap-2"
                                    style={{ fontWeight: 600 }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    {t('deleteAllData')}
                                </button>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Advanced Settings - Accordion */}
                            <div className="bg-gradient-to-br from-amber-950/30 to-orange-950/20 rounded-[18px] backdrop-blur-lg border border-amber-500/30 shadow-[0_4px_16px_rgba(0,0,0,0.25)] overflow-hidden">
                                {/* Accordion Header */}
                                <button
                                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                    className="w-full p-5 md:p-6 flex items-center justify-between hover:bg-amber-500/5 transition-all duration-150"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-amber-500/15">
                                            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <h2 className="text-lg font-bold text-amber-400" style={{ fontWeight: 700, lineHeight: 1.3 }}>
                                            {t('developmentTools')}
                                        </h2>
                                    </div>
                                    <svg 
                                        className={`w-5 h-5 text-amber-400 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Accordion Content */}
                                <div className={`transition-all duration-200 ${isAdvancedOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <div className="p-5 md:p-6 pt-0 space-y-4">

                                        <div className="bg-amber-900/30 p-4 rounded-xl border border-amber-500/30">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-amber-400 mb-1" style={{ fontWeight: 600 }}>
                                                        {t('developerMode')}
                                                    </div>
                                                    <p className="text-xs text-brand-text-dim leading-relaxed">
                                                        {t('fillWithTestData')}
                                                    </p>
                                                </div>
                                                <label htmlFor="devMode" className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                                    <input 
                                                        type="checkbox" 
                                                        name="devMode" 
                                                        id="devMode" 
                                                        checked={localSettings.isDevMode || false} 
                                                        onChange={handleToggleDevMode} 
                                                        className="sr-only peer" 
                                                    />
                                                    <div className="w-11 h-6 bg-brand-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            onClick={copyDebugInfo}
                                            className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-amber-500/20 hover:border-amber-500/40 flex items-center justify-center gap-2"
                                            style={{ fontWeight: 500 }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            {t('copyDebugInfo')}
                                        </button>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-amber-500/20 hover:border-amber-500/40 flex items-center justify-center gap-2"
                                            style={{ fontWeight: 500 }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            {t('reloadApp')}
                                        </button>
                                        <button
                                            onClick={() => console.log('Settings:', localSettings)}
                                            className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-amber-500/20 hover:border-amber-500/40 flex items-center justify-center gap-2"
                                            style={{ fontWeight: 500 }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            {t('logSettingsConsole')}
                                        </button>

                                        {/* Separator */}
                                        <div className="border-t border-amber-500/20 my-2"></div>
                                        <p className="text-xs font-semibold text-amber-400 mb-2" style={{ fontWeight: 600 }}>
                                            🛠️ Generación de Datos
                                        </p>

                                        <button
                                            onClick={handleGenerateTodayLog}
                                            className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-green-500/20 hover:border-green-500/40 flex items-center justify-center gap-2"
                                            style={{ fontWeight: 500 }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Generar Registro de Hoy
                                        </button>

                                        <button
                                            onClick={handleFillLast7Days}
                                            className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-blue-500/20 hover:border-blue-500/40 flex items-center justify-center gap-2"
                                            style={{ fontWeight: 500 }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Rellenar Últimos 7 Días
                                        </button>

                                        <button
                                            onClick={handleFillLast30Days}
                                            className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-purple-500/20 hover:border-purple-500/40 flex items-center justify-center gap-2"
                                            style={{ fontWeight: 500 }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Rellenar Últimos 30 Días
                                        </button>

                                        <button
                                            onClick={handleFillMissingDays}
                                            className="w-full bg-brand-surface-2 hover:bg-brand-surface text-brand-text font-medium py-3 px-4 rounded-xl transition-all duration-150 border border-pink-500/20 hover:border-pink-500/40 flex items-center justify-center gap-2"
                                            style={{ fontWeight: 500 }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Rellenar Días Faltantes (90d)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Save Bar */}
                    {hasChanges && (
                        <div className="fixed bottom-0 left-0 right-0 bg-brand-surface/95 backdrop-blur-lg border-t border-brand-border shadow-[0_-4px_16px_rgba(0,0,0,0.3)] z-40 animate-in slide-in-from-bottom duration-200">
                            <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-sm font-medium text-brand-text" style={{ fontWeight: 500 }}>
                                        Cambios no guardados
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setLocalSettings(settings);
                                            setHasChanges(false);
                                        }}
                                        className="px-4 py-2 rounded-xl text-sm font-medium text-brand-text-dim hover:text-brand-text hover:bg-brand-surface-2 transition-all duration-150"
                                        style={{ fontWeight: 500 }}
                                    >
                                        Descartar
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={!hasChanges}
                                        className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2 shadow-lg shadow-brand-primary/20"
                                        style={{ fontWeight: 600 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Guardar cambios
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
