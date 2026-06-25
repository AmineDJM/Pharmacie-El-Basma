'use client';

import { useEffect } from 'react';

/** Registers the service worker for offline support / PWA installability. */
export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if ('serviceWorker' in navigator) {
      const register = () =>
        navigator.serviceWorker.register('/sw.js').catch(() => {
          /* offline support is progressive — ignore failures */
        });
      window.addEventListener('load', register);
      return () => window.removeEventListener('load', register);
    }
  }, []);
  return null;
}
