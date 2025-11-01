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

    // Common
    save: 'Kaydet',
    cancel: 'İptal',
    confirm: 'Onayla',
    delete: 'Sil',
    edit: 'Düzenle',
    close: 'Kapat',
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
