/**
 * Design Tokens for Saint Paul Historical Portal
 * Extract all magic values to this central source of truth
 * Use in all components for consistency
 */

export const tokens = {
  // ========== COLORS ==========
  colors: {
    // Primary - Mississippi River blues
    primary: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#1e88e5', // Main brand color
      600: '#1976d2',
      700: '#1565c0',
      800: '#0d47a1',
      900: '#0a3d91',
    },

    // Secondary - Historic St. Paul Art Deco gold
    secondary: {
      50: '#fff8e1',
      100: '#ffecb3',
      200: '#ffe082',
      300: '#ffd54f',
      400: '#ffca28',
      500: '#d4af37', // Art Deco gold
      600: '#c19b2b',
      700: '#ab8624',
      800: '#8b6914',
      900: '#6b4e0a',
    },

    // Accent colors
    accent: {
      aurora: '#7dd3c0',
      magenta: '#f72585',
      violet: '#7209b7',
      cyan: '#4cc9f0',
    },

    // Historic palette
    historic: {
      sepia: '#704214',
      parchment: '#f4e8c1',
      ink: '#2c2416',
      rust: '#b7410e',
      sage: '#9caf88',
    },

    // Neutral grays
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },

    // Semantic colors
    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c',
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
    },
    info: {
      light: '#64b5f6',
      main: '#2196f3',
      dark: '#1976d2',
    },

    // Provenance badge colors
    provenance: {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2',
    },
  },

  // ========== SPACING ==========
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
  },

  // ========== TYPOGRAPHY ==========
  typography: {
    fonts: {
      heading: '"Playfair Display", Georgia, serif',
      body: '"Inter", "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Courier New", monospace',
      historic: '"Crimson Text", "Times New Roman", serif',
    },

    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },

    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // ========== BORDERS & RADII ==========
  borders: {
    width: {
      thin: '1px',
      normal: '2px',
      thick: '4px',
    },
    radius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
  },

  // ========== SHADOWS ==========
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // ========== ANIMATION ==========
  animation: {
    durations: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
    },
    easings: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // ========== Z-INDEX ==========
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
  },

  // ========== BREAKPOINTS ==========
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// TypeScript type for autocomplete
export type Tokens = typeof tokens;
