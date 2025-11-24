// St. Paul Historical Portal - Design System
// Inspired by downtown St. Paul's artistic character

export const theme = {
  // Color Palette - Inspired by St. Paul architecture and nature
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
    
    // Accent - Northern Lights aurora
    accent: {
      aurora: '#7dd3c0',     // Teal
      magenta: '#f72585',    // Vibrant pink
      violet: '#7209b7',     // Deep purple
      green: '#4cc9f0',      // Sky blue
    },
    
    // Historic - Vintage palette
    historic: {
      sepia: '#704214',
      parchment: '#f4e8c1',
      ink: '#2c2416',
      rust: '#b7410e',
      sage: '#9caf88',
    },
    
    // Neutral - Modern grays
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
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },
  
  // Typography - Inspired by historic St. Paul newspapers
  typography: {
    fonts: {
      heading: '"Playfair Display", "Georgia", serif',  // Classic, editorial
      body: '"Inter", "Segoe UI", sans-serif',          // Modern, readable
      mono: '"JetBrains Mono", "Courier New", monospace',
      historic: '"Crimson Text", "Times New Roman", serif', // For quotes
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
      '7xl': '4.5rem',  // 72px
    },
    
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },
  
  // Spacing - 8px base grid
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
  },
  
  // Breakpoints - Responsive design
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Shadows - Depth layers
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    
    // Art Deco inspired
    deco: '0 8px 16px rgba(212, 175, 55, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Artistic transitions
    elegant: '600ms cubic-bezier(0.33, 1, 0.68, 1)',
    bounce: '800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
    toast: 1500,
  },
  
  // Component-specific styles
  components: {
    // Buttons
    button: {
      primary: {
        bg: 'colors.primary.500',
        hover: 'colors.primary.600',
        text: 'white',
      },
      secondary: {
        bg: 'colors.secondary.500',
        hover: 'colors.secondary.600',
        text: 'colors.neutral.900',
      },
      ghost: {
        bg: 'transparent',
        hover: 'colors.neutral.100',
        text: 'colors.neutral.700',
      },
    },
    
    // Cards
    card: {
      bg: 'white',
      border: 'colors.neutral.200',
      shadow: 'shadows.md',
      hover: 'shadows.lg',
      padding: 'spacing.6',
    },
    
    // Timeline
    timeline: {
      lineColor: 'colors.primary.300',
      nodeColor: 'colors.primary.500',
      nodeShadow: 'shadows.deco',
    },
    
    // 3D Viewer
    viewer3d: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gridColor: 'colors.neutral.300',
      buildingColor: 'colors.secondary.500',
    },
  },
  
  // Animation presets
  animations: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    slideUp: {
      from: { transform: 'translateY(20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
  },
};

// Utility functions
export const getColor = (path) => {
  const keys = path.split('.');
  let value = theme.colors;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};

export const getSpacing = (multiplier) => {
  return theme.spacing[multiplier] || `${multiplier * 0.25}rem`;
};

export default theme;
