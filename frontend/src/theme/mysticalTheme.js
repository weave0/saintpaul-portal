// Mystical Portal Theme Configuration
// Central theming system for the St. Paul Mystical Portal experience

export const getMysticalTheme = (year = 2025) => {
  if (year <= 1880) return {
    era: 'pioneer',
    name: 'Pioneer Era',
    years: '1850-1880',
    primary: '#8b7355',
    secondary: '#d4a574',
    accent: '#c8a882',
    glow: 'rgba(139, 115, 85, 0.6)',
    textColor: '#f5e6d3',
    textSecondary: '#d4c4b0',
    backgroundColor: 'rgba(59, 47, 37, 0.95)',
    backgroundGradient: 'linear-gradient(180deg, rgba(59,47,37,0.98) 0%, rgba(40,30,20,0.95) 100%)',
    cardBackground: 'rgba(75, 60, 45, 0.85)',
    borderColor: '#8b7355',
    isDark: true,
    atmosphere: 'sepia',
    keywords: ['frontier', 'settlement', 'wilderness', 'exploration']
  };
  
  if (year <= 1920) return {
    era: 'gilded',
    name: 'Gilded Age',
    years: '1880-1920',
    primary: '#d4af37',
    secondary: '#b8923a',
    accent: '#f0c14b',
    glow: 'rgba(212, 175, 55, 0.6)',
    textColor: '#fff9e6',
    textSecondary: '#e6d8b8',
    backgroundColor: 'rgba(40, 35, 20, 0.95)',
    backgroundGradient: 'linear-gradient(180deg, rgba(40,35,20,0.98) 0%, rgba(30,25,15,0.95) 100%)',
    cardBackground: 'rgba(60, 50, 30, 0.85)',
    borderColor: '#d4af37',
    isDark: true,
    atmosphere: 'golden',
    keywords: ['prosperity', 'industrial', 'elegance', 'growth']
  };
  
  if (year <= 1950) return {
    era: 'deco',
    name: 'Art Deco Era',
    years: '1920-1950',
    primary: '#4169e1',
    secondary: '#5a7fb8',
    accent: '#6495ed',
    glow: 'rgba(65, 105, 225, 0.6)',
    textColor: '#e6f0ff',
    textSecondary: '#c8d8f0',
    backgroundColor: 'rgba(20, 30, 50, 0.95)',
    backgroundGradient: 'linear-gradient(180deg, rgba(20,30,50,0.98) 0%, rgba(15,20,35,0.95) 100%)',
    cardBackground: 'rgba(30, 45, 70, 0.85)',
    borderColor: '#4169e1',
    isDark: true,
    atmosphere: 'modernist',
    keywords: ['jazz', 'prohibition', 'architecture', 'sophistication']
  };
  
  if (year <= 1980) return {
    era: 'modern',
    name: 'Modern Era',
    years: '1950-1980',
    primary: '#32cd32',
    secondary: '#50e050',
    accent: '#7fff00',
    glow: 'rgba(50, 205, 50, 0.6)',
    textColor: '#f0fff0',
    textSecondary: '#d0f0d0',
    backgroundColor: 'rgba(25, 40, 25, 0.95)',
    backgroundGradient: 'linear-gradient(180deg, rgba(25,40,25,0.98) 0%, rgba(15,25,15,0.95) 100%)',
    cardBackground: 'rgba(35, 55, 35, 0.85)',
    borderColor: '#32cd32',
    isDark: true,
    atmosphere: 'atomic',
    keywords: ['suburbia', 'highways', 'postwar', 'optimism']
  };
  
  return {
    era: 'contemporary',
    name: 'Contemporary',
    years: '1980-2025',
    primary: '#00ffff',
    secondary: '#00d4d4',
    accent: '#5dfdfd',
    glow: 'rgba(0, 255, 255, 0.6)',
    textColor: '#e6ffff',
    textSecondary: '#c8f0f0',
    backgroundColor: 'rgba(10, 25, 35, 0.95)',
    backgroundGradient: 'linear-gradient(180deg, rgba(10,25,35,0.98) 0%, rgba(5,15,20,0.95) 100%)',
    cardBackground: 'rgba(15, 35, 50, 0.85)',
    borderColor: '#00ffff',
    isDark: true,
    atmosphere: 'digital',
    keywords: ['technology', 'diversity', 'sustainability', 'innovation']
  };
};

export const getGlobalMysticalStyles = (theme) => ({
  body: {
    background: `${theme.backgroundGradient}, radial-gradient(circle at 20% 20%, ${theme.glow} 0%, transparent 50%)`,
    minHeight: '100vh',
    color: theme.textColor,
  },
  
  portal: {
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  
  glowText: {
    color: theme.primary,
    textShadow: `0 0 10px ${theme.glow}, 0 0 20px ${theme.glow}`,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  
  mysticalCard: {
    background: theme.cardBackground,
    backdropFilter: 'blur(20px)',
    border: `2px solid ${theme.borderColor}`,
    boxShadow: `0 0 30px ${theme.glow}, inset 0 0 20px ${theme.glow}`,
    borderRadius: 2,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: `0 8px 40px ${theme.glow}, inset 0 0 30px ${theme.glow}`,
      border: `2px solid ${theme.primary}`,
    },
  },
  
  portalButton: {
    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
    color: theme.isDark ? '#000' : '#fff',
    fontWeight: 700,
    letterSpacing: 1,
    padding: '12px 32px',
    border: `2px solid ${theme.primary}`,
    boxShadow: `0 0 20px ${theme.glow}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 32px ${theme.glow}, inset 0 0 20px ${theme.glow}`,
    },
  },
});
