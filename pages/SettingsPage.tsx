import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import { saveSettings, getBackupData, restoreBackupData, clearLogsAndCycles, clearAndBulkInsert } from '../services/db.ts';
import { generateDevData } from '../services/dev-data.ts';
import type { AppSettings } from '../types.ts';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';


export const SettingsPage: React.FC = () => {
    const { settings, setSettings, refreshData } = useContext(AppContext);
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [devModeIntent, setDevModeIntent] = useState<boolean | null>(null);
    
    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = async () => {
        await saveSettings(localSettings);
        setSettings(localSettings);
        alert('Ajustes guardados.');
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
            alert("No se pudo crear la copia de seguridad.");
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
                           if (window.confirm("¿Estás segura? Esto sobreescribirá todos tus datos actuales.")) {
                                await restoreBackupData(data);
                                await refreshData();
                                alert('Datos restaurados con éxito.');
                           }
                        } else {
                            throw new Error("Archivo de copia de seguridad inválido.");
                        }
                    } catch (error) {
                        console.error("Error restoring backup:", error);
                        alert("No se pudo restaurar la copia de seguridad. El archivo puede estar dañado o tener un formato incorrecto.");
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleToggleDevMode = () => {
        const newDevModeState = !localSettings.isDevMode;
        // Optimistically update UI
        setLocalSettings(prev => ({ ...prev, isDevMode: newDevModeState }));
        // Store intent and open modal
        setDevModeIntent(newDevModeState);
        setConfirmModalOpen(true);
    };

    const handleConfirmDevMode = async () => {
        if (devModeIntent === null) return;

        const newSettings = { ...localSettings, isDevMode: devModeIntent };
        try {
            if (devModeIntent) { // Turning ON
                const devData = generateDevData();
                await clearAndBulkInsert(devData);
                alert("Modo desarrollador activado.");
            } else { // Turning OFF
                await clearLogsAndCycles();
                alert("Modo desarrollador desactivado. La app está vacía.");
            }
            await saveSettings(newSettings);
            await refreshData();
        } catch (e) {
            console.error("Failed to toggle dev mode:", e);
            alert("Error al cambiar el modo desarrollador.");
            // Revert UI on error
            setLocalSettings(prev => ({ ...prev, isDevMode: !devModeIntent }));
        } finally {
            setConfirmModalOpen(false);
            setDevModeIntent(null);
        }
    };

    const handleCancelDevMode = () => {
        // Revert UI change
        setLocalSettings(prev => ({ ...prev, isDevMode: !devModeIntent }));
        setConfirmModalOpen(false);
        setDevModeIntent(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
        }));
    };
    
    const devModeConfirmationMessage = devModeIntent
        ? "¿Activar Modo Desarrollador? Esto borrará todos tus datos actuales y los reemplazará con datos de prueba."
        : "¿Desactivar Modo Desarrollador? Esto borrará todos los datos de prueba.";


    return (
        <>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                title="Confirmación Requerida"
                onConfirm={handleConfirmDevMode}
                onCancel={handleCancelDevMode}
            >
                {devModeConfirmationMessage}
            </ConfirmationModal>

            <div className="p-4 md:p-8 pt-10 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-brand-text">Ajustes</h1>
                <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
                    {/* Columna Izquierda */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="cycleLength" className="block text-sm font-medium text-brand-text-dim mb-1">Duración promedio del ciclo (días)</label>
                            <input type="number" name="cycleLength" id="cycleLength" value={localSettings.cycleLength} onChange={handleInputChange}
                                className="w-full bg-brand-surface p-3 rounded-lg border border-brand-secondary/50 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"/>
                        </div>
                        <div>
                            <label htmlFor="lutealPhaseLength" className="block text-sm font-medium text-brand-text-dim mb-1">Duración de la fase lútea (días)</label>
                            <input type="number" name="lutealPhaseLength" id="lutealPhaseLength" value={localSettings.lutealPhaseLength} onChange={handleInputChange}
                                className="w-full bg-brand-surface p-3 rounded-lg border border-brand-secondary/50 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"/>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-brand-text-dim">Modo Discreto</span>
                            <label htmlFor="discreteMode" className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="discreteMode" id="discreteMode" checked={localSettings.discreteMode} onChange={handleInputChange} className="sr-only peer"/>
                                <div className="w-11 h-6 bg-brand-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-6">
                        <div className="pt-4 border-t border-brand-secondary/30 md:pt-0 md:border-t-0">
                             <h2 className="text-lg font-semibold mb-3 text-brand-primary">Datos</h2>
                             <div className="flex gap-2">
                                <button onClick={handleBackup} className="flex-1 bg-brand-surface hover:bg-brand-secondary text-brand-text font-semibold py-2 px-4 rounded-lg transition-colors">Crear copia de seguridad</button>
                                <button onClick={handleRestore} className="flex-1 bg-brand-surface hover:bg-brand-secondary text-brand-text font-semibold py-2 px-4 rounded-lg transition-colors">Restaurar copia</button>
                             </div>
                        </div>
                        
                        <div className="pt-4 border-t border-brand-secondary/30 md:pt-0 md:border-t-0">
                             <h2 className="text-lg font-semibold mb-3 text-yellow-400">Desarrollo</h2>
                             <div className="flex items-center justify-between bg-yellow-900/20 p-3 rounded-lg border border-yellow-400/30">
                                <div>
                                    <span className="font-semibold text-yellow-400">Modo Desarrollador</span>
                                    <p className="text-xs text-brand-text-dim">Llena la app con datos de prueba. ¡Cuidado!</p>
                                </div>
                                <label htmlFor="devMode" className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" name="devMode" id="devMode" checked={localSettings.isDevMode || false} onChange={handleToggleDevMode} className="sr-only peer"/>
                                    <div className="w-11 h-6 bg-brand-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={handleSave} className="w-full bg-brand-primary text-brand-background font-bold py-3 rounded-xl mt-8 hover:scale-105 transition-transform duration-200">
                    Guardar Cambios
                </button>
            </div>
        </>
    );
};