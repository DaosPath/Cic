export type AITimeMode = 'day' | 'week' | 'month' | 'current-cycle' | '6-months' | 'year';

export interface TimeModeConfig {
  id: AITimeMode;
  label: string;
  icon: string;
  description: string;
  daysBack: number | 'current-cycle';
}

export const TIME_MODES: TimeModeConfig[] = [
  {
    id: 'day',
    label: 'Hoy',
    icon: '📅',
    description: 'Análisis del día actual',
    daysBack: 1
  },
  {
    id: 'week',
    label: 'Semana',
    icon: '📆',
    description: 'Últimos 7 días',
    daysBack: 7
  },
  {
    id: 'month',
    label: 'Mes',
    icon: '🗓️',
    description: 'Últimos 30 días',
    daysBack: 30
  },
  {
    id: 'current-cycle',
    label: 'Ciclo Actual',
    icon: '🔄',
    description: 'Desde inicio del ciclo actual',
    daysBack: 'current-cycle'
  },
  {
    id: '6-months',
    label: '6 Meses',
    icon: '📊',
    description: 'Últimos 6 meses',
    daysBack: 180
  },
  {
    id: 'year',
    label: 'Año',
    icon: '📈',
    description: 'Últimos 12 meses',
    daysBack: 365
  }
];
