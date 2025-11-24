// Enhanced St. Paul History Portal Theme Provider
import { createTheme } from '@mui/material/styles';
import theme from './theme';

// Create MUI theme based on our design system
export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: theme.colors.primary[500],
      light: theme.colors.primary[300],
      dark: theme.colors.primary[700],
      contrastText: '#fff',
    },
    secondary: {
      main: theme.colors.secondary[500],
      light: theme.colors.secondary[300],
      dark: theme.colors.secondary[700],
      contrastText: theme.colors.neutral[900],
    },
    error: {
      main: theme.colors.error,
    },
    warning: {
      main: theme.colors.warning,
    },
    info: {
      main: theme.colors.info,
    },
    success: {
      main: theme.colors.success,
    },
    background: {
      default: theme.colors.neutral[50],
      paper: '#fff',
    },
    text: {
      primary: theme.colors.neutral[900],
      secondary: theme.colors.neutral[600],
    },
  },
  
  typography: {
    fontFamily: theme.typography.fonts.body,
    h1: {
      fontFamily: theme.typography.fonts.heading,
      fontSize: theme.typography.sizes['6xl'],
      fontWeight: theme.typography.weights.bold,
      lineHeight: theme.typography.lineHeights.tight,
    },
    h2: {
      fontFamily: theme.typography.fonts.heading,
      fontSize: theme.typography.sizes['5xl'],
      fontWeight: theme.typography.weights.bold,
      lineHeight: theme.typography.lineHeights.tight,
    },
    h3: {
      fontFamily: theme.typography.fonts.heading,
      fontSize: theme.typography.sizes['4xl'],
      fontWeight: theme.typography.weights.semibold,
    },
    h4: {
      fontFamily: theme.typography.fonts.heading,
      fontSize: theme.typography.sizes['3xl'],
      fontWeight: theme.typography.weights.semibold,
    },
    h5: {
      fontFamily: theme.typography.fonts.heading,
      fontSize: theme.typography.sizes['2xl'],
      fontWeight: theme.typography.weights.medium,
    },
    h6: {
      fontFamily: theme.typography.fonts.heading,
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.medium,
    },
    body1: {
      fontSize: theme.typography.sizes.base,
      lineHeight: theme.typography.lineHeights.normal,
    },
    body2: {
      fontSize: theme.typography.sizes.sm,
      lineHeight: theme.typography.lineHeights.normal,
    },
    button: {
      fontWeight: theme.typography.weights.semibold,
      textTransform: 'none', // More modern look
    },
  },
  
  shape: {
    borderRadius: 8,
  },
  
  shadows: [
    'none',
    theme.shadows.sm,
    theme.shadows.base,
    theme.shadows.md,
    theme.shadows.lg,
    theme.shadows.xl,
    theme.shadows['2xl'],
    theme.shadows.deco,
    ...Array(17).fill('0 0 0 0 rgba(0,0,0,0)'),
  ],
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: theme.borderRadius.lg,
          padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
          fontSize: theme.typography.sizes.base,
          transition: theme.transitions.base,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.lg,
          },
        },
        contained: {
          boxShadow: theme.shadows.md,
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.md,
          transition: theme.transitions.base,
          '&:hover': {
            boxShadow: theme.shadows.lg,
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: theme.shadows.base,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: theme.borderRadius.lg,
        },
      },
    },
  },
});

export default muiTheme;
