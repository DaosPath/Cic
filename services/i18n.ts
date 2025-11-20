import type { Language } from '../types.ts';

export interface Translations {
  // Navigation
  appName: string;
  home: string;
  calendar: string;
  log: string;
  insights: string;
  settings: string;

  // Home page
  dayOfCycle: string;
  calculating: string;
  currentPhase: string;
  nextPeriod: string;
  nextEvent: string;
  fertileWindow: string;
  relevantWindow: string;
  howDoYouFeel: string;
  dailyTip: string;
  poweredByGemini: string;
  medicalDisclaimer: string;

  // Phases
  menstruation: string;
  follicular: string;
  ovulation: string;
  luteal: string;

  // Moods
  terrible: string;
  bad: string;
  normal: string;
  good: string;
  great: string;

  // Calendar
  cycleAnalysis: string;
  legend: string;
  previousMonth: string;
  nextMonth: string;

  // Log page
  dailyRecord: string;
  menstruationIntensity: string;
  noFlow: string;
  spotting: string;
  light: string;
  medium: string;
  heavy: string;
  mood: string;
  symptoms: string;
  notes: string;
  saveRecord: string;
  addAnyAdditionalNotes: string;
  logSaved: string;
  loading: string;

  // Insights controls
  analysisModeSimple: string;
  analysisModeAI: string;
  analysisModeLabel: string;
  viewModeLabel: string;
  viewDay: string;
  viewWeek: string;
  viewMonth: string;
  viewCycle: string;
  viewYear: string;
  exportData: string;
  noLogTodayTitle: string;
  noLogTodayDescription: string;
  insightsEmptyTitle: string;
  insightsEmptyDescriptionLine1: string;
  insightsEmptyDescriptionLine2: string;
  insightsDaySubtitle: string;
  insightsWeekSubtitle: string;
  insightsMonthSubtitle: string;
  insightsCurrentCycleSubtitle: string;
  insightsQuarterlySubtitle: string;
  insightsSemiAnnualSubtitle: string;
  insightsAnnualSubtitle: string;
  insightsGeneralTitle: string;
  insightsGeneralSubtitle: string;
  insightsRangeTitle: string;

  // Weekly insights view
  weeklySummaryWeekRange: string;
  weeklySummaryRecords: string;
  weeklySummaryTitle: string;
  weeklySummaryDays: string;
  metricSleep: string;
  metricPain: string;
  metricStress: string;
  metricHydration: string;
  metricMood: string;
  metricEnergy: string;
  dailyBreakdownTitle: string;
  weeklyNoRecord: string;
  physicalActivityTitle: string;
  activityDaysLabel: string;
  activityGoalLabel: string;
  totalMinutesLabel: string;
  sleepQualityTitle: string;
  sleepAvgHours: string;
  sleepAvgQuality: string;
  sleepGoodDays: string;
  mentalWellnessTitle: string;
  avgMoodLabel: string;
  highStressDaysLabel: string;
  highEnergyDaysLabel: string;
  commonSymptomsTitle: string;
  consumptionTrendsTitle: string;
  caffeineLabel: string;
  alcoholLabel: string;
  frequentCravings: string;
  weeklyPatternsTitle: string;
  highConfidenceLabel: string;
  weeklyChatSubtitle: string;
  weeklyInsightConsistency: string;
  weeklyInsightSleep: string;
  weeklyInsightMood: string;
  weeklyInsightActivity: string;
  weeklyInsightPain: string;
  weeklyInsightHydration: string;
  weeklyInsightTopSymptom: string;
  weeklyInsightCaffeine: string;

  // Monthly insights view
  loggedDaysLabel: string;
  cyclesThisMonthTitle: string;
  startLabel: string;
  energyDistributionTitle: string;
  monthlyInsightsTitle: string;
  monthlyInsightConsistency: string;
  monthlyInsightCycles: string;
  monthlyInsightSleepLow: string;
  monthlyInsightSleepGood: string;
  monthlyInsightPain: string;
  monthlyInsightStress: string;
  monthlyInsightActivityHigh: string;
  monthlyInsightActivityLow: string;
  monthlyInsightEnergyLow: string;
  monthlyInsightHydration: string;
  monthlyInsightTopSymptom: string;

  // AI insights (long range)
  aiTimeRangeDays: string;
  aiTimeRangeCycles: string;
  aiCycleRegularTitle: string;
  aiCycleIrregularTitle: string;
  aiCycleWhy: string;
  aiCycleInsightRegular: string;
  aiCycleInsightIrregular: string;
  aiCycleEvidenceSummary: string;
  aiPainHighTitle: string;
  aiPainModerateTitle: string;
  aiPainWhy: string;
  aiPainInsight: string;
  aiPainSummary: string;
  aiStressHighTitle: string;
  aiStressModerateTitle: string;
  aiStressWhy: string;
  aiStressInsight: string;
  aiStressSummary: string;
  aiSleepLowTitle: string;
  aiSleepSuboptimalTitle: string;
  aiSleepGoodTitle: string;
  aiSleepWhy: string;
  aiSleepInsight: string;
  aiSleepSummary: string;
  aiEnergyLowTitle: string;
  aiEnergyMixedTitle: string;
  aiEnergyWhy: string;
  aiEnergyInsight: string;
  aiEnergySummary: string;
  aiCorrelationMoodSleepTitle: string;
  aiCorrelationMoodSleepWhy: string;
  aiCorrelationMoodSleepInsight: string;
  aiCorrelationMoodSleepLabelPoor: string;
  aiCorrelationMoodSleepLabelOther: string;
  aiCorrelationMoodSleepSummary: string;
  aiHydrationLowTitle: string;
  aiHydrationGoodTitle: string;
  aiHydrationWhy: string;
  aiHydrationInsight: string;
  aiHydrationSummary: string;
  aiActivityLowTitle: string;
  aiActivityGoodTitle: string;
  aiActivityWhy: string;
  aiActivityInsight: string;
  aiActivitySummary: string;
  aiRecMaintainRoutine: string;
  aiRecKeepLogging: string;
  aiRecTrackFactors: string;
  aiRecConsultDoctor: string;
  aiRecSleepRoutine: string;
  aiRecPainRelief: string;
  aiRecStressTechniques: string;
  aiRecEnergyCheck: string;
  aiRecStayHydrated: string;
  aiRecMoveMore: string;
  aiNoInsightsTitle: string;
  aiNoInsightsDescription: string;
  aiChatAboutInsights: string;
  aiMainInsightTitle: string;
  aiEvidenceTitle: string;
  aiRecommendationsTitle: string;

  // Advanced logging modules
  menstruationColorLabel: string;
  menstruationColorBrightRed: string;
  menstruationColorDarkRed: string;
  menstruationColorBrown: string;
  menstruationColorPink: string;
  menstruationConsistencyLabel: string;
  menstruationConsistencyWatery: string;
  menstruationConsistencyThick: string;
  menstruationConsistencyClotty: string;
  menstruationClots: string;
  menstruationProductsLabel: string;
  menstruationProductPad: string;
  menstruationProductTampon: string;
  menstruationProductCup: string;
  menstruationProductDisc: string;
  menstruationProductSize: string;
  menstruationProductQuantity: string;
  menstruationLeaks: string;
  menstruationStartedToday: string;

  ovulationTestLabel: string;
  ovulationTestPositive: string;
  ovulationTestNegative: string;
  ovulationTestIndeterminate: string;
  cervicalFlowLabel: string;
  cervicalFlowDry: string;
  cervicalFlowSticky: string;
  cervicalFlowCreamy: string;
  cervicalFlowWatery: string;
  cervicalFlowEggWhite: string;
  cervixPositionLabel: string;
  cervixPositionHigh: string;
  cervixPositionMedium: string;
  cervixPositionLow: string;
  cervixFirmnessLabel: string;
  cervixFirmnessFirm: string;
  cervixFirmnessSoft: string;
  cervixOpeningLabel: string;
  cervixOpeningOpen: string;
  cervixOpeningClosed: string;
  sexualActivityLabel: string;
  protectionLabel: string;

  painLevelLabel: string;
  painLocationLabel: string;
  painLocationCramps: string;
  painLocationHeadache: string;
  painLocationBack: string;
  painLocationBreasts: string;
  painDurationLabel: string;
  painDurationPlaceholder: string;

  mentalAnxiety: string;
  mentalSadness: string;
  mentalIrritability: string;
  mentalCalmness: string;
  mentalMotivationLabel: string;
  mentalMotivationLow: string;
  mentalMotivationMedium: string;
  mentalMotivationHigh: string;
  mentalLibidoLabel: string;
  mentalLibidoLow: string;
  mentalLibidoNormal: string;
  mentalLibidoHigh: string;
  mentalStressLabel: string;
  mentalStressTriggersLabel: string;
  mentalStressTriggerWork: string;
  mentalStressTriggerStudy: string;
  mentalStressTriggerRelationship: string;
  mentalStressTriggerFamily: string;
  mentalStressTriggerHealth: string;
  mentalStressTriggerMoney: string;
  mentalStressTriggerPlaceholder: string;
  energyLabel: string;

  sleepHoursLabel: string;
  sleepQualityLabel: string;
  sleepBedTimeLabel: string;
  sleepWakeTimeLabel: string;
  sleepNapLabel: string;
  sleepWaterLabel: string;
  sleepCaffeineLabel: string;
  sleepAlcoholLabel: string;
  cravingsLabel: string;
  cravingsSweet: string;
  cravingsSalty: string;
  cravingsChocolate: string;
  cravingsSpicy: string;
  cravingsCarbs: string;
  cravingsPlaceholder: string;

  activityIntensityLabel: string;
  activityIntensityNone: string;
  activityIntensityLight: string;
  activityIntensityModerate: string;
  activityIntensityIntense: string;
  activityTypeLabel: string;
  activityTypeWalking: string;
  activityTypeRunning: string;
  activityTypeStrength: string;
  activityTypeYoga: string;
  activityTypeCycling: string;
  activityTypeSwimming: string;
  activityTypePlaceholder: string;
  activityDurationLabel: string;
  activityRpeLabel: string;
  activityStepsLabel: string;
  activityRestingHrLabel: string;
  activityCaloriesLabel: string;

  medicationsLabel: string;
  addMedication: string;
  medicationNamePlaceholder: string;
  medicationDosePlaceholder: string;
  supplementsLabel: string;
  supplementIron: string;
  supplementMagnesium: string;
  supplementOmega3: string;
  supplementVitaminD: string;
  supplementCalcium: string;
  supplementZinc: string;
  supplementsPlaceholder: string;
  contraceptionLabel: string;
  contraceptionPlaceholder: string;
  contraceptionDayLabel: string;
  iudLabel: string;
  homeRemediesLabel: string;
  homeRemedyHeatingPad: string;
  homeRemedyColdCompress: string;
  homeRemedyTea: string;
  homeRemedyHotBath: string;
  homeRemedyMassage: string;
  homeRemedyMeditation: string;
  homeRemediesPlaceholder: string;

  basalTemperatureLabel: string;
  weightLabel: string;
  pregnancyTestLabel: string;
  notTaken: string;
  coldSymptomsLabel: string;
  covidSymptomsLabel: string;
  bloodPressureLabel: string;

  positive: string;
  negative: string;
  indeterminate: string;
  open: string;
  closed: string;
  high: string;
  low: string;
  firm: string;
  soft: string;
  // Insights
  notEnoughData: string;
  keepTracking: string;
  favoriteSymptoms: string;
  markImportantSymptoms: string;
  cycleDuration: string;
  average: string;
  days: string;
  cycleHistory: string;
  currentCycle: string;
  cycle: string;
  symptomAnalysis: string;
  records: string;
  record: string;
  discoverPatterns: string;
  unknownSymptom: string;
  cycleDurationChartAria: string;

  // Settings
  configuration: string;
  personalizeExperience: string;
  cycleConfiguration: string;
  averageCycleDuration: string;
  lutealPhaseDuration: string;
  privacy: string;
  discreteMode: string;
  hideSpecificTerms: string;
  dataManagement: string;
  createBackup: string;
  restoreData: string;
  exportToCsv: string;
  deleteAllData: string;
  developmentTools: string;
  developerMode: string;
  fillWithTestData: string;
  copyDebugInfo: string;
  reloadApp: string;
  logSettingsConsole: string;
  saveConfiguration: string;
  language: string;
  automatic: string;
  spanish: string;
  english: string;
  turkish: string;
  settingsSaved: string;
  backupCreationError: string;
  restoreConfirm: string;
  restoreSuccess: string;
  invalidBackupFile: string;
  restoreFailed: string;
  deleteDataConfirm: string;
  dataDeleted: string;
  deleteDataError: string;
  exportError: string;
  debugCopySuccess: string;
  debugCopyError: string;
  devModeEnabled: string;
  devModeDisabled: string;
  devModeError: string;
  devModeEnableConfirm: string;
  devModeDisableConfirm: string;
  date: string;
  aiUnavailable: string;
  aiFallbackMessage: string;

  // Additional UI copy
  appTagline: string;
  madeWithLoveForAzra: string;
  logSymptoms: string;
  savedInsightsTabPinned: string;
  savedInsightsTabSaved: string;
  kpiCycleAverage: string;
  kpiVariability: string;
  kpiRegularity: string;
  kpiPeriodDuration: string;
  cycleDurationTitle: string;
  cycleHistoryTitle: string;
  cycleLabel: string;
  chartDurationLabel: string;
  chartMovingAverageLabel: string;
  chartIrregularLabel: string;
  symptomAnalysisTitle: string;
  symptomHeatmapTitle: string;
  symptomHeatmapNoData: string;
  phaseMenstruation: string;
  phaseFollicular: string;
  phaseOvulation: string;
  phaseLuteal: string;
  phaseShortMenstruation: string;
  phaseShortFollicular: string;
  phaseShortOvulation: string;
  phaseShortLuteal: string;
  correlationsTitle: string;
  correlationNoData: string;
  correlationMatchSingular: string;
  correlationMatchPlural: string;
  noSavedInsights: string;
  noPinnedInsights: string;
  chatWithAI: string;
  chatInsightsDescription: string;
  startChat: string;
  chatContextLabel: string;
  chatContextLog: string;
  aiLogTitle: string;
  aiLogSubtitleInput: string;
  aiLogSubtitleReview: string;
  aiLogExamplesLabel: string;
  aiLogExample1: string;
  aiLogExample2: string;
  aiLogExample3: string;
  aiLogExample4: string;
  aiLogExample5: string;
  aiLogDescribeLabel: string;
  aiLogPlaceholder: string;
  aiLogCharacters: string;
  aiLogClear: string;
  aiLogVoiceIdle: string;
  aiLogVoiceRecording: string;
  aiLogConfidence: string;
  aiLogAnalyze: string;
  aiLogAnalyzing: string;
  aiLogApply: string;
  aiLogSummaryTitle: string;
  aiLogDetectedFieldsTitle: string;
  aiLogAmbiguousTitle: string;
  aiLogAmbiguousText: string;
  chatQuickCycle: string;
  chatQuickSleep: string;
  chatQuickSymptoms: string;
  chatQuickRecommendations: string;
  devToolsHeading: string;
  devFillLast7: string;
  devFillLast30: string;
  devFillMissing: string;
  devGeneratedLogs: string;
  devGeneratedToday: string;
  devGenerateError: string;
  devTodayError: string;
  devNoMissingDays: string;
  devFilledMissingDays: string;
  devFillMissingError: string;
  deleteDataModalTitle: string;
  deleteWarning: string;
  discreteModeDescription: string;
  generateTodayLog: string;
  unsavedChanges: string;
  discardChanges: string;
  cyclePhasesTitle: string;
  indicatorsTitle: string;
  ovulationDayIndicator: string;
  periodIntensityIndicator: string;
  moodRecordedIndicator: string;
  symptomsRecordedIndicator: string;
  notesWrittenIndicator: string;
  predictionUnconfirmed: string;
  today: string;
  predictions: string;
  exportCsv: string;
  exportICal: string;
  simplifiedMode: string;
  advancedMode: string;
  fertility: string;
  pain: string;
  mentalAndLibido: string;
  sleepHabits: string;
  activity: string;
  medicationCare: string;
  healthAndTests: string;

  // Daily insight modal
  dailyInsightModalTitle: string;
  dailyInsightModalSleepTitle: string;
  dailyInsightModalHydrationTitle: string;
  dailyInsightModalActivityTitle: string;
  dailyInsightModalInsightTitle: string;
  dailyInsightStressTitle: string;
  dailyInsightFlowVeryHeavy: string;
  dailyInsightInsufficientSleep: string;
  dailyInsightIdealSleep: string;
  dailyInsightLowMoodEnergy: string;
  dailyInsightHighPain: string;
  dailyInsightHighStress: string;
  dailyInsightLowHydration: string;
  dailyInsightHydrationOk: string;
  dailyInsightActivityPraise: string;
  dailyInsightFallback: string;

  // Common
  save: string;
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  close: string;
  back: string;
  noMedicationsAdded: string;
}

const translations: Record<Language, Translations> = {
  es: {
    // Navigation
    appName: 'Aura Ciclo',
    home: 'Inicio',
    calendar: 'Calendario',
    log: 'Registro',
    insights: 'Análisis',
    settings: 'Ajustes',

    // Home page
    dayOfCycle: 'Día del ciclo',
    calculating: 'Calculando',
    currentPhase: 'Fase actual',
    nextPeriod: 'Próxima menstruación',
    nextEvent: 'Próximo evento',
    fertileWindow: 'Ventana fértil',
    relevantWindow: 'Ventana relevante',
    howDoYouFeel: '¿Cómo te sientes hoy?',
    dailyTip: 'Consejo del día',
    poweredByGemini: 'Powered by Gemini',
    medicalDisclaimer: 'Esta app no ofrece diagnóstico médico; consulta a un profesional de salud para cualquier duda.',

    // Phases
    menstruation: 'Menstruación',
    follicular: 'Fase folicular',
    ovulation: 'Ovulación',
    luteal: 'Fase lútea',

    // Moods
    terrible: 'Terrible',
    bad: 'Mal',
    normal: 'Normal',
    good: 'Bien',
    great: 'Genial',

    // Calendar
    cycleAnalysis: 'Análisis de ciclos',
    legend: 'Leyenda',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',

    // Log page
    dailyRecord: 'Registro del día',
    menstruationIntensity: 'Menstruación',
    noFlow: 'Sin sangrado',
    spotting: 'Manchado',
    light: 'Ligero',
    medium: 'Medio',
    heavy: 'Abundante',
    mood: 'Estado de ánimo',
    symptoms: 'Síntomas',
    notes: 'Notas',
    saveRecord: 'Guardar registro',
    addAnyAdditionalNotes: 'Añade cualquier nota adicional sobre tu día...',
    logSaved: '¡Registro guardado!',
    loading: 'Cargando...',

    // Insights controls
    analysisModeSimple: 'Simple',
    analysisModeAI: 'IA',
    analysisModeLabel: 'Modo {mode}',
    viewModeLabel: 'Vista {view}',
    viewDay: 'Día',
    viewWeek: 'Semana',
    viewMonth: 'Mes',
    viewCycle: 'Ciclo',
    viewYear: 'Año',
    exportData: 'Exportar',
    noLogTodayTitle: 'Sin registro hoy',
    noLogTodayDescription: 'No hay datos registrados para el día de hoy. Registra tu información para ver el análisis.',
    insightsEmptyTitle: 'Análisis de Ciclos',
    insightsEmptyDescriptionLine1: 'Necesitas al menos 2 ciclos registrados para ver análisis.',
    insightsEmptyDescriptionLine2: 'Sigue registrando tus datos para obtener insights personalizados.',
    insightsDaySubtitle: 'Análisis completo de tu día',
    insightsWeekSubtitle: 'Análisis de tendencias semanales',
    insightsMonthSubtitle: 'Análisis completo del mes',
    insightsCurrentCycleSubtitle: 'Análisis de tu ciclo en curso',
    insightsQuarterlySubtitle: 'Análisis trimestral',
    insightsSemiAnnualSubtitle: 'Análisis semestral',
    insightsAnnualSubtitle: 'Análisis anual',
    insightsGeneralTitle: 'Análisis General',
    insightsGeneralSubtitle: 'Vista general de tus datos',
    insightsRangeTitle: 'Últimos {months} meses',

    // Insights dashboard
    kpiCycleAverage: 'Promedio del ciclo (días)',
    kpiVariability: 'Variabilidad (días)',
    kpiRegularity: 'Regularidad',
    kpiPeriodDuration: 'Duración de menstruación (días)',
    cycleDurationTitle: 'Duración de Ciclos',
    cycleHistoryTitle: 'Historial de Ciclos',
    cycleLabel: 'Ciclo {number}',
    chartDurationLabel: 'Duración',
    chartMovingAverageLabel: 'Media móvil',
    chartIrregularLabel: 'Irregular',
    symptomAnalysisTitle: 'Análisis de Síntomas',
    symptomHeatmapTitle: 'Heatmap de Síntomas',
    symptomHeatmapNoData: 'No hay datos de síntomas',
    phaseMenstruation: 'Menstruación',
    phaseFollicular: 'Folicular',
    phaseOvulation: 'Ovulación',
    phaseLuteal: 'Lútea',
    phaseShortMenstruation: 'Men',
    phaseShortFollicular: 'Fol',
    phaseShortOvulation: 'Ovu',
    phaseShortLuteal: 'Lut',
    correlationsTitle: 'Correlaciones',
    correlationNoData: 'No hay suficientes datos para correlaciones',
    correlationMatchSingular: '{count} coincidencia',
    correlationMatchPlural: '{count} coincidencias',

    // Weekly insights view
    weeklySummaryWeekRange: 'Semana del {start} al {end}',
    weeklySummaryRecords: 'Has registrado {logs} días entre el {start} y el {end}.',
    weeklySummaryTitle: 'Resumen semanal',
    weeklySummaryDays: '{count} días',
    metricSleep: 'Sueño',
    metricPain: 'Dolor',
    metricStress: 'Estrés',
    metricHydration: 'Hidratación',
    metricMood: 'Ánimo',
    metricEnergy: 'Energía',
    dailyBreakdownTitle: 'Desglose diario',
    weeklyNoRecord: 'No hay registros para esta semana',
    physicalActivityTitle: 'Actividad física',
    activityDaysLabel: 'Días activos',
    activityGoalLabel: 'Meta semanal',
    totalMinutesLabel: 'Minutos totales',
    sleepQualityTitle: 'Calidad del sueño',
    sleepAvgHours: 'Horas promedio',
    sleepAvgQuality: 'Calidad promedio',
    sleepGoodDays: 'Días con buen descanso',
    mentalWellnessTitle: 'Bienestar mental',
    avgMoodLabel: 'Ánimo promedio',
    highStressDaysLabel: 'Días de estrés alto',
    highEnergyDaysLabel: 'Días energéticos',
    commonSymptomsTitle: 'Síntomas comunes',
    consumptionTrendsTitle: 'Tendencias de consumo',
    caffeineLabel: 'Cafeína',
    alcoholLabel: 'Alcohol',
    frequentCravings: 'Antojos frecuentes',
    weeklyPatternsTitle: 'Patrones semanales',
    highConfidenceLabel: 'Alta confianza',
    weeklyChatSubtitle: 'Comparte tu semana con la IA y resuelve dudas',
    weeklyInsightConsistency: '{logs}/7 días registrados esta semana.',
    weeklyInsightSleep: 'Sueño promedio: {hours}h. Objetivo: 7-9h diarias.',
    weeklyInsightMood: 'Ánimo promedio: {mood}/5. Sigue cuidando tu bienestar.',
    weeklyInsightActivity: '{days} días activos, {minutes} min totales.',
    weeklyInsightPain: 'Dolor promedio: {pain}/10.',
    weeklyInsightHydration: 'Hidratación promedio: {liters}L.',
    weeklyInsightTopSymptom: 'Síntoma más frecuente: {symptom} ({count} días).',
    weeklyInsightCaffeine: 'Cafeína promedio: {cups} tazas/día.',

    // Monthly insights view
    loggedDaysLabel: 'Días registrados',
    cyclesThisMonthTitle: 'Ciclos del mes',
    startLabel: 'Inicio',
    energyDistributionTitle: 'Distribución de energía',
    monthlyInsightsTitle: 'Insights del mes',
    monthlyInsightConsistency: '{days}/{total} días registrados este mes.',
    monthlyInsightCycles: '{count} ciclo(s) registrados este mes.',
    monthlyInsightSleepLow: 'Sueño bajo: {hours}h en promedio. Prioriza 7-9h.',
    monthlyInsightSleepGood: 'Sueño saludable: {hours}h en promedio. ¡Bien hecho!',
    monthlyInsightPain: 'Dolor en {days} días. Promedio {pain}/10.',
    monthlyInsightStress: '{days} días con estrés alto. Promedio {stress}/10.',
    monthlyInsightActivityHigh: 'Actividad: {active} días ({percent}% del mes).',
    monthlyInsightActivityLow: 'Actividad baja: {active} días ({percent}% del mes). Súbela gradualmente.',
    monthlyInsightEnergyLow: 'La energía estuvo mayormente baja este mes.',
    monthlyInsightHydration: 'Hidratación promedio: {liters}L.',
    monthlyInsightTopSymptom: 'Síntoma más frecuente: {symptom} ({count} días).',

    // AI insights (long range)
    aiTimeRangeDays: 'Últimos {days} días',
    aiTimeRangeCycles: 'Últimos {count} ciclos',
    aiCycleRegularTitle: 'Ciclo regular detectado',
    aiCycleIrregularTitle: 'Variabilidad en el ciclo',
    aiCycleWhy: 'La regularidad del ciclo ayuda a predecir y vigilar tu salud hormonal.',
    aiCycleInsightRegular: 'Variación de solo ±{stdDev} días. Predicciones más precisas.',
    aiCycleInsightIrregular: 'Variación de ±{stdDev} días. Seguir registrando ayuda a detectar patrones.',
    aiCycleEvidenceSummary: 'Promedio: {avg} días, desviación: {stdDev} días',
    aiPainHighTitle: 'Niveles de dolor elevados',
    aiPainModerateTitle: 'Patrón de dolor moderado',
    aiPainWhy: 'El dolor frecuente impacta tu bienestar y puede requerir atención.',
    aiPainInsight: 'Dolor en {percent}% de los días. Promedio {avgPain}/10. {highPainDays} días con dolor severo.',
    aiPainSummary: '{days} días con dolor, promedio {avgPain}/10',
    aiStressHighTitle: 'Estrés elevado',
    aiStressModerateTitle: 'Estrés moderado',
    aiStressWhy: 'El estrés crónico afecta sueño, energía y ciclo.',
    aiStressInsight: 'Promedio de estrés {avgStress}/10. Estrés alto en {percent}% de los días.',
    aiStressSummary: '{total} días registrados, {high} con estrés alto',
    aiSleepLowTitle: 'Sueño insuficiente',
    aiSleepSuboptimalTitle: 'Sueño subóptimo',
    aiSleepGoodTitle: 'Buen patrón de sueño',
    aiSleepWhy: 'Dormir bien regula hormonas, ánimo y energía.',
    aiSleepInsight: 'Promedio {avgSleep}h. {poorSleepDays} días con menos de 6h.{avgQuality, select, undefined {} other { Calidad: {avgQuality}/5.}}',
    aiSleepSummary: '{nights} noches registradas, promedio {avgSleep}h',
    aiEnergyLowTitle: 'Energía baja frecuente',
    aiEnergyMixedTitle: 'Patrón de energía variable',
    aiEnergyWhy: 'Los niveles de energía reflejan descanso, nutrición y equilibrio.',
    aiEnergyInsight: '{lowPercent}% de los días con energía baja. {highDays} días con energía alta.',
    aiEnergySummary: '{low} días baja, {high} días alta',
    aiCorrelationMoodSleepTitle: 'Correlación: sueño y ánimo',
    aiCorrelationMoodSleepWhy: 'Dormir bien ayuda a estabilizar el estado de ánimo.',
    aiCorrelationMoodSleepInsight: 'En {percent}% de los casos, <6h se asoció a ánimo bajo.',
    aiCorrelationMoodSleepLabelPoor: 'Sueño pobre + ánimo bajo',
    aiCorrelationMoodSleepLabelOther: 'Otros',
    aiCorrelationMoodSleepSummary: '{poor} de {total} días',
    aiHydrationLowTitle: 'Hidratación insuficiente',
    aiHydrationGoodTitle: 'Buena hidratación',
    aiHydrationWhy: 'Buena hidratación mejora energía y reduce molestias.',
    aiHydrationInsight: 'Promedio {avgWater}L/día. {lowDays} días con menos de 1.5L.',
    aiHydrationSummary: '{days} días registrados, promedio {avgWater}L',
    aiActivityLowTitle: 'Actividad física baja',
    aiActivityGoodTitle: 'Buen nivel de actividad',
    aiActivityWhy: 'El ejercicio regula el ciclo y mejora el ánimo.',
    aiActivityInsight: 'Actividad en {percent}% de los días.{avgDuration, select, undefined {} other { Duración promedio: {avgDuration} min.}}',
    aiActivitySummary: '{active} de {total} días con actividad',
    aiRecMaintainRoutine: 'Mantén tu rutina actual',
    aiRecKeepLogging: 'Sigue registrando tus datos',
    aiRecTrackFactors: 'Registra factores de estrés y cambios',
    aiRecConsultDoctor: 'Consulta con un profesional si persiste',
    aiRecSleepRoutine: 'Crea una rutina de sueño (7-9h)',
    aiRecPainRelief: 'Prueba estrategias seguras para el dolor',
    aiRecStressTechniques: 'Usa técnicas de relajación diarias',
    aiRecEnergyCheck: 'Revisa energía con chequeo básico',
    aiRecStayHydrated: 'Apunta a 2-2.5L de agua al día',
    aiRecMoveMore: 'Muévete al menos 30min/día',
    aiNoInsightsTitle: 'No hay insights disponibles',
    aiNoInsightsDescription: 'Sigue registrando tus datos para obtener análisis personalizados.',
    aiChatAboutInsights: 'Chatear sobre estos insights',
    aiMainInsightTitle: 'Insight principal',
    aiEvidenceTitle: 'Evidencia',
    aiRecommendationsTitle: 'Recomendaciones',

    // Advanced logging modules
    menstruationColorLabel: 'Color',
    menstruationColorBrightRed: 'Rojo vivo',
    menstruationColorDarkRed: 'Rojo oscuro',
    menstruationColorBrown: 'Marrón',
    menstruationColorPink: 'Rosa',
    menstruationConsistencyLabel: 'Consistencia',
    menstruationConsistencyWatery: 'Acuoso',
    menstruationConsistencyThick: 'Espeso',
    menstruationConsistencyClotty: 'Con coágulos',
    menstruationClots: 'Coágulos',
    menstruationProductsLabel: 'Productos usados',
    menstruationProductPad: 'Toalla',
    menstruationProductTampon: 'Tampón',
    menstruationProductCup: 'Copa',
    menstruationProductDisc: 'Disco',
    menstruationProductSize: 'Talla',
    menstruationProductQuantity: 'Cantidad',
    menstruationLeaks: 'Fugas',
    menstruationStartedToday: 'Inicio hoy',
    ovulationTestLabel: 'Test de ovulación (LH)',
    ovulationTestPositive: 'Positivo',
    ovulationTestNegative: 'Negativo',
    ovulationTestIndeterminate: 'Indeterminado',
    cervicalFlowLabel: 'Flujo cervical',
    cervicalFlowDry: 'Seco',
    cervicalFlowSticky: 'Pegajoso',
    cervicalFlowCreamy: 'Cremoso',
    cervicalFlowWatery: 'Acuoso',
    cervicalFlowEggWhite: 'Clara de huevo',
    cervixPositionLabel: 'Posición',
    cervixPositionHigh: 'Alta',
    cervixPositionMedium: 'Media',
    cervixPositionLow: 'Baja',
    cervixFirmnessLabel: 'Firmeza',
    cervixFirmnessFirm: 'Firme',
    cervixFirmnessSoft: 'Suave',
    cervixOpeningLabel: 'Apertura',
    cervixOpeningOpen: 'Abierto',
    cervixOpeningClosed: 'Cerrado',
    sexualActivityLabel: 'Actividad sexual',
    protectionLabel: 'Protección',
    painLevelLabel: 'Nivel de dolor (0-10)',
    painLocationLabel: 'Ubicación',
    painLocationCramps: 'Cólicos',
    painLocationHeadache: 'Cabeza',
    painLocationBack: 'Espalda',
    painLocationBreasts: 'Senos',
    painDurationLabel: 'Duración aproximada',
    painDurationPlaceholder: 'ej: 2 horas, todo el día',
    mentalAnxiety: 'Ansiedad',
    mentalSadness: 'Tristeza',
    mentalIrritability: 'Irritabilidad',
    mentalCalmness: 'Calma',
    mentalMotivationLabel: 'Motivación',
    mentalMotivationLow: 'Baja',
    mentalMotivationMedium: 'Media',
    mentalMotivationHigh: 'Alta',
    mentalLibidoLabel: 'Libido',
    mentalLibidoLow: 'Baja',
    mentalLibidoNormal: 'Normal',
    mentalLibidoHigh: 'Alta',
    mentalStressLabel: 'Estrés (0-10)',
    mentalStressTriggersLabel: 'Detonantes',
    mentalStressTriggerWork: 'Trabajo',
    mentalStressTriggerStudy: 'Estudio',
    mentalStressTriggerRelationship: 'Relación',
    mentalStressTriggerFamily: 'Familia',
    mentalStressTriggerHealth: 'Salud',
    mentalStressTriggerMoney: 'Dinero',
    mentalStressTriggerPlaceholder: 'Ej: Tráfico, Examen...',
    energyLabel: 'Energía',
    sleepHoursLabel: 'Horas de sueño',
    sleepQualityLabel: 'Calidad (1-5)',
    sleepBedTimeLabel: 'Hora de dormir',
    sleepWakeTimeLabel: 'Hora de despertar',
    sleepNapLabel: 'Siesta (minutos)',
    sleepWaterLabel: 'Agua (L)',
    sleepCaffeineLabel: 'Cafeína',
    sleepAlcoholLabel: 'Alcohol',
    cravingsLabel: 'Antojos',
    cravingsSweet: 'Dulce',
    cravingsSalty: 'Salado',
    cravingsChocolate: 'Chocolate',
    cravingsSpicy: 'Picante',
    cravingsCarbs: 'Carbohidratos',
    cravingsPlaceholder: 'Ej: Pizza, Helado...',
    activityIntensityLabel: 'Intensidad',
    activityIntensityNone: 'Ninguna',
    activityIntensityLight: 'Suave',
    activityIntensityModerate: 'Moderada',
    activityIntensityIntense: 'Intensa',
    activityTypeLabel: 'Tipo de actividad',
    activityTypeWalking: 'Caminar',
    activityTypeRunning: 'Correr',
    activityTypeStrength: 'Fuerza',
    activityTypeYoga: 'Yoga',
    activityTypeCycling: 'Ciclismo',
    activityTypeSwimming: 'Natación',
    activityTypePlaceholder: 'Ej: Pilates, Baile...',
    activityDurationLabel: 'Duración (min)',
    activityRpeLabel: 'RPE (1-10)',
    activityStepsLabel: 'Pasos',
    activityRestingHrLabel: 'FC reposo',
    activityCaloriesLabel: 'Calorías',
    medicationsLabel: 'Medicamentos',
    addMedication: 'Agregar',
    medicationNamePlaceholder: 'Nombre',
    medicationDosePlaceholder: 'Dosis',
    supplementsLabel: 'Suplementos',
    supplementIron: 'Hierro',
    supplementMagnesium: 'Magnesio',
    supplementOmega3: 'Omega-3',
    supplementVitaminD: 'Vitamina D',
    supplementCalcium: 'Calcio',
    supplementZinc: 'Zinc',
    supplementsPlaceholder: 'Ej: Vitamina B12, Colágeno...',
    contraceptionLabel: 'Anticonceptivo',
    contraceptionPlaceholder: 'ej: Píldora, DIU',
    contraceptionDayLabel: 'Día del blíster',
    iudLabel: 'Tengo DIU',
    homeRemediesLabel: 'Remedios caseros',
    homeRemedyHeatingPad: 'Bolsa de calor',
    homeRemedyColdCompress: 'Compresa fría',
    homeRemedyTea: 'Té',
    homeRemedyHotBath: 'Baño caliente',
    homeRemedyMassage: 'Masaje',
    homeRemedyMeditation: 'Meditación',
    homeRemediesPlaceholder: 'Ej: Aromaterapia, Yoga...',
    basalTemperatureLabel: 'Temperatura basal (°C)',
    weightLabel: 'Peso (kg)',
    pregnancyTestLabel: 'Test de embarazo',
    notTaken: 'No realizado',
    coldSymptomsLabel: 'Síntomas resfriado',
    covidSymptomsLabel: 'Síntomas COVID',
    bloodPressureLabel: 'Presión arterial',
    positive: 'Positivo',
    negative: 'Negativo',
    indeterminate: 'Indeterminado',
    open: 'Abierto',
    closed: 'Cerrado',
    high: 'Alta',
    low: 'Baja',
    firm: 'Firme',
    soft: 'Suave',
    // Insights
    notEnoughData: 'No hay suficientes datos para mostrar un análisis detallado.',
    keepTracking: 'Sigue registrando tus ciclos y síntomas para descubrir patrones.',
    favoriteSymptoms: 'Síntomas favoritos',
    markImportantSymptoms: 'Marca tus síntomas más importantes con una estrella para verlos aquí.',
    cycleDuration: 'Duración del ciclo',
    average: 'Promedio',
    days: 'días',
    cycleHistory: 'Historial de ciclos',
    currentCycle: 'Ciclo actual',
    cycle: 'Ciclo',
    symptomAnalysis: 'Análisis de síntomas',
    records: 'registros',
    record: 'registro',
    discoverPatterns: 'Descubre patrones en tu salud menstrual',
    unknownSymptom: 'Síntoma desconocido',
    cycleDurationChartAria: 'Gráfico de duración de los últimos ciclos',

    // Settings
    configuration: 'Configuración',
    personalizeExperience: 'Personaliza tu experiencia',
    cycleConfiguration: 'Configuración del ciclo',
    averageCycleDuration: 'Duración promedio del ciclo (días)',
    lutealPhaseDuration: 'Duración de la fase lútea (días)',
    privacy: 'Privacidad',
    discreteMode: 'Modo discreto',
    hideSpecificTerms: 'Oculta términos específicos del ciclo menstrual',
    dataManagement: 'Gestión de datos',
    createBackup: 'Crear copia de seguridad',
    restoreData: 'Restaurar datos',
    exportToCsv: 'Exportar a CSV',
    deleteAllData: 'Eliminar todos los datos',
    developmentTools: 'Herramientas de desarrollo',
    developerMode: 'Modo desarrollador',
    fillWithTestData: 'Llena la app con datos de prueba realistas',
    copyDebugInfo: 'Copiar info de depuración',
    reloadApp: 'Recargar aplicación',
    logSettingsConsole: 'Mostrar ajustes en la consola',
    saveConfiguration: 'Guardar configuración',
    language: 'Idioma',
    automatic: 'Automático',
    spanish: 'Español',
    english: 'Inglés',
    turkish: 'Turco',
    settingsSaved: 'Ajustes guardados.',
    backupCreationError: 'No se pudo crear la copia de seguridad.',
    restoreConfirm: '¿Estás segura? Esto sobrescribirá todos tus datos actuales.',
    restoreSuccess: 'Datos restaurados con éxito.',
    invalidBackupFile: 'Archivo de copia de seguridad inválido.',
    restoreFailed: 'No se pudo restaurar la copia de seguridad. El archivo puede estar dañado o tener un formato incorrecto.',
    deleteDataConfirm: '¿Estás segura? Esto borrará TODOS tus datos permanentemente.',
    dataDeleted: 'Todos los datos han sido eliminados.',
    deleteDataError: 'Error al eliminar los datos.',
    exportError: 'Error al exportar los registros.',
    debugCopySuccess: 'Información de debug copiada al portapapeles.',
    debugCopyError: 'Error al copiar información de debug.',
    devModeEnabled: 'Modo desarrollador activado.',
    devModeDisabled: 'Modo desarrollador desactivado. La app está vacía.',
    devModeError: 'Error al cambiar el modo desarrollador.',
    devModeEnableConfirm: '¿Activar Modo Desarrollador? Esto borrará todos tus datos actuales y los reemplazará con datos de prueba.',
    devModeDisableConfirm: '¿Desactivar Modo Desarrollador? Esto borrará todos los datos de prueba.',
    date: 'Fecha',
    aiUnavailable: 'API de Gemini no configurada. El consejo del día no está disponible.',
    aiFallbackMessage: 'Cuida de ti hoy. Escucha a tu cuerpo y dale lo que necesita.',

    // Additional UI copy
    appTagline: 'Salud menstrual inteligente',
    madeWithLoveForAzra: 'Con amor para Azra',
    logSymptoms: 'Registrar síntomas',
    savedInsightsTabPinned: 'Fijados',
    savedInsightsTabSaved: 'Guardados',
    noSavedInsights: 'No tienes insights guardados',
    noPinnedInsights: 'No tienes insights fijados',
    chatWithAI: 'Chatear con IA',
    chatInsightsDescription: 'Analiza tu registro de hoy y obtén recomendaciones personalizadas',
    startChat: 'Iniciar Chat',
    chatContextLabel: 'Contexto:',
    chatContextLog: 'Registro de {date}',
    aiLogTitle: 'Registro con IA',
    aiLogSubtitleInput: 'Describe tu día',
    aiLogSubtitleReview: 'Revisa y confirma',
    aiLogExamplesLabel: 'Ejemplos de lo que puedes decir:',
    aiLogExample1: 'Menstruación abundante rojo oscuro con coágulos, usé 4 toallas, dolor 7/10 con cólicos',
    aiLogExample2: 'Migraña con aura nivel 8, tomé ibuprofeno 400mg, dormí mal 5 horas',
    aiLogExample3: 'Test ovulación positivo, flujo clara de huevo, cérvix alto y suave',
    aiLogExample4: 'Ejercicio moderado 45 minutos corriendo, quemé 350 calorías, bebí 2 litros de agua',
    aiLogExample5: 'Ansiedad alta por trabajo, estrés 8/10, antojo de chocolate, sin energía',
    aiLogDescribeLabel: 'Describe tu día',
    aiLogPlaceholder: 'Escribe o dicta cómo te sientes hoy, qué síntomas tienes, tu nivel de energía...',
    aiLogCharacters: '{count} caracteres',
    aiLogClear: 'Limpiar',
    aiLogVoiceIdle: 'Usar micrófono',
    aiLogVoiceRecording: 'Grabando... (toca para detener)',
    aiLogConfidence: 'Confianza del análisis',
    aiLogAnalyze: 'Analizar',
    aiLogAnalyzing: 'Analizando...',
    aiLogApply: 'Aplicar sugerencias',
    aiLogSummaryTitle: 'Resumen detectado',
    aiLogDetectedFieldsTitle: 'Campos detectados',
    aiLogAmbiguousTitle: 'Algunos campos necesitan confirmación',
    aiLogAmbiguousText: 'Los campos marcados con "?" fueron detectados pero pueden no ser precisos. Podrás editarlos después de aplicar las sugerencias.',
    chatQuickCycle: '¿Cómo está mi ciclo?',
    chatQuickSleep: 'Analiza mi sueño',
    chatQuickSymptoms: '¿Qué síntomas tengo?',
    chatQuickRecommendations: 'Recomendaciones',
    devToolsHeading: '🛠️ Generación de Datos',
    devFillLast7: 'Rellenar Últimos 7 Días',
    devFillLast30: 'Rellenar Últimos 30 Días',
    devFillMissing: 'Rellenar Días Faltantes (90d)',
    devGeneratedLogs: '✅ Se generaron {count} registros para los últimos {range} días',
    devGeneratedToday: '✅ Registro de hoy generado correctamente',
    devGenerateError: '❌ Error al generar registros',
    devTodayError: '❌ Error al generar registro de hoy',
    devNoMissingDays: 'ℹ️ No hay días faltantes en los últimos 90 días',
    devFilledMissingDays: '✅ Se rellenaron {count} días faltantes',
    devFillMissingError: '❌ Error al rellenar días faltantes',
    deleteDataModalTitle: '⚠️ Eliminar todos los datos',
    deleteWarning: 'Esta acción es permanente y no se puede deshacer. Todos tus datos serán eliminados.',
    discreteModeDescription: 'Oculta términos específicos en la interfaz para mayor privacidad en espacios públicos',
    generateTodayLog: 'Generar Registro de Hoy',
    unsavedChanges: 'Cambios no guardados',
    discardChanges: 'Descartar',
    cyclePhasesTitle: 'Fases del ciclo',
    indicatorsTitle: 'Indicadores',
    ovulationDayIndicator: 'Día de ovulación',
    periodIntensityIndicator: 'Intensidad menstrual (1-3)',
    moodRecordedIndicator: 'Estado de ánimo registrado',
    symptomsRecordedIndicator: 'Síntomas registrados',
    notesWrittenIndicator: 'Notas escritas',
    predictionUnconfirmed: 'Predicción (no confirmado)',
    today: 'Hoy',
    predictions: 'Predicciones',
    exportCsv: 'Exportar CSV',
    exportICal: 'Exportar iCal',
    simplifiedMode: 'Simplificado',
    advancedMode: 'Avanzado',
    fertility: 'Fertilidad',
    pain: 'Dolor',
    mentalAndLibido: 'Estado mental & Libido',
    sleepHabits: 'Sueño & Hábitos',
    activity: 'Actividad física',
    medicationCare: 'Medicación & Cuidado',
    healthAndTests: 'Salud & Tests',

    // Daily insight modal
    dailyInsightModalTitle: 'Resumen completo de tu día',
    dailyInsightModalSleepTitle: 'Sueño',
    dailyInsightModalHydrationTitle: 'Hidratación',
    dailyInsightModalActivityTitle: 'Actividad física',
    dailyInsightModalInsightTitle: 'Insight del día',
    dailyInsightStressTitle: 'Estrés',
    dailyInsightFlowVeryHeavy: 'Muy abundante',
    dailyInsightInsufficientSleep: 'Tu sueño fue insuficiente hoy. Intenta dormir 7-9 horas para mejor recuperación.',
    dailyInsightIdealSleep: '¡Excelente! Dormiste las horas recomendadas.',
    dailyInsightLowMoodEnergy: 'Tu ánimo bajo y poca energía pueden estar relacionados. Considera una caminata corta o actividad que disfrutes.',
    dailyInsightHighPain: 'Tu nivel de dolor es alto. Considera aplicar calor local y descansar. Si persiste, consulta con tu médico.',
    dailyInsightHighStress: 'Tu nivel de estrés es elevado. Prueba técnicas de respiración o meditación para relajarte.',
    dailyInsightLowHydration: 'Tu hidratación está baja. Intenta beber al menos 2L de agua al día.',
    dailyInsightHydrationOk: '¡Bien hecho! Estás bien hidratada.',
    dailyInsightActivityPraise: '¡Genial! La actividad física ayuda a regular tu ciclo y mejorar tu ánimo.',
    dailyInsightFallback: 'Sigue registrando tus datos para obtener insights personalizados.',

    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    back: 'Volver',
    noMedicationsAdded: 'No hay medicamentos agregados',
  },

  en: {
    // Navigation
    appName: 'Aura Cycle',
    home: 'Home',
    calendar: 'Calendar',
    log: 'Log',
    insights: 'Insights',
    settings: 'Settings',

    // Home page
    dayOfCycle: 'Day of cycle',
    calculating: 'Calculating',
    currentPhase: 'Current phase',
    nextPeriod: 'Next period',
    nextEvent: 'Next event',
    fertileWindow: 'Fertile window',
    relevantWindow: 'Relevant window',
    howDoYouFeel: 'How do you feel today?',
    dailyTip: 'Daily tip',
    poweredByGemini: 'Powered by Gemini',
    medicalDisclaimer: 'This app does not provide a medical diagnosis; consult a healthcare professional with any questions.',

    // Phases
    menstruation: 'Menstruation',
    follicular: 'Follicular phase',
    ovulation: 'Ovulation',
    luteal: 'Luteal phase',

    // Moods
    terrible: 'Terrible',
    bad: 'Bad',
    normal: 'Normal',
    good: 'Good',
    great: 'Great',

    // Calendar
    cycleAnalysis: 'Cycle analysis',
    legend: 'Legend',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',

    // Log page
    dailyRecord: 'Daily log',
    menstruationIntensity: 'Period flow',
    noFlow: 'No flow',
    spotting: 'Spotting',
    light: 'Light',
    medium: 'Medium',
    heavy: 'Heavy',
    mood: 'Mood',
    symptoms: 'Symptoms',
    notes: 'Notes',
    saveRecord: 'Save log',
    addAnyAdditionalNotes: 'Add any additional notes about your day...',
    logSaved: 'Log saved!',
    loading: 'Loading...',

    // Insights controls
    analysisModeSimple: 'Simple',
    analysisModeAI: 'AI',
    analysisModeLabel: 'Mode {mode}',
    viewModeLabel: 'View {view}',
    viewDay: 'Day',
    viewWeek: 'Week',
    viewMonth: 'Month',
    viewCycle: 'Cycle',
    viewYear: 'Year',
    exportData: 'Export',
    noLogTodayTitle: 'No log today',
    noLogTodayDescription: 'No data recorded for today. Log your information to see the analysis.',
    insightsEmptyTitle: 'Cycle Analysis',
    insightsEmptyDescriptionLine1: 'You need at least 2 logged cycles to view analysis.',
    insightsEmptyDescriptionLine2: 'Keep logging your data to get personalized insights.',
    insightsDaySubtitle: 'Full analysis of your day',
    insightsWeekSubtitle: 'Weekly trends analysis',
    insightsMonthSubtitle: 'Full monthly analysis',
    insightsCurrentCycleSubtitle: 'Current cycle insights',
    insightsQuarterlySubtitle: 'Quarterly analysis',
    insightsSemiAnnualSubtitle: 'Semiannual analysis',
    insightsAnnualSubtitle: 'Annual analysis',
    insightsGeneralTitle: 'General Analysis',
    insightsGeneralSubtitle: 'Overview of your data',
    insightsRangeTitle: 'Last {months} months',

    // Advanced logging modules
    menstruationColorLabel: 'Color',
    menstruationColorBrightRed: 'Bright red',
    menstruationColorDarkRed: 'Dark red',
    menstruationColorBrown: 'Brown',
    menstruationColorPink: 'Pink',
    menstruationConsistencyLabel: 'Consistency',
    menstruationConsistencyWatery: 'Watery',
    menstruationConsistencyThick: 'Thick',
    menstruationConsistencyClotty: 'Clotty',
    menstruationClots: 'Clots',
    menstruationProductsLabel: 'Products used',
    menstruationProductPad: 'Pad',
    menstruationProductTampon: 'Tampon',
    menstruationProductCup: 'Cup',
    menstruationProductDisc: 'Disc',
    menstruationProductSize: 'Size',
    menstruationProductQuantity: 'Quantity',
    menstruationLeaks: 'Leaks',
    menstruationStartedToday: 'Started today',
    ovulationTestLabel: 'Ovulation test (LH)',
    ovulationTestPositive: 'Positive',
    ovulationTestNegative: 'Negative',
    ovulationTestIndeterminate: 'Indeterminate',
    cervicalFlowLabel: 'Cervical flow',
    cervicalFlowDry: 'Dry',
    cervicalFlowSticky: 'Sticky',
    cervicalFlowCreamy: 'Creamy',
    cervicalFlowWatery: 'Watery',
    cervicalFlowEggWhite: 'Egg-white',
    cervixPositionLabel: 'Position',
    cervixPositionHigh: 'High',
    cervixPositionMedium: 'Medium',
    cervixPositionLow: 'Low',
    cervixFirmnessLabel: 'Firmness',
    cervixFirmnessFirm: 'Firm',
    cervixFirmnessSoft: 'Soft',
    cervixOpeningLabel: 'Opening',
    cervixOpeningOpen: 'Open',
    cervixOpeningClosed: 'Closed',
    sexualActivityLabel: 'Sexual activity',
    protectionLabel: 'Protection',
    painLevelLabel: 'Pain level (0-10)',
    painLocationLabel: 'Location',
    painLocationCramps: 'Cramps',
    painLocationHeadache: 'Headache',
    painLocationBack: 'Back',
    painLocationBreasts: 'Breasts',
    painDurationLabel: 'Approximate duration',
    painDurationPlaceholder: 'e.g.: 2 hours, all day',
    mentalAnxiety: 'Anxiety',
    mentalSadness: 'Sadness',
    mentalIrritability: 'Irritability',
    mentalCalmness: 'Calmness',
    mentalMotivationLabel: 'Motivation',
    mentalMotivationLow: 'Low',
    mentalMotivationMedium: 'Medium',
    mentalMotivationHigh: 'High',
    mentalLibidoLabel: 'Libido',
    mentalLibidoLow: 'Low',
    mentalLibidoNormal: 'Normal',
    mentalLibidoHigh: 'High',
    mentalStressLabel: 'Stress (0-10)',
    mentalStressTriggersLabel: 'Triggers',
    mentalStressTriggerWork: 'Work',
    mentalStressTriggerStudy: 'Study',
    mentalStressTriggerRelationship: 'Relationship',
    mentalStressTriggerFamily: 'Family',
    mentalStressTriggerHealth: 'Health',
    mentalStressTriggerMoney: 'Money',
    mentalStressTriggerPlaceholder: 'e.g.: Traffic, Exam...',
    energyLabel: 'Energy',
    sleepHoursLabel: 'Sleep hours',
    sleepQualityLabel: 'Quality (1-5)',
    sleepBedTimeLabel: 'Bedtime',
    sleepWakeTimeLabel: 'Wake-up time',
    sleepNapLabel: 'Nap (minutes)',
    sleepWaterLabel: 'Water (L)',
    sleepCaffeineLabel: 'Caffeine',
    sleepAlcoholLabel: 'Alcohol',
    cravingsLabel: 'Cravings',
    cravingsSweet: 'Sweet',
    cravingsSalty: 'Salty',
    cravingsChocolate: 'Chocolate',
    cravingsSpicy: 'Spicy',
    cravingsCarbs: 'Carbs',
    cravingsPlaceholder: 'e.g.: Pizza, Ice cream...',
    activityIntensityLabel: 'Intensity',
    activityIntensityNone: 'None',
    activityIntensityLight: 'Light',
    activityIntensityModerate: 'Moderate',
    activityIntensityIntense: 'Intense',
    activityTypeLabel: 'Activity type',
    activityTypeWalking: 'Walking',
    activityTypeRunning: 'Running',
    activityTypeStrength: 'Strength',
    activityTypeYoga: 'Yoga',
    activityTypeCycling: 'Cycling',
    activityTypeSwimming: 'Swimming',
    activityTypePlaceholder: 'e.g.: Pilates, Dance...',
    activityDurationLabel: 'Duration (min)',
    activityRpeLabel: 'RPE (1-10)',
    activityStepsLabel: 'Steps',
    activityRestingHrLabel: 'Resting HR',
    activityCaloriesLabel: 'Calories',
    medicationsLabel: 'Medications',
    addMedication: 'Add',
    medicationNamePlaceholder: 'Name',
    medicationDosePlaceholder: 'Dose',
    supplementsLabel: 'Supplements',
    supplementIron: 'Iron',
    supplementMagnesium: 'Magnesium',
    supplementOmega3: 'Omega-3',
    supplementVitaminD: 'Vitamin D',
    supplementCalcium: 'Calcium',
    supplementZinc: 'Zinc',
    supplementsPlaceholder: 'e.g.: Vitamin B12, Collagen...',
    contraceptionLabel: 'Contraceptive',
    contraceptionPlaceholder: 'e.g.: Pill, IUD',
    contraceptionDayLabel: 'Blister day',
    iudLabel: 'I have an IUD',
    homeRemediesLabel: 'Home remedies',
    homeRemedyHeatingPad: 'Heating pad',
    homeRemedyColdCompress: 'Cold compress',
    homeRemedyTea: 'Tea',
    homeRemedyHotBath: 'Hot bath',
    homeRemedyMassage: 'Massage',
    homeRemedyMeditation: 'Meditation',
    homeRemediesPlaceholder: 'e.g.: Aromatherapy, Yoga...',
    basalTemperatureLabel: 'Basal temperature (°C)',
    weightLabel: 'Weight (kg)',
    pregnancyTestLabel: 'Pregnancy test',
    notTaken: 'Not taken',
    coldSymptomsLabel: 'Cold symptoms',
    covidSymptomsLabel: 'COVID symptoms',
    bloodPressureLabel: 'Blood pressure',
    positive: 'Positive',
    negative: 'Negative',
    indeterminate: 'Indeterminate',
    open: 'Open',
    closed: 'Closed',
    high: 'High',
    low: 'Low',
    firm: 'Firm',
    soft: 'Soft',
    // Insights
    notEnoughData: 'Not enough data to show detailed insights yet.',
    keepTracking: 'Keep tracking your cycles and symptoms to discover patterns.',
    favoriteSymptoms: 'Favorite symptoms',
    markImportantSymptoms: 'Star your most important symptoms to see them here.',
    cycleDuration: 'Cycle length',
    average: 'Average',
    days: 'days',
    cycleHistory: 'Cycle history',
    currentCycle: 'Current cycle',
    cycle: 'Cycle',
    symptomAnalysis: 'Symptom analysis',
    records: 'records',
    record: 'record',
    discoverPatterns: 'Discover patterns in your menstrual health',
    unknownSymptom: 'Unknown symptom',
    cycleDurationChartAria: 'Chart showing the length of recent cycles',

    // Settings
    configuration: 'Configuration',
    personalizeExperience: 'Personalize your experience',
    cycleConfiguration: 'Cycle configuration',
    averageCycleDuration: 'Average cycle length (days)',
    lutealPhaseDuration: 'Luteal phase length (days)',
    privacy: 'Privacy',
    discreteMode: 'Discrete mode',
    hideSpecificTerms: 'Hide menstruation-specific terms',
    dataManagement: 'Data management',
    createBackup: 'Create backup',
    restoreData: 'Restore data',
    exportToCsv: 'Export to CSV',
    deleteAllData: 'Delete all data',
    developmentTools: 'Development tools',
    developerMode: 'Developer mode',
    fillWithTestData: 'Fill the app with realistic test data',
    copyDebugInfo: 'Copy debug info',
    reloadApp: 'Reload application',
    logSettingsConsole: 'Log settings to console',
    saveConfiguration: 'Save configuration',
    language: 'Language',
    automatic: 'Automatic',
    spanish: 'Spanish',
    english: 'English',
    turkish: 'Turkish',
    settingsSaved: 'Settings saved.',
    backupCreationError: 'Unable to create the backup.',
    restoreConfirm: 'Are you sure? This will overwrite all of your current data.',
    restoreSuccess: 'Backup restored successfully.',
    invalidBackupFile: 'Invalid backup file.',
    restoreFailed: 'We couldn’t restore the backup. The file may be damaged or formatted incorrectly.',
    deleteDataConfirm: 'Are you sure? This will permanently delete ALL of your data.',
    dataDeleted: 'All data has been deleted.',
    deleteDataError: 'Error while deleting the data.',
    exportError: 'Error while exporting the records.',
    debugCopySuccess: 'Debug information copied to clipboard.',
    debugCopyError: 'Could not copy debug information.',
    devModeEnabled: 'Developer mode enabled.',
    devModeDisabled: 'Developer mode disabled. The app is now empty.',
    devModeError: 'Error while toggling developer mode.',
    devModeEnableConfirm: 'Enable Developer Mode? This will delete all of your data and replace it with sample data.',
    devModeDisableConfirm: 'Disable Developer Mode? This will delete all sample data.',
    date: 'Date',
    aiUnavailable: 'Gemini API key not configured. The daily tip is unavailable.',
    aiFallbackMessage: 'Take care of yourself today. Listen to your body and give it what it needs.',

    // Additional UI copy
    appTagline: 'Smart menstrual health',
    madeWithLoveForAzra: 'With love for Azra',
    logSymptoms: 'Log symptoms',
    savedInsightsTabPinned: 'Pinned',
    savedInsightsTabSaved: 'Saved',
    noSavedInsights: 'No saved insights yet',
    noPinnedInsights: 'No pinned insights yet',
    chatWithAI: 'Chat with AI',
    chatInsightsDescription: 'Analyze today\'s log and get personalized recommendations',
    startChat: 'Start chat',
    chatContextLabel: 'Context:',
    chatContextLog: 'Log from {date}',
    aiLogTitle: 'AI Log',
    aiLogSubtitleInput: 'Describe your day',
    aiLogSubtitleReview: 'Review and confirm',
    aiLogExamplesLabel: 'Examples of what you can say:',
    aiLogExample1: 'Heavy dark-red period with clots, used 4 pads, pain 7/10 with cramps',
    aiLogExample2: 'Migraine with aura level 8, took 400mg ibuprofen, slept poorly 5 hours',
    aiLogExample3: 'Positive ovulation test, egg-white discharge, cervix high and soft',
    aiLogExample4: 'Moderate exercise 45 minutes running, burned 350 calories, drank 2 liters of water',
    aiLogExample5: 'High work anxiety, stress 8/10, craving chocolate, low energy',
    aiLogDescribeLabel: 'Describe your day',
    aiLogPlaceholder: 'Type or dictate how you feel today, symptoms, your energy level...',
    aiLogCharacters: '{count} characters',
    aiLogClear: 'Clear',
    aiLogVoiceIdle: 'Use microphone',
    aiLogVoiceRecording: 'Recording... (tap to stop)',
    aiLogConfidence: 'Analysis confidence',
    aiLogAnalyze: 'Analyze',
    aiLogAnalyzing: 'Analyzing...',
    aiLogApply: 'Apply suggestions',
    aiLogSummaryTitle: 'Detected summary',
    aiLogDetectedFieldsTitle: 'Detected fields',
    aiLogAmbiguousTitle: 'Some fields need confirmation',
    aiLogAmbiguousText: 'Fields marked with "?" were detected but may be imprecise. You can edit them after applying the suggestions.',
    chatQuickCycle: 'How is my cycle looking?',
    chatQuickSleep: 'Analyze my sleep',
    chatQuickSymptoms: 'What symptoms do I have?',
    chatQuickRecommendations: 'Recommendations',
    // Insights dashboard
    kpiCycleAverage: 'Average cycle length (days)',
    kpiVariability: 'Variability (days)',
    kpiRegularity: 'Regularity',
    kpiPeriodDuration: 'Average menstruation (days)',
    cycleDurationTitle: 'Cycle duration',
    cycleHistoryTitle: 'Cycle history',
    cycleLabel: 'Cycle {number}',
    chartDurationLabel: 'Duration',
    chartMovingAverageLabel: 'Moving average',
    chartIrregularLabel: 'Irregular',
    symptomAnalysisTitle: 'Symptom analysis',
    symptomHeatmapTitle: 'Symptom heatmap',
    symptomHeatmapNoData: 'No symptom data available',
    phaseMenstruation: 'Menstruation',
    phaseFollicular: 'Follicular',
    phaseOvulation: 'Ovulation',
    phaseLuteal: 'Luteal',
    phaseShortMenstruation: 'Men',
    phaseShortFollicular: 'Fol',
    phaseShortOvulation: 'Ovu',
    phaseShortLuteal: 'Lut',
    correlationsTitle: 'Correlations',
    correlationNoData: 'Not enough data to show correlations',
    correlationMatchSingular: '{count} match',
    correlationMatchPlural: '{count} matches',

    // Weekly insights view
    weeklySummaryWeekRange: 'Week of {start} to {end}',
    weeklySummaryRecords: 'You logged {logs} days between {start} and {end}.',
    weeklySummaryTitle: 'Weekly recap',
    weeklySummaryDays: '{count} days',
    metricSleep: 'Sleep',
    metricPain: 'Pain',
    metricStress: 'Stress',
    metricHydration: 'Hydration',
    metricMood: 'Mood',
    metricEnergy: 'Energy',
    dailyBreakdownTitle: 'Daily breakdown',
    weeklyNoRecord: 'No records yet for this week',
    physicalActivityTitle: 'Physical activity',
    activityDaysLabel: 'Active days',
    activityGoalLabel: 'Weekly goal',
    totalMinutesLabel: 'Total minutes',
    sleepQualityTitle: 'Sleep quality',
    sleepAvgHours: 'Avg hours',
    sleepAvgQuality: 'Avg quality',
    sleepGoodDays: 'Good sleep days',
    mentalWellnessTitle: 'Mental wellness',
    avgMoodLabel: 'Avg mood',
    highStressDaysLabel: 'High stress days',
    highEnergyDaysLabel: 'High energy days',
    commonSymptomsTitle: 'Common symptoms',
    consumptionTrendsTitle: 'Consumption trends',
    caffeineLabel: 'Caffeine',
    alcoholLabel: 'Alcohol',
    frequentCravings: 'Frequent cravings',
    weeklyPatternsTitle: 'Weekly patterns',
    highConfidenceLabel: 'High confidence',
    weeklyChatSubtitle: 'Share your week with AI and get clarity',
    weeklyInsightConsistency: '{logs}/7 days logged this week.',
    weeklyInsightSleep: 'Sleep average: {hours}h. Aim for 7-9h daily.',
    weeklyInsightMood: 'Mood average: {mood}/5. Keep taking care of yourself.',
    weeklyInsightActivity: '{days} active days, {minutes} total minutes.',
    weeklyInsightPain: 'Pain average: {pain}/10.',
    weeklyInsightHydration: 'Hydration average: {liters}L.',
    weeklyInsightTopSymptom: 'Most frequent symptom: {symptom} ({count} days).',
    weeklyInsightCaffeine: 'Caffeine average: {cups} cups/day.',

    // Monthly insights view
    loggedDaysLabel: 'Logged days',
    cyclesThisMonthTitle: 'Cycles this month',
    startLabel: 'Start',
    energyDistributionTitle: 'Energy distribution',
    monthlyInsightsTitle: 'Monthly insights',
    monthlyInsightConsistency: '{days}/{total} days logged this month.',
    monthlyInsightCycles: '{count} cycle(s) logged this month.',
    monthlyInsightSleepLow: 'Low sleep: {hours}h average. Aim for 7-9h.',
    monthlyInsightSleepGood: 'Healthy sleep: {hours}h average. Nice job!',
    monthlyInsightPain: 'Pain on {days} days. Average {pain}/10.',
    monthlyInsightStress: '{days} high-stress days. Average {stress}/10.',
    monthlyInsightActivityHigh: 'Activity: {active} days ({percent}% of the month).',
    monthlyInsightActivityLow: 'Low activity: {active} days ({percent}% of the month). Increase gradually.',
    monthlyInsightEnergyLow: 'Energy was mostly low this month.',
    monthlyInsightHydration: 'Hydration average: {liters}L.',
    monthlyInsightTopSymptom: 'Most frequent symptom: {symptom} ({count} days).',

    // AI insights (long range)
    aiTimeRangeDays: 'Last {days} days',
    aiTimeRangeCycles: 'Last {count} cycles',
    aiCycleRegularTitle: 'Regular cycle detected',
    aiCycleIrregularTitle: 'Cycle variability',
    aiCycleWhy: 'Cycle regularity helps predict and track hormonal health.',
    aiCycleInsightRegular: 'Only ±{stdDev} day variation. Easier predictions.',
    aiCycleInsightIrregular: 'Variation of ±{stdDev} days. Keep logging to see patterns.',
    aiCycleEvidenceSummary: 'Avg: {avg} days, deviation: {stdDev} days',
    aiPainHighTitle: 'High pain levels',
    aiPainModerateTitle: 'Moderate pain pattern',
    aiPainWhy: 'Frequent pain affects wellbeing and may need attention.',
    aiPainInsight: 'Pain on {percent}% of days. Avg {avgPain}/10. {highPainDays} severe days.',
    aiPainSummary: '{days} pain days, avg {avgPain}/10',
    aiStressHighTitle: 'High stress detected',
    aiStressModerateTitle: 'Moderate stress levels',
    aiStressWhy: 'Chronic stress impacts sleep, energy, and cycle.',
    aiStressInsight: 'Avg stress {avgStress}/10. High stress on {percent}% of days.',
    aiStressSummary: '{total} days logged, {high} with high stress',
    aiSleepLowTitle: 'Insufficient sleep',
    aiSleepSuboptimalTitle: 'Suboptimal sleep',
    aiSleepGoodTitle: 'Good sleep pattern',
    aiSleepWhy: 'Good sleep supports hormones, mood, and energy.',
    aiSleepInsight: 'Avg {avgSleep}h. {poorSleepDays} days under 6h.{avgQuality, select, undefined {} other { Quality: {avgQuality}/5.}}',
    aiSleepSummary: '{nights} nights logged, avg {avgSleep}h',
    aiEnergyLowTitle: 'Frequent low energy',
    aiEnergyMixedTitle: 'Variable energy pattern',
    aiEnergyWhy: 'Energy levels reflect rest, nutrition, and balance.',
    aiEnergyInsight: '{lowPercent}% of days with low energy. {highDays} high-energy days.',
    aiEnergySummary: '{low} low days, {high} high days',
    aiCorrelationMoodSleepTitle: 'Correlation: sleep & mood',
    aiCorrelationMoodSleepWhy: 'Better sleep helps stabilize mood.',
    aiCorrelationMoodSleepInsight: 'In {percent}% of cases, <6h linked to low mood.',
    aiCorrelationMoodSleepLabelPoor: 'Poor sleep + low mood',
    aiCorrelationMoodSleepLabelOther: 'Other',
    aiCorrelationMoodSleepSummary: '{poor} of {total} days',
    aiHydrationLowTitle: 'Low hydration',
    aiHydrationGoodTitle: 'Good hydration',
    aiHydrationWhy: 'Hydration boosts energy and reduces discomfort.',
    aiHydrationInsight: 'Avg {avgWater}L/day. {lowDays} days under 1.5L.',
    aiHydrationSummary: '{days} days logged, avg {avgWater}L',
    aiActivityLowTitle: 'Low physical activity',
    aiActivityGoodTitle: 'Good activity level',
    aiActivityWhy: 'Exercise supports cycle health and mood.',
    aiActivityInsight: 'Activity on {percent}% of days.{avgDuration, select, undefined {} other { Avg duration: {avgDuration} min.}}',
    aiActivitySummary: '{active} of {total} days with activity',
    aiRecMaintainRoutine: 'Keep your routine',
    aiRecKeepLogging: 'Keep logging your data',
    aiRecTrackFactors: 'Track stressors and changes',
    aiRecConsultDoctor: 'Consult a professional if it persists',
    aiRecSleepRoutine: 'Set a 7-9h sleep routine',
    aiRecPainRelief: 'Use safe pain relief strategies',
    aiRecStressTechniques: 'Use daily relaxation techniques',
    aiRecEnergyCheck: 'Check energy with a basic screening',
    aiRecStayHydrated: 'Aim for 2-2.5L water/day',
    aiRecMoveMore: 'Move at least 30min/day',
    aiNoInsightsTitle: 'No insights yet',
    aiNoInsightsDescription: 'Keep logging to unlock personalized analysis.',
    aiChatAboutInsights: 'Chat about these insights',
    aiMainInsightTitle: 'Main insight',
    aiEvidenceTitle: 'Evidence',
    aiRecommendationsTitle: 'Recommendations',
    devToolsHeading: '🛠️ Data generation',
    devFillLast7: 'Fill last 7 days',
    devFillLast30: 'Fill last 30 days',
    devFillMissing: 'Fill missing days (90d)',
    devGeneratedLogs: '✅ Generated {count} logs for the last {range} days',
    devGeneratedToday: '✅ Today\'s log generated successfully',
    devGenerateError: '❌ Failed to generate logs',
    devTodayError: '❌ Failed to generate today\'s log',
    devNoMissingDays: 'ℹ️ No missing days in the past 90 days',
    devFilledMissingDays: '✅ Filled {count} missing days',
    devFillMissingError: '❌ Failed to fill missing days',
    deleteDataModalTitle: '⚠️ Delete all data',
    deleteWarning: 'This action is permanent and cannot be undone. All of your data will be deleted.',
    discreteModeDescription: 'Hide specific menstrual terms for extra privacy in public spaces',
    generateTodayLog: 'Generate today\'s log',
    unsavedChanges: 'Unsaved changes',
    discardChanges: 'Discard',
    cyclePhasesTitle: 'Cycle phases',
    indicatorsTitle: 'Indicators',
    ovulationDayIndicator: 'Ovulation day',
    periodIntensityIndicator: 'Period intensity (1-3)',
    moodRecordedIndicator: 'Mood recorded',
    symptomsRecordedIndicator: 'Symptoms recorded',
    notesWrittenIndicator: 'Notes written',
    predictionUnconfirmed: 'Prediction (unconfirmed)',
    today: 'Today',
    predictions: 'Predictions',
    exportCsv: 'Export CSV',
    exportICal: 'Export iCal',
    simplifiedMode: 'Simplified',
    advancedMode: 'Advanced',
    fertility: 'Fertility',
    pain: 'Pain',
    mentalAndLibido: 'Mental state & Libido',
    sleepHabits: 'Sleep & Habits',
    activity: 'Physical activity',
    medicationCare: 'Medication & Care',
    healthAndTests: 'Health & Tests',

    // Daily insight modal
    dailyInsightModalTitle: 'Full-day recap',
    dailyInsightModalSleepTitle: 'Sleep',
    dailyInsightModalHydrationTitle: 'Hydration',
    dailyInsightModalActivityTitle: 'Activity',
    dailyInsightModalInsightTitle: 'Daily insight',
    dailyInsightStressTitle: 'Stress',
    dailyInsightFlowVeryHeavy: 'Very heavy',
    dailyInsightInsufficientSleep: 'You didn’t get enough sleep today. Aim for 7-9 hours for better recovery.',
    dailyInsightIdealSleep: 'Great job! You hit the recommended sleep window.',
    dailyInsightLowMoodEnergy: 'Low mood and energy may be related. Try a short walk or something that lifts your spirits.',
    dailyInsightHighPain: 'Pain is high today. Apply heat and rest; talk to a doctor if it persists.',
    dailyInsightHighStress: 'Stress levels are elevated. Practice breathing or mindfulness to calm down.',
    dailyInsightLowHydration: 'Hydration is low. Aim for at least 2L of water today.',
    dailyInsightHydrationOk: 'Nice! Your hydration habits look solid.',
    dailyInsightActivityPraise: 'Nice move! Physical activity supports your cycle and mood.',
    dailyInsightFallback: 'Keep logging—more data unlocks smarter insights.',

    // Common
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    noMedicationsAdded: 'No medications added',
  },

  tr: {
    // Navigation
    appName: 'Aura Döngü',
    home: 'Ana Sayfa',
    calendar: 'Takvim',
    log: 'Kayıt',
    insights: 'Analizler',
    settings: 'Ayarlar',

    // Home page
    dayOfCycle: 'Döngü günü',
    calculating: 'Hesaplanıyor',
    currentPhase: 'Mevcut faz',
    nextPeriod: 'Sonraki adet',
    nextEvent: 'Sonraki olay',
    fertileWindow: 'Doğurgan dönem',
    relevantWindow: 'İlgili dönem',
    howDoYouFeel: 'Bugün nasıl hissediyorsun?',
    dailyTip: 'Günün önerisi',
    poweredByGemini: 'Gemini tarafından desteklenir',
    medicalDisclaimer: 'Bu uygulama tıbbi teşhis sağlamaz; herhangi bir endişeniz varsa bir sağlık uzmanına danışın.',

    // Phases
    menstruation: 'Adet dönemi',
    follicular: 'Foliküler faz',
    ovulation: 'Yumurtlama',
    luteal: 'Luteal faz',

    // Moods
    terrible: 'Berbat',
    bad: 'Kötü',
    normal: 'Normal',
    good: 'İyi',
    great: 'Harika',

    // Calendar
    cycleAnalysis: 'Döngü analizi',
    legend: 'Açıklama',
    previousMonth: 'Önceki ay',
    nextMonth: 'Sonraki ay',

    // Log page
    dailyRecord: 'Günlük kayıt',
    menstruationIntensity: 'Adet akışı',
    noFlow: 'Akış yok',
    spotting: 'Lekelenme',
    light: 'Hafif',
    medium: 'Orta',
    heavy: 'Yoğun',
    mood: 'Ruh hali',
    symptoms: 'Belirtiler',
    notes: 'Notlar',
    saveRecord: 'Kaydı kaydet',
    addAnyAdditionalNotes: 'Gününle ilgili ek notlar ekle...',
    logSaved: 'Kayıt kaydedildi!',
    loading: 'Yükleniyor...',

    // Insights controls
    analysisModeSimple: 'Basit',
    analysisModeAI: 'AI',
    analysisModeLabel: 'Mod {mode}',
    viewModeLabel: 'Görünüm {view}',
    viewDay: 'Gün',
    viewWeek: 'Hafta',
    viewMonth: 'Ay',
    viewCycle: 'Döngü',
    viewYear: 'Yıl',
    exportData: 'Dışa aktar',
    noLogTodayTitle: 'Bugün kayıt yok',
    noLogTodayDescription: 'Bugün için veri kaydedilmedi. Analizi görmek için bilgilerini kaydet.',
    insightsEmptyTitle: 'Döngü Analizi',
    insightsEmptyDescriptionLine1: 'Analizleri görebilmek için en az 2 kayıtlı döngüye ihtiyacın var.',
    insightsEmptyDescriptionLine2: 'Kişiselleştirilmiş içgörüler için verilerini kaydetmeye devam et.',
    insightsDaySubtitle: 'Günün kapsamlı analizi',
    insightsWeekSubtitle: 'Haftalık trend analizi',
    insightsMonthSubtitle: 'Aylık kapsamlı analiz',
    insightsCurrentCycleSubtitle: 'Devam eden döngü analizi',
    insightsQuarterlySubtitle: 'Üç aylık analiz',
    insightsSemiAnnualSubtitle: 'Altı aylık analiz',
    insightsAnnualSubtitle: 'Yıllık analiz',
    insightsGeneralTitle: 'Genel Analiz',
    insightsGeneralSubtitle: 'Verilerinin genel görünümü',
    insightsRangeTitle: 'Son {months} ay',
    // Advanced logging modules
    menstruationColorLabel: 'Renk',
    menstruationColorBrightRed: 'Parlak kırmızı',
    menstruationColorDarkRed: 'Koyu kırmızı',
    menstruationColorBrown: 'Kahverengi',
    menstruationColorPink: 'Pembe',
    menstruationConsistencyLabel: 'Kıvam',
    menstruationConsistencyWatery: 'Sulu',
    menstruationConsistencyThick: 'Kıvamlı',
    menstruationConsistencyClotty: 'Pıhtılı',
    menstruationClots: 'Pıhtılar',
    menstruationProductsLabel: 'Kullanılan ürünler',
    menstruationProductPad: 'Ped',
    menstruationProductTampon: 'Tampon',
    menstruationProductCup: 'Kupa',
    menstruationProductDisc: 'Disk',
    menstruationProductSize: 'Beden',
    menstruationProductQuantity: 'Miktar',
    menstruationLeaks: 'Sızıntılar',
    menstruationStartedToday: 'Bugün başladı',
    ovulationTestLabel: 'Ovulasyon testi (LH)',
    ovulationTestPositive: 'Pozitif',
    ovulationTestNegative: 'Negatif',
    ovulationTestIndeterminate: 'Belirsiz',
    cervicalFlowLabel: 'Servikal akıntı',
    cervicalFlowDry: 'Kuru',
    cervicalFlowSticky: 'Yapışkan',
    cervicalFlowCreamy: 'Kremamsı',
    cervicalFlowWatery: 'Sulu',
    cervicalFlowEggWhite: 'Yumurta akı',
    cervixPositionLabel: 'Pozisyon',
    cervixPositionHigh: 'Yüksek',
    cervixPositionMedium: 'Orta',
    cervixPositionLow: 'Düşük',
    cervixFirmnessLabel: 'Sertlik',
    cervixFirmnessFirm: 'Sert',
    cervixFirmnessSoft: 'Yumuşak',
    cervixOpeningLabel: 'Açıklık',
    cervixOpeningOpen: 'Açık',
    cervixOpeningClosed: 'Kapalı',
    sexualActivityLabel: 'Cinsel aktivite',
    protectionLabel: 'Koruma',
    painLevelLabel: 'Ağrı seviyesi (0-10)',
    painLocationLabel: 'Konum',
    painLocationCramps: 'Kramp',
    painLocationHeadache: 'Baş ağrısı',
    painLocationBack: 'Sırt',
    painLocationBreasts: 'Göğüsler',
    painDurationLabel: 'Yaklaşık süre',
    painDurationPlaceholder: 'örn: 2 saat, tüm gün',
    mentalAnxiety: 'Kaygı',
    mentalSadness: 'Üzüntü',
    mentalIrritability: 'Sinirlilik',
    mentalCalmness: 'Sakinlik',
    mentalMotivationLabel: 'Motivasyon',
    mentalMotivationLow: 'Düşük',
    mentalMotivationMedium: 'Orta',
    mentalMotivationHigh: 'Yüksek',
    mentalLibidoLabel: 'Libido',
    mentalLibidoLow: 'Düşük',
    mentalLibidoNormal: 'Normal',
    mentalLibidoHigh: 'Yüksek',
    mentalStressLabel: 'Stres (0-10)',
    mentalStressTriggersLabel: 'Tetikleyiciler',
    mentalStressTriggerWork: 'İş',
    mentalStressTriggerStudy: 'Çalışma',
    mentalStressTriggerRelationship: 'İlişki',
    mentalStressTriggerFamily: 'Aile',
    mentalStressTriggerHealth: 'Sağlık',
    mentalStressTriggerMoney: 'Para',
    mentalStressTriggerPlaceholder: 'örn: Trafik, Sınav...',
    energyLabel: 'Enerji',
    sleepHoursLabel: 'Uyku süresi',
    sleepQualityLabel: 'Kalite (1-5)',
    sleepBedTimeLabel: 'Uyku saati',
    sleepWakeTimeLabel: 'Uyanma saati',
    sleepNapLabel: 'Şekerleme (dakika)',
    sleepWaterLabel: 'Su (L)',
    sleepCaffeineLabel: 'Kafein',
    sleepAlcoholLabel: 'Alkol',
    cravingsLabel: 'İstekler',
    cravingsSweet: 'Tatlı',
    cravingsSalty: 'Tuzlu',
    cravingsChocolate: 'Çikolata',
    cravingsSpicy: 'Baharatlı',
    cravingsCarbs: 'Karbonhidrat',
    cravingsPlaceholder: 'örn: Pizza, Dondurma...',
    activityIntensityLabel: 'Yoğunluk',
    activityIntensityNone: 'Yok',
    activityIntensityLight: 'Hafif',
    activityIntensityModerate: 'Orta',
    activityIntensityIntense: 'Şiddetli',
    activityTypeLabel: 'Aktivite türü',
    activityTypeWalking: 'Yürüyüş',
    activityTypeRunning: 'Koşu',
    activityTypeStrength: 'Kuvvet',
    activityTypeYoga: 'Yoga',
    activityTypeCycling: 'Bisiklet',
    activityTypeSwimming: 'Yüzme',
    activityTypePlaceholder: 'örn: Pilates, Dans...',
    activityDurationLabel: 'Süre (dk)',
    activityRpeLabel: 'RPE (1-10)',
    activityStepsLabel: 'Adım',
    activityRestingHrLabel: 'Dinlenme HR',
    activityCaloriesLabel: 'Kalori',
    medicationsLabel: 'İlaçlar',
    addMedication: 'Ekle',
    medicationNamePlaceholder: 'İsim',
    medicationDosePlaceholder: 'Doz',
    supplementsLabel: 'Takviyeler',
    supplementIron: 'Demir',
    supplementMagnesium: 'Magnezyum',
    supplementOmega3: 'Omega-3',
    supplementVitaminD: 'D Vitamini',
    supplementCalcium: 'Kalsiyum',
    supplementZinc: 'Çinko',
    supplementsPlaceholder: 'örn: B12 vitamini, Kolajen...',
    contraceptionLabel: 'Doğum kontrolü',
    contraceptionPlaceholder: 'örn: Hap, RİA',
    contraceptionDayLabel: 'Kutu günü',
    iudLabel: 'RİA kullanıyorum',
    homeRemediesLabel: 'Ev çözümleri',
    homeRemedyHeatingPad: 'Sıcak su torbası',
    homeRemedyColdCompress: 'Soğuk kompres',
    homeRemedyTea: 'Çay',
    homeRemedyHotBath: 'Sıcak banyo',
    homeRemedyMassage: 'Masaj',
    homeRemedyMeditation: 'Meditasyon',
    homeRemediesPlaceholder: 'örn: Aromaterapi, Yoga...',
    basalTemperatureLabel: 'Bazal sıcaklık (°C)',
    weightLabel: 'Kilo (kg)',
    pregnancyTestLabel: 'Gebelik testi',
    notTaken: 'Yapılmadı',
    coldSymptomsLabel: 'Soğuk algınlığı belirtileri',
    covidSymptomsLabel: 'COVID belirtileri',
    bloodPressureLabel: 'Kan basıncı',
    positive: 'Pozitif',
    negative: 'Negatif',
    indeterminate: 'Belirsiz',
    open: 'Açık',
    closed: 'Kapalı',
    high: 'Yüksek',
    low: 'Düşük',
    firm: 'Sert',
    soft: 'Yumuşak',
    // Insights
    notEnoughData: 'Detaylı analiz göstermek için yeterli veri yok.',
    keepTracking: 'Paternleri keşfetmek için döngülerinizi ve belirtilerinizi takip etmeye devam edin.',
    favoriteSymptoms: 'Favori belirtiler',
    markImportantSymptoms: 'Burada görmek için en önemli belirtilerinizi yıldızla işaretleyin.',
    cycleDuration: 'Döngü süresi',
    average: 'Ortalama',
    days: 'gün',
    cycleHistory: 'Döngü geçmişi',
    currentCycle: 'Mevcut döngü',
    cycle: 'Döngü',
    symptomAnalysis: 'Belirti analizi',
    records: 'kayıt',
    record: 'kayıt',
    discoverPatterns: 'Adet döngüsü sağlığındaki eğilimleri keşfet',
    unknownSymptom: 'Bilinmeyen belirti',
    cycleDurationChartAria: 'Son döngülerin süresini gösteren grafik',

    // Settings
    configuration: 'Yapılandırma',
    personalizeExperience: 'Deneyimini kişiselleştir',
    cycleConfiguration: 'Döngü yapılandırması',
    averageCycleDuration: 'Ortalama döngü süresi (gün)',
    lutealPhaseDuration: 'Luteal faz süresi (gün)',
    privacy: 'Gizlilik',
    discreteMode: 'Gizli mod',
    hideSpecificTerms: 'Adet döngüsüne özel terimleri gizle',
    dataManagement: 'Veri yönetimi',
    createBackup: 'Yedek oluştur',
    restoreData: 'Verileri geri yükle',
    exportToCsv: 'CSV olarak dışa aktar',
    deleteAllData: 'Tüm verileri sil',
    developmentTools: 'Geliştirici araçları',
    developerMode: 'Geliştirici modu',
    fillWithTestData: 'Uygulamayı gerçekçi test verileriyle doldur',
    copyDebugInfo: 'Hata ayıklama bilgisini kopyala',
    reloadApp: 'Uygulamayı yeniden yükle',
    logSettingsConsole: 'Ayarları konsola yazdır',
    saveConfiguration: 'Yapılandırmayı kaydet',
    language: 'Dil',
    automatic: 'Otomatik',
    spanish: 'İspanyolca',
    english: 'İngilizce',
    turkish: 'Türkçe',
    settingsSaved: 'Ayarlar kaydedildi.',
    backupCreationError: 'Yedek oluşturulamadı.',
    restoreConfirm: 'Emin misiniz? Bu işlem mevcut verilerinizin tamamının üzerine yazacak.',
    restoreSuccess: 'Veriler başarıyla geri yüklendi.',
    invalidBackupFile: 'Geçersiz yedek dosyası.',
    restoreFailed: 'Yedek geri yüklenemedi. Dosya bozulmuş veya yanlış biçimlendirilmiş olabilir.',
    deleteDataConfirm: 'Emin misiniz? Bu işlem TÜM verilerinizi kalıcı olarak silecek.',
    dataDeleted: 'Tüm veriler silindi.',
    deleteDataError: 'Veriler silinirken hata oluştu.',
    exportError: 'Kayıtlar dışa aktarılırken hata oluştu.',
    debugCopySuccess: 'Hata ayıklama bilgileri panoya kopyalandı.',
    debugCopyError: 'Hata ayıklama bilgileri kopyalanamadı.',
    devModeEnabled: 'Geliştirici modu etkinleştirildi.',
    devModeDisabled: 'Geliştirici modu kapatıldı. Uygulama şimdi boş.',
    devModeError: 'Geliştirici modu değiştirilirken hata oluştu.',
    devModeEnableConfirm: 'Geliştirici Modu etkinleştirilsin mi? Bu işlem tüm verilerinizi silip yerlerine örnek veriler ekler.',
    devModeDisableConfirm: 'Geliştirici Modu kapatılsın mı? Bu işlem tüm örnek verileri silecek.',
    date: 'Tarih',
    aiUnavailable: 'Gemini API anahtarı ayarlı değil. Günlük öneri kullanılamıyor.',
    aiFallbackMessage: 'Bugün kendine iyi bak. Bedenini dinle ve ihtiyaç duyduğunu ona ver.',

    // Additional UI copy
    appTagline: 'Akıllı adet sağlığı',
    madeWithLoveForAzra: 'Azra için sevgiyle',
    logSymptoms: 'Semptomları kaydet',
    savedInsightsTabPinned: 'Sabitlenenler',
    savedInsightsTabSaved: 'Kaydedilenler',
    noSavedInsights: 'Kaydedilmiş iç görü yok',
    noPinnedInsights: 'Sabitlenmiş iç görü yok',
    chatWithAI: 'Yapay zekâ ile sohbet',
    chatInsightsDescription: 'Bugünkü kaydını analiz et ve kişiselleştirilmiş öneriler al',
    startChat: 'Sohbeti başlat',
    chatContextLabel: 'Bağlam:',
    chatContextLog: '{date} kaydı',
    aiLogTitle: 'Yapay Zekâ ile Kayıt',
    aiLogSubtitleInput: 'Gününü tarif et',
    aiLogSubtitleReview: 'Gözden geçir ve onayla',
    aiLogExamplesLabel: 'Şu örnekleri söyleyebilirsin:',
    aiLogExample1: 'Koyu kırmızı yoğun adet, pıhtılar var, 4 ped kullandım, ağrı 7/10, kramp',
    aiLogExample2: 'Aura ile migren seviye 8, 400mg ibuprofen aldım, kötü uyudum 5 saat',
    aiLogExample3: 'Ovulasyon testi pozitif, yumurta akı kıvamında akıntı, serviks yüksek ve yumuşak',
    aiLogExample4: 'Orta tempo 45 dk koşu, 350 kalori yaktım, 2 litre su içtim',
    aiLogExample5: 'İş kaynaklı yüksek kaygı, stres 8/10, çikolata isteği, enerjim düşük',
    aiLogDescribeLabel: 'Gününü anlat',
    aiLogPlaceholder: 'Bugün nasıl hissettiğini, belirtilerini, enerji seviyeni yaz veya dikte et...',
    aiLogCharacters: '{count} karakter',
    aiLogClear: 'Temizle',
    aiLogVoiceIdle: 'Mikrofonu kullan',
    aiLogVoiceRecording: 'Kaydediliyor... (durdurmak için dokun)',
    aiLogConfidence: 'Analiz güveni',
    aiLogAnalyze: 'Analiz et',
    aiLogAnalyzing: 'Analiz ediliyor...',
    aiLogApply: 'Önerileri uygula',
    aiLogSummaryTitle: 'Tespit edilen özet',
    aiLogDetectedFieldsTitle: 'Tespit edilen alanlar',
    aiLogAmbiguousTitle: 'Bazı alanlar onay istiyor',
    aiLogAmbiguousText: '"?" ile işaretli alanlar bulundu fakat tam olmayabilir. Önerileri uyguladıktan sonra düzenleyebilirsin.',
    chatQuickCycle: 'Döngüm nasıl gidiyor?',
    chatQuickSleep: 'Uykumu analiz et',
    chatQuickSymptoms: 'Hangi belirtilerim var?',
    chatQuickRecommendations: 'Öneriler',
    // Insights dashboard
    kpiCycleAverage: 'Döngü ortalaması (gün)',
    kpiVariability: 'Değişkenlik (gün)',
    kpiRegularity: 'Düzenlilik',
    kpiPeriodDuration: 'Adet süresi (gün)',
    cycleDurationTitle: 'Döngü süresi',
    cycleHistoryTitle: 'Döngü geçmişi',
    cycleLabel: 'Döngü {number}',
    chartDurationLabel: 'Süre',
    chartMovingAverageLabel: 'Hareketli ortalama',
    chartIrregularLabel: 'Düzensiz',
    symptomAnalysisTitle: 'Belirti analizi',
    symptomHeatmapTitle: 'Belirti heatmap\'i',
    symptomHeatmapNoData: 'Belirti verisi yok',
    phaseMenstruation: 'Adet',
    phaseFollicular: 'Foliküler',
    phaseOvulation: 'Ovulasyon',
    phaseLuteal: 'Luteal',
    phaseShortMenstruation: 'Men',
    phaseShortFollicular: 'Fol',
    phaseShortOvulation: 'Ovu',
    phaseShortLuteal: 'Lut',
    correlationsTitle: 'Korelasyonlar',
    correlationNoData: 'Korelasyonlar için yeterli veri yok',
    correlationMatchSingular: '{count} eşleşme',
    correlationMatchPlural: '{count} eşleşme',
    // Weekly insights view

    weeklySummaryWeekRange: '{start} - {end} haftası',

    weeklySummaryRecords: '{start} ile {end} arasında {logs} gün kaydettin.',

    weeklySummaryTitle: 'Haftalık özet',

    weeklySummaryDays: '{count} gün',

    metricSleep: 'Uyku',

    metricPain: 'Ağrı',

    metricStress: 'Stres',

    metricHydration: 'Hidratasyon',

    metricMood: 'Ruh hali',

    metricEnergy: 'Enerji',

    dailyBreakdownTitle: 'Günlük döküm',

    weeklyNoRecord: 'Bu hafta kayıt yok',

    physicalActivityTitle: 'Fiziksel aktivite',

    activityDaysLabel: 'Aktif günler',

    activityGoalLabel: 'Haftalık hedef',

    totalMinutesLabel: 'Toplam dakika',

    sleepQualityTitle: 'Uyku kalitesi',

    sleepAvgHours: 'Ortalama saat',

    sleepAvgQuality: 'Ortalama kalite',

    sleepGoodDays: 'İyi uyku günleri',

    mentalWellnessTitle: 'Zihinsel iyilik hali',

    avgMoodLabel: 'Ortalama ruh hali',

    highStressDaysLabel: 'Yüksek stresli günler',

    highEnergyDaysLabel: 'Enerji dolu günler',

    commonSymptomsTitle: 'Yaygın semptomlar',

    consumptionTrendsTitle: 'Tüketim trendleri',

    caffeineLabel: 'Kafein',

    alcoholLabel: 'Alkol',

    frequentCravings: 'Sık görülen istekler',

    weeklyPatternsTitle: 'Haftalık desenler',

    highConfidenceLabel: 'Yüksek güven',

    weeklyChatSubtitle: 'Haftanı yapay zekâyla paylaş ve sorularını sor',
    weeklyInsightConsistency: 'Bu hafta {logs}/7 gün kayıt.',
    weeklyInsightSleep: 'Uyku ortalaması: {hours}s. Hedef: günde 7-9s.',
    weeklyInsightMood: 'Ortalama ruh hali: {mood}/5. Kendine iyi bakmaya devam et.',
    weeklyInsightActivity: '{days} aktif gün, toplam {minutes} dk.',
    weeklyInsightPain: 'Ağrı ortalaması: {pain}/10.',
    weeklyInsightHydration: 'Hidrasyon ortalaması: {liters}L.',
    weeklyInsightTopSymptom: 'En sık belirti: {symptom} ({count} gün).',
    weeklyInsightCaffeine: 'Kafein ortalaması: {cups} fincan/gün.',

    // Monthly insights view
    loggedDaysLabel: 'Kaydedilen günler',
    cyclesThisMonthTitle: 'Bu ayki döngüler',
    startLabel: 'Başlangıç',
    energyDistributionTitle: 'Enerji dağılımı',
    monthlyInsightsTitle: 'Aylık içgörüler',
    monthlyInsightConsistency: 'Bu ay {total} günden {days} gün kayıt yaptın.',
    monthlyInsightCycles: 'Bu ay {count} döngü kaydedildi.',
    monthlyInsightSleepLow: 'Düşük uyku: ortalama {hours}s. Hedef 7-9s.',
    monthlyInsightSleepGood: 'Sağlıklı uyku: ortalama {hours}s. Harika!',
    monthlyInsightPain: '{days} günde ağrı. Ortalama {pain}/10.',
    monthlyInsightStress: '{days} günde yüksek stres. Ortalama {stress}/10.',
    monthlyInsightActivityHigh: 'Aktivite: {active} gün (%{percent}).',
    monthlyInsightActivityLow: 'Düşük aktivite: {active} gün (%{percent}). Kademeli artır.',
    monthlyInsightEnergyLow: 'Bu ay enerji çoğunlukla düşüktü.',
    monthlyInsightHydration: 'Hidrasyon ortalaması: {liters}L.',
    monthlyInsightTopSymptom: 'En sık belirti: {symptom} ({count} gün).',

    // AI insights (long range)
    aiTimeRangeDays: 'Son {days} gün',
    aiTimeRangeCycles: 'Son {count} döngü',
    aiCycleRegularTitle: 'Düzenli döngü tespit edildi',
    aiCycleIrregularTitle: 'Döngü değişkenliği',
    aiCycleWhy: 'Döngü düzeni, tahmin ve hormonal sağlığı izlemek için önemlidir.',
    aiCycleInsightRegular: 'Sadece ±{stdDev} günlük değişkenlik. Tahminler daha net.',
    aiCycleInsightIrregular: '±{stdDev} günlük değişkenlik. Kayıt tutmak desenleri görmeye yardımcı olur.',
    aiCycleEvidenceSummary: 'Ortalama: {avg} gün, sapma: {stdDev} gün',
    aiPainHighTitle: 'Yüksek ağrı düzeyleri',
    aiPainModerateTitle: 'Orta düzeyde ağrı deseni',
    aiPainWhy: 'Sık ağrı yaşam kalitesini etkiler ve takip gerektirir.',
    aiPainInsight: 'Günlerin %{percent}’inde ağrı var. Ortalama {avgPain}/10. {highPainDays} günde şiddetli ağrı.',
    aiPainSummary: '{days} ağrı günü, ortalama {avgPain}/10',
    aiStressHighTitle: 'Yüksek stres',
    aiStressModerateTitle: 'Orta stres',
    aiStressWhy: 'Kronik stres uyku, enerji ve döngüyü etkiler.',
    aiStressInsight: 'Stres ortalaması {avgStress}/10. Günlerin %{percent}’inde yüksek stres.',
    aiStressSummary: '{total} gün kaydedildi, {high} günde yüksek stres',
    aiSleepLowTitle: 'Yetersiz uyku',
    aiSleepSuboptimalTitle: 'Optimal olmayan uyku',
    aiSleepGoodTitle: 'İyi uyku deseni',
    aiSleepWhy: 'İyi uyku hormon, enerji ve ruh halini destekler.',
    aiSleepInsight: 'Ortalama {avgSleep}s. {poorSleepDays} gün 6s’den az.{avgQuality, select, undefined {} other { Kalite: {avgQuality}/5.}}',
    aiSleepSummary: '{nights} gece kaydedildi, ortalama {avgSleep}s',
    aiEnergyLowTitle: 'Sık düşük enerji',
    aiEnergyMixedTitle: 'Değişken enerji deseni',
    aiEnergyWhy: 'Enerji düzeyleri dinlenme ve beslenmeyi yansıtır.',
    aiEnergyInsight: 'Günlerin %{lowPercent}’inde enerji düşük. {highDays} günde enerji yüksek.',
    aiEnergySummary: '{low} gün düşük, {high} gün yüksek',
    aiCorrelationMoodSleepTitle: 'İlişki: uyku ve ruh hali',
    aiCorrelationMoodSleepWhy: 'Kaliteli uyku ruh halini dengeler.',
    aiCorrelationMoodSleepInsight: 'Vakaların %{percent}’inde <6s uyku düşük ruh haliyle ilişkili.',
    aiCorrelationMoodSleepLabelPoor: 'Kötü uyku + düşük ruh hali',
    aiCorrelationMoodSleepLabelOther: 'Diğer',
    aiCorrelationMoodSleepSummary: '{poor}/{total} gün',
    aiHydrationLowTitle: 'Düşük hidrasyon',
    aiHydrationGoodTitle: 'İyi hidrasyon',
    aiHydrationWhy: 'Hidrasyon enerji ve rahatlığı destekler.',
    aiHydrationInsight: 'Ortalama {avgWater}L/gün. {lowDays} günde 1.5L’nin altında.',
    aiHydrationSummary: '{days} gün kaydedildi, ortalama {avgWater}L',
    aiActivityLowTitle: 'Düşük fiziksel aktivite',
    aiActivityGoodTitle: 'İyi aktivite seviyesi',
    aiActivityWhy: 'Egzersiz döngüyü ve ruh halini destekler.',
    aiActivityInsight: 'Günlerin %{percent}’inde aktivite.{avgDuration, select, undefined {} other { Ortalama süre: {avgDuration} dk.}}',
    aiActivitySummary: '{active}/{total} günde aktivite',
    aiRecMaintainRoutine: 'Rutini koru',
    aiRecKeepLogging: 'Kayıt tutmaya devam et',
    aiRecTrackFactors: 'Stres ve değişimleri not et',
    aiRecConsultDoctor: 'Devam ederse uzmana danış',
    aiRecSleepRoutine: '7-9s uyku rutini oluştur',
    aiRecPainRelief: 'Güvenli ağrı yönetimi uygula',
    aiRecStressTechniques: 'Günlük gevşeme teknikleri kullan',
    aiRecEnergyCheck: 'Enerji için temel kontroller yap',
    aiRecStayHydrated: 'Günde 2-2.5L su hedefle',
    aiRecMoveMore: 'Günde en az 30dk hareket et',
    aiNoInsightsTitle: 'Henüz içgörü yok',
    aiNoInsightsDescription: 'Kişiselleştirilmiş analiz için kayıt tutmaya devam et.',
    aiChatAboutInsights: 'Bu içgörüler hakkında sohbet et',
    aiMainInsightTitle: 'Ana içgörü',
    aiEvidenceTitle: 'Kanıt',
    aiRecommendationsTitle: 'Öneriler',

    // Daily insight modal
    dailyInsightModalTitle: 'Günün tam özeti',
    dailyInsightModalSleepTitle: 'Uyku',
    dailyInsightModalHydrationTitle: 'Hidrasyon',
    dailyInsightModalActivityTitle: 'Aktivite',
    dailyInsightModalInsightTitle: 'Günlük içgörü',
    dailyInsightStressTitle: 'Stres',
    dailyInsightFlowVeryHeavy: 'Çok yoğun',
    dailyInsightInsufficientSleep: 'Bugün yeterince uyuyamadın. Daha iyi toparlanma için 7-9 saat hedefleyebilirsin.',
    dailyInsightIdealSleep: 'Harika! Tavsiye edilen uyku süresini yakaladın.',
    dailyInsightLowMoodEnergy: 'Düşük ruh hali ve enerji ilişkili olabilir. Kısa bir yürüyüş veya sevdiğin bir aktivite yardımcı olabilir.',
    dailyInsightHighPain: 'Ağrı seviyesi yüksek. Isı uygulayıp dinlen ve devam ederse doktora danış.',
    dailyInsightHighStress: 'Stres seviyesi yüksek. Nefes egzersizleri veya meditasyon rahatlatabilir.',
    dailyInsightLowHydration: 'Hidrasyon düşük. Günlük en az 2L su içmeye çalış.',
    dailyInsightHydrationOk: 'Harika! Hidrasyonun iyi durumda.',
    dailyInsightActivityPraise: 'Harika! Fiziksel aktivite döngünü ve ruh halini destekler.',
    dailyInsightFallback: 'Daha fazla kayıt gir, böylece sana özel içgörüler güçlenir.',
    devToolsHeading: '🛠️ Veri oluşturma',
    devFillLast7: 'Son 7 günü doldur',
    devFillLast30: 'Son 30 günü doldur',
    devFillMissing: 'Eksik günleri doldur (90g)',
    devGeneratedLogs: '✅ Son {range} gün için {count} kayıt üretildi',
    devGeneratedToday: '✅ Bugünün kaydı başarıyla oluşturuldu',
    devGenerateError: '❌ Kayıt oluşturulamadı',
    devTodayError: '❌ Bugünün kaydı oluşturulamadı',
    devNoMissingDays: 'ℹ️ Son 90 günde eksik gün yok',
    devFilledMissingDays: '✅ {count} eksik gün dolduruldu',
    devFillMissingError: '❌ Eksik günler doldurulamadı',
    deleteDataModalTitle: '⚠️ Tüm verileri sil',
    deleteWarning: 'Bu işlem kalıcıdır ve geri alınamaz. Tüm verileriniz silinecektir.',
    discreteModeDescription: 'Kamuya açık alanlarda gizliliği artırmak için belirli adet terimlerini gizle',
    generateTodayLog: 'Bugünün kaydını oluştur',
    unsavedChanges: 'Kaydedilmemiş değişiklikler',
    discardChanges: 'İptal et',
    cyclePhasesTitle: 'Döngü aşamaları',
    indicatorsTitle: 'Göstergeler',
    ovulationDayIndicator: 'Ovulasyon günü',
    periodIntensityIndicator: 'Adet yoğunluğu (1-3)',
    moodRecordedIndicator: 'Kaydedilmiş ruh hali',
    symptomsRecordedIndicator: 'Kaydedilmiş belirtiler',
    notesWrittenIndicator: 'Yazılmış notlar',
    predictionUnconfirmed: 'Tahmin (onaylanmamış)',
    today: 'Bugün',
    predictions: 'Tahminler',
    exportCsv: 'CSV dışa aktar',
    exportICal: 'iCal dışa aktar',
    simplifiedMode: 'Basitleştirilmiş',
    advancedMode: 'Gelişmiş',
    fertility: 'Doğurganlık',
    pain: 'Ağrı',
    mentalAndLibido: 'Zihinsel durum & Libido',
    sleepHabits: 'Uyku & Alışkanlıklar',
    activity: 'Fiziksel aktivite',
    medicationCare: 'İlaç & Bakım',
    healthAndTests: 'Sağlık & Testler',

    // Common
    save: 'Kaydet',
    cancel: 'İptal',
    confirm: 'Onayla',
    delete: 'Sil',
    edit: 'Düzenle',
    close: 'Kapat',
    back: 'Geri',
    noMedicationsAdded: 'İlaç eklenmedi',
  },

  auto: {} as Translations,
};

type SupportedLanguage = Exclude<Language, 'auto'>;
type EnergyLevel = 'low' | 'medium' | 'high';

const FALLBACK_LANGUAGE: SupportedLanguage = 'es';

const energyLevelLabels: Record<SupportedLanguage, Record<EnergyLevel, string>> = {
  es: { low: 'Baja', medium: 'Media', high: 'Alta' },
  en: { low: 'Low', medium: 'Medium', high: 'High' },
  tr: { low: 'Düşük', medium: 'Orta', high: 'Yüksek' },
};

type PeriodIntensityKey = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

const periodIntensityLabels: Record<SupportedLanguage, Record<PeriodIntensityKey, string>> = {
  es: {
    none: 'Sin flujo',
    spotting: 'Manchado',
    light: 'Ligero',
    medium: 'Medio',
    heavy: 'Abundante',
  },
  en: {
    none: 'No flow',
    spotting: 'Spotting',
    light: 'Light',
    medium: 'Medium',
    heavy: 'Heavy',
  },
  tr: {
    none: 'Akış yok',
    spotting: 'Lekelenme',
    light: 'Hafif',
    medium: 'Orta',
    heavy: 'Yoğun',
  },
};

const symptomTranslations: Record<SupportedLanguage, Record<string, string>> = {
  es: {
    cramps: 'Cólicos',
    fatigue: 'Fatiga',
    headache: 'Dolor de cabeza',
    backache: 'Dolor de espalda',
    nausea: 'Náuseas',
    bloating: 'Hinchazón',
    'mood-swings': 'Cambios de humor',
    acne: 'Acné',
    'increased-energy': 'Mayor energía',
    'clear-skin': 'Piel limpia',
    'breast-tenderness': 'Sensibilidad en senos',
    'increased-libido': 'Mayor libido',
    'cervical-mucus': 'Moco cervical',
    irritability: 'Irritabilidad',
    'food-cravings': 'Antojos',
    anxiety: 'Ansiedad',
    cravings: 'Antojos',
  },
  en: {
    cramps: 'Cramps',
    fatigue: 'Fatigue',
    headache: 'Headache',
    backache: 'Back pain',
    nausea: 'Nausea',
    bloating: 'Bloating',
    'mood-swings': 'Mood swings',
    acne: 'Acne',
    'increased-energy': 'Increased energy',
    'clear-skin': 'Clear skin',
    'breast-tenderness': 'Breast tenderness',
    'increased-libido': 'Increased libido',
    'cervical-mucus': 'Cervical mucus',
    irritability: 'Irritability',
    'food-cravings': 'Food cravings',
    anxiety: 'Anxiety',
    cravings: 'Cravings',
  },
  tr: {
    cramps: 'Kramplar',
    fatigue: 'Yorgunluk',
    headache: 'Baş ağrısı',
    backache: 'Sırt ağrısı',
    nausea: 'Mide bulantısı',
    bloating: 'Şişkinlik',
    'mood-swings': 'Ruh hali dalgalanmaları',
    acne: 'Akne',
    'increased-energy': 'Artan enerji',
    'clear-skin': 'Temiz cilt',
    'breast-tenderness': 'Göğüs hassasiyeti',
    'increased-libido': 'Artan libido',
    'cervical-mucus': 'Servikal mukus',
    irritability: 'Sinirlilik',
    'food-cravings': 'Yeme isteği',
    anxiety: 'Kaygı',
    cravings: 'İstekler',
  },
};

const camelCaseBoundary = /([a-z])([A-Z])/g;

function normalizeSymptomId(symptomId: string): string {
  return symptomId
    .trim()
    .replace(camelCaseBoundary, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function formatSymptomFallback(symptomId: string): string {
  const printable = symptomId
    .replace(camelCaseBoundary, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!printable) return symptomId;

  return printable
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getEnergyLabel(level: string, language: Language): string {
  if (!level) {
    return '';
  }

  const resolvedLanguage: SupportedLanguage =
    language === 'auto' ? FALLBACK_LANGUAGE : language;

  const labels = energyLevelLabels[resolvedLanguage] ?? energyLevelLabels[FALLBACK_LANGUAGE];
  const normalized = level.toLowerCase() as EnergyLevel;

  if (labels && labels[normalized]) {
    return labels[normalized];
  }

  return formatSymptomFallback(level);
}

export function getSymptomLabel(symptomId: string, language: Language): string {
  if (!symptomId) {
    return '';
  }

  const normalized = normalizeSymptomId(symptomId);
  const resolvedLanguage: SupportedLanguage =
    language === 'auto' ? FALLBACK_LANGUAGE : language;

  const languageMap = symptomTranslations[resolvedLanguage];

  if (languageMap && languageMap[normalized]) {
    return languageMap[normalized];
  }

  const fallback =
    symptomTranslations.es[normalized] ??
    symptomTranslations.en[normalized] ??
    symptomTranslations.tr[normalized];

  if (fallback) {
    return fallback;
  }

  return formatSymptomFallback(symptomId);
}

const periodIntensityValueToKey: Record<string, PeriodIntensityKey> = {
  '0': 'none',
  'none': 'none',
  '1': 'spotting',
  'spotting': 'spotting',
  '2': 'light',
  'light': 'light',
  '3': 'medium',
  'medium': 'medium',
  '4': 'heavy',
  'heavy': 'heavy',
};

export function getPeriodIntensityLabel(
  level: number | string | undefined | null,
  language: Language
): string {
  if (level === undefined || level === null || level === '') {
    return '';
  }

  const keyLookup =
    typeof level === 'number'
      ? periodIntensityValueToKey[level.toString()]
      : periodIntensityValueToKey[normalizeSymptomId(level)];

  if (!keyLookup) {
    return formatSymptomFallback(typeof level === 'string' ? level : level.toString());
  }

  const resolvedLanguage: SupportedLanguage =
    language === 'auto' ? FALLBACK_LANGUAGE : language;

  const label =
    periodIntensityLabels[resolvedLanguage]?.[keyLookup] ??
    periodIntensityLabels[FALLBACK_LANGUAGE][keyLookup];

  return label ?? formatSymptomFallback(
    typeof level === 'string' ? level : level.toString()
  );
}

export function detectLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('tr')) return 'tr';
  if (browserLang.startsWith('en')) return 'en';

  // Default to Spanish
  return 'es';
}

export function getTranslations(language: Language): Translations {
  if (language === 'auto') {
    const detectedLang = detectLanguage();
    return translations[detectedLang];
  }

  return translations[language] || translations.es;
}

export function t(key: keyof Translations, language: Language): string {
  const trans = getTranslations(language);
  return trans[key] || key;
}
