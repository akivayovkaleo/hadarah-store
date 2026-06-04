'use client';

import { useEffect } from 'react';
import { db } from '@/src/services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ThemeSettings {
  primaryColor?: string;
  accentColor?: string;
}

export default function ThemeProvider() {
  useEffect(() => {
    const applyTheme = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'theme'));
        if (!snap.exists()) return;
        const data = snap.data() as ThemeSettings;
        const root = document.documentElement;
        if (data.primaryColor) root.style.setProperty('--text-primary', data.primaryColor);
        if (data.accentColor) {
          root.style.setProperty('--accent', data.accentColor);
          root.style.setProperty('--accent-gold', data.accentColor);
        }
      } catch {
        // Silently fall back to CSS defaults on error
      }
    };
    applyTheme();
  }, []);

  return null;
}
