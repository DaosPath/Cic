import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { saveSettings, getBackupData, restoreBackupData, clearLogsAndCycles, clearAndBulkInsert } from '../services/db.ts';
import { generateDevData } from '../services/dev-data.ts';
import type { AppSettings } from '../types.ts';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';
import { useTranslation } from '../hooks/useTranslation.ts';

const languageOptions = [
    { value: 'auto', labelKey: 'automatic' },
    { value: 'es', labelKey: 'spanish' },
    { value: 'en', labelKey: 'english' },
    { value: 'tr', labelKey: 'turkish' },
] as const;

export const SettingsPage: React.FC = () => {
    const { settings, setSettings, refreshData } = useContext(AppContext);
    const { t, language } = useTranslation();
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [devModeIntent, setDevModeIntent] = useState<boolean | null>(null);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = async () => {
        await saveSettings(localSettings);
        setSettings(localSettings);
        alert(t('settingsSaved'));
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = 'checked' in e.target ? e.target.checked : false;
        setLocalSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value, 10) || 0 : value
        }));
    };

    const handleClearData = async () => {
        if (window.confirm(t('deleteDataConfirm'))) {
            try {
                await clearLogsAndCycles();
                await refreshData();
                alert(t('dataDeleted'));
            } catch (error) {
                console.error("Error clearing data:", error);
                alert(t('deleteDataError'));
            }
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
                    log.symptoms.join(';') || 'N/A',
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

            <div className="min-h-screen p-4 md:p-8 pt-12 max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-8 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl mb-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-brand-text tracking-tight">{t('configuration')}</h1>
                        <p className="text-lg md:text-xl text-brand-text-dim font-light">
                            {t('personalizeExperience')}
                        </p>
                        <div className="mt-4 w-20 h-1 bg-gradient-to-r from-brand-primary/50 to-brand-primary mx-auto rounded-full"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-2xl bg-brand-primary/10">
                                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-brand-text tracking-wide">{t('cycleConfiguration')}</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="cycleLength" className="block text-sm font-semibold text-brand-text mb-2">{t('averageCycleDuration')}</label>
                                    <input
                                        type="number"
                                        name="cycleLength"
                                        id="cycleLength"
                                        value={localSettings.cycleLength}
                                        onChange={handleInputChange}
                                        className="w-full bg-brand-surface/50 p-4 rounded-2xl border border-brand-primary/10 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/30 outline-none transition-all duration-300 text-brand-text"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lutealPhaseLength" className="block text-sm font-semibold text-brand-text mb-2">{t('lutealPhaseDuration')}</label>
                                    <input
                                        type="number"
                                        name="lutealPhaseLength"
                                        id="lutealPhaseLength"
                                        value={localSettings.lutealPhaseLength}
                                        onChange={handleInputChange}
                                        className="w-full bg-brand-surface/50 p-4 rounded-2xl border border-brand-primary/10 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/30 outline-none transition-all duration-300 text-brand-text"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="language" className="block text-sm font-semibold text-brand-text mb-2">{t('language')}</label>
                                    <select
                                        id="language"
                                        name="language"
                                        value={localSettings.language}
                                        onChange={handleInputChange}
                                        className="w-full bg-brand-surface/50 p-4 rounded-2xl border border-brand-primary/10 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/30 outline-none transition-all duration-300 text-brand-text"
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

                        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-2xl bg-brand-primary/10">
                                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-brand-text tracking-wide">{t('privacy')}</h2>
                            </div>
                            <div className="bg-brand-surface/50 p-4 rounded-2xl border border-brand-primary/10 flex items-center justify-between">
                                <div>
                                    <span className="font-semibold text-brand-text">{t('discreteMode')}</span>
                                    <p className="text-sm text-brand-text-dim">{t('hideSpecificTerms')}</p>
                                </div>
                                <label htmlFor="discreteMode" className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="discreteMode" id="discreteMode" checked={localSettings.discreteMode} onChange={handleInputChange} className="sr-only peer" />
                                    <div className="w-12 h-6 bg-brand-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary shadow-inner"></div>
                                </label>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-brand-surface/70 to-brand-surface/50 p-6 rounded-3xl backdrop-blur-lg border border-brand-primary/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-2xl bg-brand-primary/10">
                                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-brand-text tracking-wide">{t('dataManagement')}</h2>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handleBackup}
                                    className="w-full bg-brand-surface/50 hover:bg-brand-surface text-brand-text font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-brand-primary/10 hover:border-brand-primary/20"
                                >
                                    {t('createBackup')}
                                </button>
                                <button
                                    onClick={handleRestore}
                                    className="w-full bg-brand-surface/50 hover:bg-brand-surface text-brand-text font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-brand-primary/10 hover:border-brand-primary/20"
                                >
                                    {t('restoreData')}
                                </button>
                                <button
                                    onClick={handleExportLogs}
                                    className="w-full bg-brand-surface/50 hover:bg-brand-surface text-brand-text font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-brand-primary/10 hover:border-brand-primary/20"
                                >
                                    {t('exportToCsv')}
                                </button>
                                <button
                                    onClick={handleClearData}
                                    className="w-full bg-gradient-to-r from-phase-menstruation to-phase-menstruation/80 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-phase-menstruation/30"
                                >
                                    🗑️ {t('deleteAllData')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-6 rounded-3xl backdrop-blur-lg border border-yellow-400/30 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-2xl bg-yellow-400/10">
                                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-yellow-400 tracking-wide">{t('developmentTools')}</h2>
                            </div>

                            <div className="bg-yellow-900/30 p-4 rounded-2xl border border-yellow-400/30 mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-yellow-400">{t('developerMode')}</span>
                                        <p className="text-sm text-brand-text-dim">{t('fillWithTestData')}</p>
                                    </div>
                                    <label htmlFor="devMode" className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="devMode" id="devMode" checked={localSettings.isDevMode || false} onChange={handleToggleDevMode} className="sr-only peer" />
                                        <div className="w-12 h-6 bg-brand-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400 shadow-inner"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={copyDebugInfo}
                                    className="w-full bg-brand-surface/30 hover:bg-brand-surface/50 text-brand-text font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-yellow-400/20 hover:border-yellow-400/40"
                                >
                                    {t('copyDebugInfo')}
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-brand-surface/30 hover:bg-brand-surface/50 text-brand-text font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-yellow-400/20 hover:border-yellow-400/40"
                                >
                                    {t('reloadApp')}
                                </button>
                                <button
                                    onClick={() => console.log('Settings:', localSettings)}
                                    className="w-full bg-brand-surface/30 hover:bg-brand-surface/50 text-brand-text font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-yellow-400/20 hover:border-yellow-400/40"
                                >
                                    {t('logSettingsConsole')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSave}
                        className="group bg-gradient-to-r from-brand-primary to-brand-primary/80 text-brand-background font-bold py-4 px-12 rounded-2xl shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
                    >
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('saveConfiguration')}
                    </button>
                </div>
            </div>
        </>
    );
};
