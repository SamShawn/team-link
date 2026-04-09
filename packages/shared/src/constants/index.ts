// ============================================================
// Design Tokens Constants
// ============================================================

export const COLORS = {
  // Primary
  PRIMARY: '#6366F1',
  PRIMARY_HOVER: '#4F46E5',
  PRIMARY_ACTIVE: '#4338CA',
  PRIMARY_SUBTLE: '#EEF2FF',

  // Accent
  ACCENT: '#10B981',
  ACCENT_HOVER: '#059669',

  // Semantic
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  DANGER_HOVER: '#DC2626',

  // Neutrals
  NEUTRAL_0: '#FFFFFF',
  NEUTRAL_50: '#F9FAFB',
  NEUTRAL_100: '#F3F4F6',
  NEUTRAL_200: '#E5E7EB',
  NEUTRAL_300: '#D1D5DB',
  NEUTRAL_400: '#9CA3AF',
  NEUTRAL_500: '#6B7280',
  NEUTRAL_600: '#4B5563',
  NEUTRAL_700: '#374151',
  NEUTRAL_800: '#1F2937',
  NEUTRAL_900: '#111827',
  NEUTRAL_950: '#030712',

  // Presence
  ONLINE: '#10B981',
  AWAY: '#F59E0B',
  BUSY: '#EF4444',
  OFFLINE: '#9CA3AF',
} as const;

// ============================================================
// Spacing
// ============================================================

export const SPACING = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

// ============================================================
// Border Radius
// ============================================================

export const RADIUS = {
  SM: '4px',
  MD: '8px',
  LG: '12px',
  XL: '16px',
  FULL: '9999px',
} as const;

// ============================================================
// Shadows
// ============================================================

export const SHADOWS = {
  SM: '0 1px 2px rgba(0,0,0,0.05)',
  MD: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
  LG: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03)',
  XL: '0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.02)',
  FOCUS: '0 0 0 3px rgba(99, 102, 241, 0.25)',
  GLOW: '0 0 20px rgba(99, 102, 241, 0.15)',
} as const;

// ============================================================
// Animation
// ============================================================

export const EASING = {
  OUT: 'cubic-bezier(0.16, 1, 0.3, 1)',
  IN: 'cubic-bezier(0.7, 0, 0.84, 0)',
  IN_OUT: 'cubic-bezier(0.65, 0, 0.35, 1)',
  SPRING: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const DURATIONS = {
  INSTANT: '50ms',
  FAST: '100ms',
  NORMAL: '200ms',
  SLOW: '300ms',
  SLOWER: '500ms',
} as const;

// ============================================================
// Layout
// ============================================================

export const LAYOUT = {
  SIDEBAR_WIDTH: '260px',
  HEADER_HEIGHT: '56px',
  COMPOSER_MIN_HEIGHT: '56px',
  COMPOSER_MAX_HEIGHT: '200px',
  THREAD_PANEL_WIDTH: '320px',
  CONTENT_MAX_WIDTH: '720px',
  PAGE_PADDING: '24px',
} as const;

// ============================================================
// Typography
// ============================================================

export const TYPOGRAPHY = {
  FONT_SANS: "'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  FONT_MOMO: "'JetBrains Mono', 'Fira Code', monospace",

  TEXT_XS: '11px',
  TEXT_SM: '13px',
  TEXT_BASE: '15px',
  TEXT_LG: '17px',
  TEXT_XL: '20px',
  TEXT_2XL: '25px',
  TEXT_3XL: '31px',
  TEXT_4XL: '39px',
} as const;
