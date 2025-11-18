import type { Language } from '../types.ts';

export interface Translations {
  // Navigation
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
  logSymptoms: string;
  savedInsightsTabPinned: string;
  savedInsightsTabSaved: string;
  noSavedInsights: string;
  noPinnedInsights: string;
  chatWithAI: string;
  chatInsightsDescription: string;
  startChat: string;
  chatContextLabel: string;
  chatContextLog: string;
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

  // Common
  save: string;
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  close: string;
  noMedicationsAdded: string;
}

const translations: Record<Language, Translations> = {
  es: {
    // Navigation
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

    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    noMedicationsAdded: 'No hay medicamentos agregados',
  },

  en: {
    // Navigation
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

    // Common
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    noMedicationsAdded: 'No medications added',
  },

  tr: {
    // Navigation
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
