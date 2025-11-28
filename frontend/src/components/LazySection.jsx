/**
 * LazySection - Uses Intersection Observer to defer rendering until visible
 * Reduces initial bundle execution and improves FCP/LCP
 */
import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';

const LazySection = ({ 
  children, 
  fallback = null,
  rootMargin = '100px',
  threshold = 0.1,
  minHeight = 200,
  once = true,
  placeholder = 'skeleton'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if IntersectionObserver not supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  const shouldRender = once ? hasBeenVisible : isVisible;

  const defaultFallback = placeholder === 'skeleton' ? (
    <Box sx={{ minHeight, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Skeleton variant="rectangular" height={minHeight * 0.6} sx={{ borderRadius: 2 }} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </Box>
  ) : placeholder === 'none' ? null : (
    <Box sx={{ minHeight }} />
  );

  return (
    <div ref={ref}>
      {shouldRender ? children : (fallback || defaultFallback)}
    </div>
  );
};

export default LazySection;
