'use client';
import { useEffect } from 'react';

export default function ThemeHandler() {
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      const block = Math.floor(hour / 5);
      if (block % 2 === 0) {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'hadarah-red');
      }
    };
    updateTheme();
    const interval = setInterval(updateTheme, 3600000); // 1 hora
    return () => clearInterval(interval);
  }, []);
  return null;
}