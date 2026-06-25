'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { StoredProduct } from '@/lib/types';

const MAX_COMPARE = 4;
const MAX_RECENT = 8;

interface StoreState {
  favorites: StoredProduct[];
  compare: StoredProduct[];
  recentlyViewed: StoredProduct[];
  ready: boolean;
  toggleFavorite: (p: StoredProduct) => void;
  isFavorite: (id: string) => boolean;
  toggleCompare: (p: StoredProduct) => void;
  isComparing: (id: string) => boolean;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  addRecentlyViewed: (p: StoredProduct) => void;
  removeFavorite: (id: string) => void;
}

const StoreContext = createContext<StoreState | null>(null);

const KEYS = {
  favorites: 'elbasma:favorites',
  compare: 'elbasma:compare',
  recent: 'elbasma:recent',
} as const;

function read(key: string): StoredProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as StoredProduct[]) : [];
  } catch {
    return [];
  }
}

function write(key: string, value: StoredProduct[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<StoredProduct[]>([]);
  const [compare, setCompare] = useState<StoredProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<StoredProduct[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(read(KEYS.favorites));
    setCompare(read(KEYS.compare));
    setRecentlyViewed(read(KEYS.recent));
    setReady(true);
  }, []);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.favorites) setFavorites(read(KEYS.favorites));
      if (e.key === KEYS.compare) setCompare(read(KEYS.compare));
      if (e.key === KEYS.recent) setRecentlyViewed(read(KEYS.recent));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleFavorite = useCallback((p: StoredProduct) => {
    setFavorites((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      const next = exists ? prev.filter((x) => x.id !== p.id) : [p, ...prev];
      write(KEYS.favorites, next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((x) => x.id !== id);
      write(KEYS.favorites, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.some((x) => x.id === id), [favorites]);

  const toggleCompare = useCallback((p: StoredProduct) => {
    setCompare((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      let next: StoredProduct[];
      if (exists) next = prev.filter((x) => x.id !== p.id);
      else if (prev.length >= MAX_COMPARE) next = [...prev.slice(1), p];
      else next = [...prev, p];
      write(KEYS.compare, next);
      return next;
    });
  }, []);

  const removeCompare = useCallback((id: string) => {
    setCompare((prev) => {
      const next = prev.filter((x) => x.id !== id);
      write(KEYS.compare, next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompare([]);
    write(KEYS.compare, []);
  }, []);

  const isComparing = useCallback((id: string) => compare.some((x) => x.id === id), [compare]);

  const addRecentlyViewed = useCallback((p: StoredProduct) => {
    setRecentlyViewed((prev) => {
      const next = [p, ...prev.filter((x) => x.id !== p.id)].slice(0, MAX_RECENT);
      write(KEYS.recent, next);
      return next;
    });
  }, []);

  const value = useMemo<StoreState>(
    () => ({
      favorites,
      compare,
      recentlyViewed,
      ready,
      toggleFavorite,
      isFavorite,
      toggleCompare,
      isComparing,
      removeCompare,
      clearCompare,
      addRecentlyViewed,
      removeFavorite,
    }),
    [
      favorites,
      compare,
      recentlyViewed,
      ready,
      toggleFavorite,
      isFavorite,
      toggleCompare,
      isComparing,
      removeCompare,
      clearCompare,
      addRecentlyViewed,
      removeFavorite,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
