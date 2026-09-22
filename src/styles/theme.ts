export const colors = {
  primary: {
    DEFAULT: '#0B1F33',
    dark: '#061220',
    light: '#163859',
    soft: '#23507D',
    muted: 'rgba(11, 31, 51, 0.08)',
  },
  action: {
    DEFAULT: '#2563EB',
    dark: '#1D4ED8',
    light: '#DBEAFE',
    muted: 'rgba(37, 99, 235, 0.08)',
    border: 'rgba(37, 99, 235, 0.25)',
  },
  gold: {
    DEFAULT: '#C89B3C',
    dark: '#92400E',
    light: '#FDF4E6',
    border: '#E5C77A',
    muted: 'rgba(200, 155, 60, 0.10)',
  },
  market: {
    bull: '#16A34A',
    bullDark: '#15803D',
    bullBg: '#DCFCE7',
    bullGlow: 'rgba(22, 163, 74, 0.18)',
    bear: '#DC2626',
    bearDark: '#B91C1C',
    bearBg: '#FEE2E2',
    bearGlow: 'rgba(220, 38, 38, 0.18)',
    warning: '#F59E0B',
    warningDark: '#D97706',
    warningBg: '#FEF3C7',
  },
  surface: {
    bg: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E5E7EB',
    borderLight: '#F1F5F9',
  },
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
    muted: '#94A3B8',
    disabled: '#CBD5E1',
  },
  shadow: {
    card: '0 2px 10px rgba(11, 31, 51, 0.06)',
    cardMd: '0 4px 14px rgba(11, 31, 51, 0.08)',
    accent: '0 6px 16px rgba(37, 99, 235, 0.20)',
    gold: '0 6px 16px rgba(200, 155, 60, 0.20)',
  },
} as const;

export type ThemeColors = typeof colors;
export default colors;
