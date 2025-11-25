import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const NightSkyOverlay = ({ visible = true, intensity = 0.6 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate stars
    const stars = [];
    const numStars = 200;
    
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Generate shooting stars
    const shootingStars = [];
    const createShootingStar = () => {
      if (Math.random() < 0.002) { // 0.2% chance per frame
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          vx: Math.random() * 4 + 2,
          vy: Math.random() * 2 + 1,
          length: Math.random() * 80 + 40,
          opacity: 1,
          decay: Math.random() * 0.02 + 0.01,
        });
      }
    };

    // Animation loop
    let animationFrameId;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.opacity * (0.5 + twinkle * 0.5) * intensity;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // Add glow for brighter stars
        if (star.radius > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 3
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      // Create and draw shooting stars
      createShootingStar();
      shootingStars.forEach((star, index) => {
        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - star.vx * star.length / 10, star.y - star.vy * star.length / 10
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * intensity})`);
        gradient.addColorStop(0.5, `rgba(200, 200, 255, ${star.opacity * 0.6 * intensity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * star.length / 10, star.y - star.vy * star.length / 10);
        ctx.stroke();

        // Update position and fade
        star.x += star.vx;
        star.y += star.vy;
        star.opacity -= star.decay;

        // Remove faded shooting stars
        if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });

      frame++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [visible, intensity]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </Box>
  );
};

export default NightSkyOverlay;
