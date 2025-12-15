'use client';

import { useEffect } from 'react';

export default function ParallaxEffect() {
  useEffect(() => {
    const handleScroll = () => {
      const heroImage = document.getElementById('heroImage');
      if (heroImage) {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}
