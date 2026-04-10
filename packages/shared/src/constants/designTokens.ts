export const COLORS = {
  background: '#FFF5F0',
  surface: '#FFEEE6',
  surfaceHover: '#FFE4D6',
  surfaceActive: '#FFD4C4',
  primary: '#FF9B7A',
  primaryHover: '#FF7A5A',
  cta: '#C75D3A',
  ctaHover: '#A84A2E',
  textPrimary: '#6B4F4F',
  textSecondary: '#8A7A7A',
  textInverse: '#FFF5F0',
  success: '#7AB89A',
  warning: '#E8C87A',
  error: '#D47A7A',
  border: '#F0D8CC',
  borderStrong: '#E0C8BC',
} as const;

export const SPACING = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
} as const;

export const RADIUS = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
} as const;

export const SIDEBAR_WIDTHS = {
  workspace: 260,
  channel: 220,
  thread: 380,
} as const;

export const TYPOGRAPHY = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  sizes: {
    xs: '12px',
    sm: '13px',
    base: '15px',
    lg: '17px',
    xl: '18px',
    '2xl': '24px',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const MOTION = {
  fast: '120ms',
  base: '200ms',
  slow: '300ms',
  spring: {
    panel: { type: 'spring' as const, stiffness: 300, damping: 30 },
    message: { type: 'spring' as const, stiffness: 300, damping: 30 },
    reaction: { type: 'spring' as const, stiffness: 400, damping: 20 },
    modal: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
} as const;

export const AVATAR_SIZES = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 64,
} as const;
