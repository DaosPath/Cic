import React from 'react';
import type { DailyLog } from '../types.ts';
import {
    ChipSelector,
    SingleSelector,
    ScaleSlider,
    NumberInput,
    TimeInput,
    ToggleSwitch,
    CollapsibleSection,
    ChipSelectorWithCustom
} from './LogFieldComponents.tsx';
import { useTranslation } from '../hooks/useTranslation.ts';

interface LogSectionsProps {
    log: DailyLog;
    setLog: React.Dispatch<React.SetStateAction<DailyLog>>;
    openSections: Record<string, boolean>;
    toggleSection: (section: string) => void;
}

export const MenstruationSection: React.FC<LogSectionsProps> = ({ log, setLog, openSections, toggleSection }) => {
    const { t } = useTranslation();
    return (
        <CollapsibleSection
            title={t('menstruation')}
            icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
            isOpen={openSections.menstruation}
            onToggle={() => toggleSection('menstruation')}
            badge={log.aiGenerated && log.periodIntensity ? 'IA' : undefined}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('menstruationIntensity')}</label>
                    <SingleSelector
                        options={[
                            { value: '0', label: t('noFlow') },
                            { value: '1', label: t('spotting') || 'Spotting' },
                            { value: '2', label: t('light') },
                            { value: '3', label: t('medium') },
                            { value: '4', label: t('heavy') }
                        ]}
                        selected={log.periodIntensity?.toString()}
                        onChange={(v) => setLog({ ...log, periodIntensity: v ? parseInt(v) as any : undefined })}
                    />
                </div>

                {log.periodIntensity && log.periodIntensity > 0 && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-brand-text mb-2">{t('menstruationColorLabel')}</label>
                            <SingleSelector
                                options={[
                                    { value: 'bright-red', label: t('menstruationColorBrightRed') },
                                    { value: 'dark-red', label: t('menstruationColorDarkRed') },
                                    { value: 'brown', label: t('menstruationColorBrown') },
                                    { value: 'pink', label: t('menstruationColorPink') }
                                ]}
                                selected={log.periodColor}
                                onChange={(v) => setLog({ ...log, periodColor: v as any })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-brand-text mb-2">{t('menstruationConsistencyLabel')}</label>
                            <SingleSelector
                                options={[
                                    { value: 'watery', label: t('menstruationConsistencyWatery') },
                                    { value: 'thick', label: t('menstruationConsistencyThick') },
                                    { value: 'clotty', label: t('menstruationConsistencyClotty') }
                                ]}
                                selected={log.periodConsistency}
                                onChange={(v) => setLog({ ...log, periodConsistency: v as any })}
                            />
                        </div>

                        <ToggleSwitch
                            checked={log.hasClots || false}
                            onChange={(v) => setLog({ ...log, hasClots: v })}
                            label={t('menstruationClots')}
                        />

                        <div>
                            <label className="block text-sm font-semibold text-brand-text mb-2">{t('menstruationProductsLabel')}</label>
                            <ChipSelector
                                options={[
                                    { value: 'pad', label: t('menstruationProductPad') },
                                    { value: 'tampon', label: t('menstruationProductTampon') },
                                    { value: 'cup', label: t('menstruationProductCup') },
                                    { value: 'disc', label: t('menstruationProductDisc') }
                                ]}
                                selected={log.periodProducts || []}
                                onChange={(v) => setLog({ ...log, periodProducts: v as any })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-brand-text mb-2">{t('menstruationProductSize')}</label>
                                <SingleSelector
                                    options={[
                                        { value: 'small', label: 'S' },
                                        { value: 'medium', label: 'M' },
                                        { value: 'large', label: 'L' }
                                    ]}
                                    selected={log.productSize}
                                    onChange={(v) => setLog({ ...log, productSize: v as any })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-brand-text mb-2">{t('menstruationProductQuantity')}</label>
                                <NumberInput
                                    value={log.productCount}
                                    onChange={(v) => setLog({ ...log, productCount: v })}
                                    placeholder="0"
                                    min={0}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <ToggleSwitch
                                checked={log.hasLeaks || false}
                                onChange={(v) => setLog({ ...log, hasLeaks: v })}
                                label={t('menstruationLeaks')}
                            />
                            <ToggleSwitch
                                checked={log.periodStartedToday || false}
                                onChange={(v) => setLog({ ...log, periodStartedToday: v })}
                                label={t('menstruationStartedToday')}
                            />
                        </div>
                    </>
                )}
            </div>
        </CollapsibleSection>
    );
};

export const FertilitySection: React.FC<LogSectionsProps> = ({ log, setLog, openSections, toggleSection }) => {
    const { t } = useTranslation();
    return (
        <CollapsibleSection
            title={t('fertility')}
            icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            isOpen={openSections.fertility}
            onToggle={() => toggleSection('fertility')}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('ovulationTestLabel')}</label>
                    <SingleSelector
                        options={[
                            { value: 'positive', label: t('ovulationTestPositive') },
                            { value: 'negative', label: t('ovulationTestNegative') },
                            { value: 'unclear', label: t('ovulationTestIndeterminate') }
                        ]}
                        selected={log.ovulationTest}
                        onChange={(v) => setLog({ ...log, ovulationTest: v as any })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('cervicalFlowLabel')}</label>
                    <SingleSelector
                        options={[
                            { value: 'dry', label: t('cervicalFlowDry') },
                            { value: 'sticky', label: t('cervicalFlowSticky') },
                            { value: 'creamy', label: t('cervicalFlowCreamy') },
                            { value: 'watery', label: t('cervicalFlowWatery') },
                            { value: 'egg-white', label: t('cervicalFlowEggWhite') }
                        ]}
                        selected={log.cervicalFluid}
                        onChange={(v) => setLog({ ...log, cervicalFluid: v as any })}
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('cervixPositionLabel')}</label>
                        <SingleSelector
                            options={[
                                { value: 'high', label: t('cervixPositionHigh') },
                                { value: 'medium', label: t('cervixPositionMedium') },
                                { value: 'low', label: t('cervixPositionLow') }
                            ]}
                            selected={log.cervixPosition}
                            onChange={(v) => setLog({ ...log, cervixPosition: v as any })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('cervixFirmnessLabel')}</label>
                        <SingleSelector
                            options={[
                                { value: 'firm', label: t('cervixFirmnessFirm') },
                                { value: 'soft', label: t('cervixFirmnessSoft') }
                            ]}
                            selected={log.cervixFirmness}
                            onChange={(v) => setLog({ ...log, cervixFirmness: v as any })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('cervixOpeningLabel')}</label>
                        <SingleSelector
                            options={[
                                { value: 'open', label: t('cervixOpeningOpen') },
                                { value: 'closed', label: t('cervixOpeningClosed') }
                            ]}
                            selected={log.cervixOpening}
                            onChange={(v) => setLog({ ...log, cervixOpening: v as any })}
                        />
                    </div>
                </div>

            </div>
        </CollapsibleSection>
    );
};

export const PainSection: React.FC<LogSectionsProps> = ({ log, setLog, openSections, toggleSection }) => {
    const { t } = useTranslation();
    return (
        <CollapsibleSection
            title={t('pain')}
            icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            isOpen={openSections.pain}
            onToggle={() => toggleSection('pain')}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('painLevelLabel')}</label>
                    <ScaleSlider
                        value={log.painLevel}
                        onChange={(v) => setLog({ ...log, painLevel: v })}
                        min={0}
                        max={10}
                    />
                </div>

                {log.painLevel !== undefined && log.painLevel > 0 && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-brand-text mb-2">{t('painLocationLabel')}</label>
                            <ChipSelector
                                options={[
                                    { value: 'cramps', label: t('painLocationCramps') },
                                    { value: 'headache', label: t('painLocationHeadache') },
                                    { value: 'back', label: t('painLocationBack') },
                                    { value: 'breasts', label: t('painLocationBreasts') }
                                ]}
                                selected={log.painLocations || []}
                                onChange={(v) => setLog({ ...log, painLocations: v })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-brand-text mb-2">{t('painDurationLabel')}</label>
                            <input
                                type="text"
                                value={log.painDuration || ''}
                                onChange={(e) => setLog({ ...log, painDuration: e.target.value || undefined })}
                                placeholder={t('painDurationPlaceholder')}
                                className="w-full bg-brand-surface text-brand-text placeholder:text-brand-text-dim/70 p-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150"
                            />
                        </div>
                    </>
                )}
            </div>
        </CollapsibleSection>
    );
};

// Continue in next message due to length...

export const MentalSection: React.FC<LogSectionsProps> = ({ log, setLog, openSections, toggleSection }) => {
    const { t } = useTranslation();
    return (
        <CollapsibleSection
            title={t('mentalAndLibido')}
            icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            isOpen={openSections.mental}
            onToggle={() => toggleSection('mental')}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <ToggleSwitch checked={log.anxiety || false} onChange={(v) => setLog({ ...log, anxiety: v })} label={t('mentalAnxiety')} />
                    <ToggleSwitch checked={log.sadness || false} onChange={(v) => setLog({ ...log, sadness: v })} label={t('mentalSadness')} />
                    <ToggleSwitch checked={log.irritability || false} onChange={(v) => setLog({ ...log, irritability: v })} label={t('mentalIrritability')} />
                    <ToggleSwitch checked={log.calmness || false} onChange={(v) => setLog({ ...log, calmness: v })} label={t('mentalCalmness')} />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('mentalMotivationLabel')}</label>
                    <SingleSelector
                        options={[
                            { value: 'low', label: t('mentalMotivationLow') },
                            { value: 'medium', label: t('mentalMotivationMedium') },
                            { value: 'high', label: t('mentalMotivationHigh') }
                        ]}
                        selected={log.motivation}
                        onChange={(v) => setLog({ ...log, motivation: v as any })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('mentalLibidoLabel')}</label>
                    <SingleSelector
                        options={[
                            { value: 'low', label: t('mentalLibidoLow') },
                            { value: 'normal', label: t('mentalLibidoNormal') },
                            { value: 'high', label: t('mentalLibidoHigh') }
                        ]}
                        selected={log.libido}
                        onChange={(v) => setLog({ ...log, libido: v as any })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('mentalStressLabel')}</label>
                    <ScaleSlider
                        value={log.stressScore}
                        onChange={(v) => setLog({ ...log, stressScore: v })}
                        min={0}
                        max={10}
                    />
                </div>

                {log.stressScore !== undefined && log.stressScore > 3 && (
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('mentalStressTriggersLabel')}</label>
                        <ChipSelectorWithCustom
                            predefinedOptions={[
                                { value: 'work', label: t('mentalStressTriggerWork') },
                                { value: 'study', label: t('mentalStressTriggerStudy') },
                                { value: 'relationship', label: t('mentalStressTriggerRelationship') },
                                { value: 'family', label: t('mentalStressTriggerFamily') },
                                { value: 'health', label: t('mentalStressTriggerHealth') },
                                { value: 'money', label: t('mentalStressTriggerMoney') }
                            ]}
                            selected={log.stressTriggers || []}
                            onChange={(v) => setLog({ ...log, stressTriggers: v })}
                            placeholder={t('mentalStressTriggerPlaceholder')}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('energyLabel')}</label>
                    <SingleSelector
                        options={[
                            { value: 'low', label: t('low') },
                            { value: 'medium', label: t('medium') },
                            { value: 'high', label: t('high') }
                        ]}
                        selected={log.energyLevel}
                        onChange={(v) => setLog({ ...log, energyLevel: v as any })}
                    />
                </div>
            </div>
        </CollapsibleSection>
    );
};

export const SleepSection: React.FC<LogSectionsProps> = ({ log, setLog, openSections, toggleSection }) => {
    const { t } = useTranslation();
    return (
        <CollapsibleSection
            title={t('sleepHabits')}
            icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            isOpen={openSections.sleep}
            onToggle={() => toggleSection('sleep')}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('sleepHoursLabel')}</label>
                        <NumberInput
                            value={log.sleepHours}
                            onChange={(v) => setLog({ ...log, sleepHours: v })}
                            placeholder="8"
                            min={0}
                            max={16}
                            step={0.5}
                            unit="h"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('sleepQualityLabel')}</label>
                        <ScaleSlider
                            value={log.sleepQuality}
                            onChange={(v) => setLog({ ...log, sleepQuality: v as any })}
                            min={1}
                            max={5}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('sleepBedTimeLabel')}</label>
                        <TimeInput
                            value={log.bedTime}
                            onChange={(v) => setLog({ ...log, bedTime: v })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('sleepWakeTimeLabel')}</label>
                        <TimeInput
                            value={log.wakeTime}
                            onChange={(v) => setLog({ ...log, wakeTime: v })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('sleepNapLabel')}</label>
                    <NumberInput
                        value={log.napMinutes}
                        onChange={(v) => setLog({ ...log, napMinutes: v })}
                        placeholder="0"
                        min={0}
                        unit="min"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('sleepWaterLabel')}</label>
                        <NumberInput
                            value={log.waterIntake}
                            onChange={(v) => setLog({ ...log, waterIntake: v })}
                            placeholder="2"
                            min={0}
                            max={6}
                            step={0.1}
                            unit="L"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('sleepCaffeineLabel')}</label>
                        <NumberInput
                            value={log.caffeineIntake}
                            onChange={(v) => setLog({ ...log, caffeineIntake: v })}
                            placeholder="0"
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('sleepAlcoholLabel')}</label>
                        <NumberInput
                            value={log.alcoholIntake}
                            onChange={(v) => setLog({ ...log, alcoholIntake: v })}
                            placeholder="0"
                            min={0}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('cravingsLabel')}</label>
                    <ChipSelectorWithCustom
                        predefinedOptions={[
                            { value: 'sweet', label: t('cravingsSweet') },
                            { value: 'salty', label: t('cravingsSalty') },
                            { value: 'chocolate', label: t('cravingsChocolate') },
                            { value: 'spicy', label: t('cravingsSpicy') },
                            { value: 'carbs', label: t('cravingsCarbs') }
                        ]}
                        selected={log.cravings || []}
                        onChange={(v) => setLog({ ...log, cravings: v })}
                        placeholder={t('cravingsPlaceholder')}
                    />
                </div>
            </div>
        </CollapsibleSection>
    );
};

export const ActivitySection: React.FC<LogSectionsProps> = ({ log, setLog, openSections, toggleSection }) => {
    const { t } = useTranslation();
    return (
        <CollapsibleSection
            title={t('activity')}
            icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            isOpen={openSections.activity}
            onToggle={() => toggleSection('activity')}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('activityIntensityLabel')}</label>
                    <SingleSelector
                        options={[
                            { value: 'none', label: t('activityIntensityNone') },
                            { value: 'light', label: t('activityIntensityLight') },
                            { value: 'moderate', label: t('activityIntensityModerate') },
                            { value: 'intense', label: t('activityIntensityIntense') }
                        ]}
                        selected={log.physicalActivity}
                        onChange={(v) => setLog({ ...log, physicalActivity: v as any })}
                    />
                </div>

                {log.physicalActivity && log.physicalActivity !== 'none' && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-brand-text mb-2">{t('activityTypeLabel')}</label>
                            <ChipSelectorWithCustom
                                predefinedOptions={[
                                    { value: 'walking', label: t('activityTypeWalking') },
                                    { value: 'running', label: t('activityTypeRunning') },
                                    { value: 'strength', label: t('activityTypeStrength') },
                                    { value: 'yoga', label: t('activityTypeYoga') },
                                    { value: 'cycling', label: t('activityTypeCycling') },
                                    { value: 'swimming', label: t('activityTypeSwimming') }
                                ]}
                                selected={log.activityType || []}
                                onChange={(v) => setLog({ ...log, activityType: v })}
                                placeholder={t('activityTypePlaceholder')}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-brand-text mb-2">{t('activityDurationLabel')}</label>
                                <NumberInput
                                    value={log.activityDuration}
                                    onChange={(v) => setLog({ ...log, activityDuration: v })}
                                    placeholder="30"
                                    min={0}
                                    unit="min"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-brand-text mb-2">{t('activityRpeLabel')}</label>
                                <ScaleSlider
                                    value={log.activityIntensity}
                                    onChange={(v) => setLog({ ...log, activityIntensity: v })}
                                    min={1}
                                    max={10}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-brand-text mb-2">{t('activityStepsLabel')}</label>
                                <NumberInput
                                    value={log.steps}
                                    onChange={(v) => setLog({ ...log, steps: v })}
                                    placeholder="0"
                                    min={0}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-brand-text mb-2">{t('activityRestingHrLabel')}</label>
                                <NumberInput
                                    value={log.restingHeartRate}
                                    onChange={(v) => setLog({ ...log, restingHeartRate: v })}
                                    placeholder="60"
                                    min={0}
                                    unit="bpm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-brand-text mb-2">{t('activityCaloriesLabel')}</label>
                                <NumberInput
                                    value={log.caloriesBurned}
                                    onChange={(v) => setLog({ ...log, caloriesBurned: v })}
                                    placeholder="0"
                                    min={0}
                                    unit="kcal"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </CollapsibleSection>
    );
};

export const MedicationSection: React.FC<LogSectionsProps> = ({ log, setLog, openSections, toggleSection }) => {
    const { t } = useTranslation();
    const addMedication = () => {
        const medications = log.medications || [];
        setLog({ ...log, medications: [...medications, { name: '', dose: '' }] });
    };

    const updateMedication = (index: number, field: 'name' | 'dose', value: string) => {
        const medications = [...(log.medications || [])];
        medications[index] = { ...medications[index], [field]: value };
        setLog({ ...log, medications });
    };

    const removeMedication = (index: number) => {
        const medications = [...(log.medications || [])];
        medications.splice(index, 1);
        setLog({ ...log, medications });
    };

    return (
        <CollapsibleSection
            title={t('medicationCare')}
            icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
            isOpen={openSections.medication}
            onToggle={() => toggleSection('medication')}
        >
            <div className="space-y-4">
                {/* Medications */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-brand-text">{t('medicationsLabel')}</label>
                        <button
                            onClick={addMedication}
                            className="text-xs font-medium text-brand-primary hover:text-brand-primary/80 flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {t('addMedication')}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {(log.medications || []).map((med, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={med.name}
                                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                    placeholder={t('medicationNamePlaceholder')}
                                    className="flex-1 bg-brand-surface text-brand-text placeholder:text-brand-text-dim/70 p-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150 text-sm"
                                />
                                <input
                                    type="text"
                                    value={med.dose}
                                    onChange={(e) => updateMedication(index, 'dose', e.target.value)}
                                    placeholder={t('medicationDosePlaceholder')}
                                    className="w-24 bg-brand-surface text-brand-text placeholder:text-brand-text-dim/70 p-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150 text-sm"
                                />
                                <button
                                    onClick={() => removeMedication(index)}
                                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        {(!log.medications || log.medications.length === 0) && (
                            <p className="text-xs text-brand-text-dim italic">{t('noMedicationsAdded')}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('supplementsLabel')}</label>
                    <ChipSelectorWithCustom
                        predefinedOptions={[
                            { value: 'iron', label: t('supplementIron') },
                            { value: 'magnesium', label: t('supplementMagnesium') },
                            { value: 'omega3', label: t('supplementOmega3') },
                            { value: 'vitaminD', label: t('supplementVitaminD') },
                            { value: 'calcium', label: t('supplementCalcium') },
                            { value: 'zinc', label: t('supplementZinc') }
                        ]}
                        selected={log.supplements || []}
                        onChange={(v) => setLog({ ...log, supplements: v })}
                        placeholder={t('supplementsPlaceholder')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('contraceptionLabel')}</label>
                    <input
                        type="text"
                        value={log.contraception || ''}
                        onChange={(e) => setLog({ ...log, contraception: e.target.value || undefined })}
                        placeholder={t('contraceptionPlaceholder')}
                        className="w-full bg-brand-surface text-brand-text placeholder:text-brand-text-dim/70 p-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150"
                    />
                </div>

                {log.contraception && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-brand-text mb-2">{t('contraceptionDayLabel')}</label>
                            <NumberInput
                                value={log.contraceptionDay}
                                onChange={(v) => setLog({ ...log, contraceptionDay: v })}
                                placeholder="1"
                                min={1}
                                max={28}
                            />
                        </div>
                            <div className="flex items-end">
                                <ToggleSwitch
                                    checked={log.hasIUD || false}
                                    onChange={(v) => setLog({ ...log, hasIUD: v })}
                                    label={t('iudLabel')}
                                />
                            </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('homeRemediesLabel')}</label>
                    <ChipSelectorWithCustom
                        predefinedOptions={[
                            { value: 'heating-pad', label: t('homeRemedyHeatingPad') },
                            { value: 'cold-compress', label: t('homeRemedyColdCompress') },
                            { value: 'tea', label: t('homeRemedyTea') },
                            { value: 'bath', label: t('homeRemedyHotBath') },
                            { value: 'massage', label: t('homeRemedyMassage') },
                            { value: 'meditation', label: t('homeRemedyMeditation') }
                        ]}
                        selected={log.homeRemedies || []}
                        onChange={(v) => setLog({ ...log, homeRemedies: v })}
                        placeholder={t('homeRemediesPlaceholder')}
                    />
                </div>
            </div>
        </CollapsibleSection>
    );
};

export const HealthSection: React.FC<LogSectionsProps> = ({ log, setLog, openSections, toggleSection }) => {
    const { t } = useTranslation();
    return (
        <CollapsibleSection
            title={t('healthAndTests')}
            icon={<svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
            isOpen={openSections.health}
            onToggle={() => toggleSection('health')}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('basalTemperatureLabel')}</label>
                        <NumberInput
                            value={log.basalTemp}
                            onChange={(v) => setLog({ ...log, basalTemp: v })}
                            placeholder="36.5"
                            min={35}
                            max={38}
                            step={0.1}
                            unit="°C"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text mb-2">{t('weightLabel')}</label>
                        <NumberInput
                            value={log.weight}
                            onChange={(v) => setLog({ ...log, weight: v })}
                            placeholder="60"
                            min={0}
                            step={0.1}
                            unit="kg"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('pregnancyTestLabel')}</label>
                    <SingleSelector
                        options={[
                            { value: 'positive', label: t('positive') },
                            { value: 'negative', label: t('negative') },
                            { value: 'not-taken', label: t('notTaken') }
                        ]}
                        selected={log.pregnancyTest}
                        onChange={(v) => setLog({ ...log, pregnancyTest: v as any })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <ToggleSwitch
                        checked={log.hasColdSymptoms || false}
                        onChange={(v) => setLog({ ...log, hasColdSymptoms: v })}
                        label={t('coldSymptomsLabel')}
                    />
                    <ToggleSwitch
                        checked={log.hasCovidSymptoms || false}
                        onChange={(v) => setLog({ ...log, hasCovidSymptoms: v })}
                        label={t('covidSymptomsLabel')}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-text mb-2">{t('bloodPressureLabel')}</label>
                    <input
                        type="text"
                        value={log.bloodPressure || ''}
                        onChange={(e) => setLog({ ...log, bloodPressure: e.target.value || undefined })}
                        placeholder="120/80"
                        className="w-full bg-brand-surface text-brand-text placeholder:text-brand-text-dim/70 p-3 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all duration-150"
                    />
                </div>
            </div>
        </CollapsibleSection>
    );
};
