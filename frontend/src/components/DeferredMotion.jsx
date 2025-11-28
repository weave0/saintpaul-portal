/**
 * DeferredMotion - Lazy-loads framer-motion to improve FCP/LCP
 * Falls back to simple CSS transitions until the library loads
 */
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Box, Card } from '@mui/material';

// Lazy load framer-motion
const LazyMotion = lazy(() =>
  import('framer-motion').then((mod) => ({
    default: ({ children, component = 'div', ...props }) => {
      const Component = mod.motion(component === 'Card' ? Card : Box);
      return <Component {...props}>{children}</Component>;
    },
  }))
);

// Simple CSS-based fallback with fade-in animation
const FallbackBox = ({ children, initial, animate, transition, sx, component, ...props }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Slight delay to trigger CSS transition
    const timer = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const Component = component === 'Card' ? Card : Box;
  
  return (
    <Component
      {...props}
      sx={{
        ...sx,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${transition?.duration || 0.5}s ease, transform ${transition?.duration || 0.5}s ease`,
      }}
    >
      {children}
    </Component>
  );
};

// Motion wrapper that defers loading framer-motion
export const DeferredMotionBox = (props) => (
  <Suspense fallback={<FallbackBox {...props} />}>
    <LazyMotion component="div" {...props} />
  </Suspense>
);

export const DeferredMotionCard = (props) => (
  <Suspense fallback={<FallbackBox component="Card" {...props} />}>
    <LazyMotion component="Card" {...props} />
  </Suspense>
);

// Hook to check if framer-motion is loaded (for AnimatePresence)
export const useMotionReady = () => {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    import('framer-motion').then(() => setReady(true));
  }, []);
  
  return ready;
};

export default DeferredMotionBox;
