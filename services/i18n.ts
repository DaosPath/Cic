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
  
  // Log page
  dailyRecord: string;
  menstruationIntensity: string;
  noFlow: string;
  light: string;
  medium: string;
  heavy: string;
  mood: string;
  symptoms: string;
  notes: string;
  saveRecord: string;
  addAnyAdditionalNotes: string;
  
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
  
  // Common
  save: string;
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  close: string;
}

const translations: Record<Language, Translations> = {
  es: {
    // Navigation
    home: 'Inicio',
    calendar: 'Calendario',
    log: 'Registrar',
    insights: 'Análisis',
    settings: 'Ajustes',
    
    // Home page
    dayOfCycle: 'Día del ciclo',
    calculating: 'Calculando',
    currentPhase: 'Fase Actual',
    nextPeriod: 'Próxima Menstruación',
    nextEvent: 'Próximo Evento',
    fertileWindow: 'Ventana Fértil',
    relevantWindow: 'Ventana Relevante',
    howDoYouFeel: '¿Cómo te sientes hoy?',
    dailyTip: 'Consejo del día',
    poweredByGemini: 'Powered by Gemini',
    medicalDisclaimer: 'Esta app no ofrece diagnóstico médico; consulta a un profesional de salud para cualquier duda.',
    
    // Phases
    menstruation: 'Menstruación',
    follicular: 'Fase Folicular',
    ovulation: 'Ovulación',
    luteal: 'Fase Lútea',
    
    // Moods
    terrible: 'Terrible',
    bad: 'Mal',
    normal: 'Normal',
    good: 'Bien',
    great: 'Genial',
    
    // Calendar
    cycleAnalysis: 'Análisis de Ciclos',
    legend: 'Leyenda',
    
    // Log page
    dailyRecord: 'Registro del Día',
    menstruationIntensity: 'Menstruación',
    noFlow: 'Sin sangrado',
    light: 'Ligero',
    medium: 'Medio',
    heavy: 'Abundante',
    mood: 'Estado de Ánimo',
    symptoms: 'Síntomas',
    notes: 'Notas',
    saveRecord: 'Guardar Registro',
    addAnyAdditionalNotes: 'Añade cualquier nota adicional sobre tu día...',
    
    // Insights
    notEnoughData: 'No hay suficientes datos para mostrar un análisis detallado.',
    keepTracking: 'Sigue registrando tus ciclos y síntomas para descubrir patrones.',
    favoriteSymptoms: 'Síntomas Favoritos',
    markImportantSymptoms: 'Marca tus síntomas más importantes con una estrella para verlos aquí.',
    cycleDuration: 'Duración del Ciclo',
    average: 'Promedio',
    days: 'días',
    cycleHistory: 'Historial de Ciclos',
    currentCycle: 'Ciclo Actual',
    cycle: 'Ciclo',
    symptomAnalysis: 'Análisis de Síntomas',
    records: 'registros',
    
    // Settings
    configuration: 'Configuración',
    personalizeExperience: 'Personaliza tu experiencia',
    cycleConfiguration: 'Configuración del Ciclo',
    averageCycleDuration: 'Duración promedio del ciclo (días)',
    lutealPhaseDuration: 'Duración de la fase lútea (días)',
    privacy: 'Privacidad',
    discreteMode: 'Modo Discreto',
    hideSpecificTerms: 'Oculta términos específicos del ciclo menstrual',
    dataManagement: 'Gestión de Datos',
    createBackup: '📦 Crear Copia de Seguridad',
    restoreData: '📥 Restaurar Datos',
    exportToCsv: '📊 Exportar a CSV',
    deleteAllData: '🗑️ Eliminar Todos los Datos',
    developmentTools: 'Herramientas de Desarrollo',
    developerMode: 'Modo Desarrollador',
    fillWithTestData: 'Llena la app con datos de prueba realistas',
    copyDebugInfo: '🐛 Copiar Info de Debug',
    reloadApp: '🔄 Recargar Aplicación',
    logSettingsConsole: '📋 Log Settings to Console',
    saveConfiguration: 'Guardar Configuración',
    language: 'Idioma',
    automatic: 'Automático',
    spanish: 'Español',
    english: 'English',
    turkish: 'Türkçe',
    
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
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
    currentPhase: 'Current Phase',
    nextPeriod: 'Next Period',
    nextEvent: 'Next Event',
    fertileWindow: 'Fertile Window',
    relevantWindow: 'Relevant Window',
    howDoYouFeel: 'How do you feel today?',
    dailyTip: 'Daily tip',
    poweredByGemini: 'Powered by Gemini',
    medicalDisclaimer: 'This app does not provide medical diagnosis; consult a healthcare professional for any concerns.',
    
    // Phases
    menstruation: 'Menstruation',
    follicular: 'Follicular Phase',
    ovulation: 'Ovulation',
    luteal: 'Luteal Phase',
    
    // Moods
    terrible: 'Terrible',
    bad: 'Bad',
    normal: 'Normal',
    good: 'Good',
    great: 'Great',
    
    // Calendar
    cycleAnalysis: 'Cycle Analysis',
    legend: 'Legend',
    
    // Log page
    dailyRecord: 'Daily Record',
    menstruationIntensity: 'Menstruation',
    noFlow: 'No flow',
    light: 'Light',
    medium: 'Medium',
    heavy: 'Heavy',
    mood: 'Mood',
    symptoms: 'Symptoms',
    notes: 'Notes',
    saveRecord: 'Save Record',
    addAnyAdditionalNotes: 'Add any additional notes about your day...',
    
    // Insights
    notEnoughData: 'Not enough data to show detailed analysis.',
    keepTracking: 'Keep tracking your cycles and symptoms to discover patterns.',
    favoriteSymptoms: 'Favorite Symptoms',
    markImportantSymptoms: 'Mark your most important symptoms with a star to see them here.',
    cycleDuration: 'Cycle Duration',
    average: 'Average',
    days: 'days',
    cycleHistory: 'Cycle History',
    currentCycle: 'Current Cycle',
    cycle: 'Cycle',
    symptomAnalysis: 'Symptom Analysis',
    records: 'records',
    
    // Settings
    configuration: 'Configuration',
    personalizeExperience: 'Personalize your experience',
    cycleConfiguration: 'Cycle Configuration',
    averageCycleDuration: 'Average cycle duration (days)',
    lutealPhaseDuration: 'Luteal phase duration (days)',
    privacy: 'Privacy',
    discreteMode: 'Discrete Mode',
    hideSpecificTerms: 'Hide specific menstrual cycle terms',
    dataManagement: 'Data Management',
    createBackup: '📦 Create Backup',
    restoreData: '📥 Restore Data',
    exportToCsv: '📊 Export to CSV',
    deleteAllData: '🗑️ Delete All Data',
    developmentTools: 'Development Tools',
    developerMode: 'Developer Mode',
    fillWithTestData: 'Fill app with realistic test data',
    copyDebugInfo: '🐛 Copy Debug Info',
    reloadApp: '🔄 Reload Application',
    logSettingsConsole: '📋 Log Settings to Console',
    saveConfiguration: 'Save Configuration',
    language: 'Language',
    automatic: 'Automatic',
    spanish: 'Español',
    english: 'English',
    turkish: 'Türkçe',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
  },
  
  tr: {
    // Navigation
    home: 'Ana Sayfa',
    calendar: 'Takvim',
    log: 'Kayıt',
    insights: 'Analiz',
    settings: 'Ayarlar',
    
    // Home page
    dayOfCycle: 'Döngü günü',
    calculating: 'Hesaplanıyor',
    currentPhase: 'Mevcut Faz',
    nextPeriod: 'Sonraki Adet',
    nextEvent: 'Sonraki Olay',
    fertileWindow: 'Doğurgan Dönem',
    relevantWindow: 'İlgili Dönem',
    howDoYouFeel: 'Bugün nasıl hissediyorsun?',
    dailyTip: 'Günlük ipucu',
    poweredByGemini: 'Gemini tarafından desteklenmektedir',
    medicalDisclaimer: 'Bu uygulama tıbbi teşhis sağlamaz; herhangi bir endişe için bir sağlık uzmanına danışın.',
    
    // Phases
    menstruation: 'Adet Dönemi',
    follicular: 'Foliküler Faz',
    ovulation: 'Yumurtlama',
    luteal: 'Luteal Faz',
    
    // Moods
    terrible: 'Korkunç',
    bad: 'Kötü',
    normal: 'Normal',
    good: 'İyi',
    great: 'Harika',
    
    // Calendar
    cycleAnalysis: 'Döngü Analizi',
    legend: 'Açıklama',
    
    // Log page
    dailyRecord: 'Günlük Kayıt',
    menstruationIntensity: 'Adet Dönemi',
    noFlow: 'Akış yok',
    light: 'Hafif',
    medium: 'Orta',
    heavy: 'Ağır',
    mood: 'Ruh Hali',
    symptoms: 'Belirtiler',
    notes: 'Notlar',
    saveRecord: 'Kaydı Kaydet',
    addAnyAdditionalNotes: 'Gününüz hakkında ek notlar ekleyin...',
    
    // Insights
    notEnoughData: 'Detaylı analiz göstermek için yeterli veri yok.',
    keepTracking: 'Kalıpları keşfetmek için döngülerinizi ve belirtilerinizi takip etmeye devam edin.',
    favoriteSymptoms: 'Favori Belirtiler',
    markImportantSymptoms: 'En önemli belirtilerinizi burada görmek için yıldızla işaretleyin.',
    cycleDuration: 'Döngü Süresi',
    average: 'Ortalama',
    days: 'gün',
    cycleHistory: 'Döngü Geçmişi',
    currentCycle: 'Mevcut Döngü',
    cycle: 'Döngü',
    symptomAnalysis: 'Belirti Analizi',
    records: 'kayıt',
    
    // Settings
    configuration: 'Yapılandırma',
    personalizeExperience: 'Deneyiminizi kişiselleştirin',
    cycleConfiguration: 'Döngü Yapılandırması',
    averageCycleDuration: 'Ortalama döngü süresi (gün)',
    lutealPhaseDuration: 'Luteal faz süresi (gün)',
    privacy: 'Gizlilik',
    discreteMode: 'Gizli Mod',
    hideSpecificTerms: 'Belirli adet döngüsü terimlerini gizle',
    dataManagement: 'Veri Yönetimi',
    createBackup: '📦 Yedek Oluştur',
    restoreData: '📥 Veriyi Geri Yükle',
    exportToCsv: '📊 CSV\'ye Aktar',
    deleteAllData: '🗑️ Tüm Verileri Sil',
    developmentTools: 'Geliştirme Araçları',
    developerMode: 'Geliştirici Modu',
    fillWithTestData: 'Uygulamayı gerçekçi test verileriyle doldur',
    copyDebugInfo: '🐛 Hata Ayıklama Bilgisini Kopyala',
    reloadApp: '🔄 Uygulamayı Yeniden Yükle',
    logSettingsConsole: '📋 Ayarları Konsola Yazdır',
    saveConfiguration: 'Yapılandırmayı Kaydet',
    language: 'Dil',
    automatic: 'Otomatik',
    spanish: 'Español',
    english: 'English',
    turkish: 'Türkçe',
    
    // Common
    save: 'Kaydet',
    cancel: 'İptal',
    confirm: 'Onayla',
    delete: 'Sil',
    edit: 'Düzenle',
    close: 'Kapat',
  },
  
  auto: {} as Translations // Will be resolved at runtime
};

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