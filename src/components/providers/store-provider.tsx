'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, StoredProduct } from '@/lib/types';

const MAX_COMPARE = 4;
const MAX_RECENT = 8;
const MAX_QTY = 99;

interface StoreState {
  favorites: StoredProduct[];
  compare: StoredProduct[];
  recentlyViewed: StoredProduct[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  ready: boolean;
  toggleFavorite: (p: StoredProduct) => void;
  isFavorite: (id: string) => boolean;
  toggleCompare: (p: StoredProduct) => void;
  isComparing: (id: string) => boolean;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  addRecentlyViewed: (p: StoredProduct) => void;
  removeFavorite: (id: string) => void;
  addToCart: (p: StoredProduct, quantity?: number) => void;
  setCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartQuantity: (id: string) => number;
  deliveryOptionId: string | null;
  setDeliveryOption: (id: string | null) => void;
}

const StoreContext = createContext<StoreState | null>(null);

const KEYS = {
  favorites: 'elbasma:favorites',
  compare: 'elbasma:compare',
  recent: 'elbasma:recent',
  cart: 'elbasma:cart',
  delivery: 'elbasma:delivery',
} as const;

function read<T = StoredProduct>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T = StoredProduct>(key: string, value: T[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy errors */
  }
}

const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.round(n) || 1));

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<StoredProduct[]>([]);
  const [compare, setCompare] = useState<StoredProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<StoredProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryOptionId, setDeliveryOptionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(read(KEYS.favorites));
    setCompare(read(KEYS.compare));
    setRecentlyViewed(read(KEYS.recent));
    setCart(read<CartItem>(KEYS.cart));
    try {
      setDeliveryOptionId(window.localStorage.getItem(KEYS.delivery) || null);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.favorites) setFavorites(read(KEYS.favorites));
      if (e.key === KEYS.compare) setCompare(read(KEYS.compare));
      if (e.key === KEYS.recent) setRecentlyViewed(read(KEYS.recent));
      if (e.key === KEYS.cart) setCart(read<CartItem>(KEYS.cart));
      if (e.key === KEYS.delivery) setDeliveryOptionId(window.localStorage.getItem(KEYS.delivery) || null);
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

  // --- Cart -----------------------------------------------------------------
  const addToCart = useCallback((p: StoredProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === p.id);
      const next = existing
        ? prev.map((x) => (x.id === p.id ? { ...x, ...p, quantity: clampQty(x.quantity + quantity) } : x))
        : [...prev, { ...p, quantity: clampQty(quantity) }];
      write<CartItem>(KEYS.cart, next);
      return next;
    });
  }, []);

  const setCartQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) => {
      const next =
        quantity <= 0
          ? prev.filter((x) => x.id !== id)
          : prev.map((x) => (x.id === id ? { ...x, quantity: clampQty(quantity) } : x));
      write<CartItem>(KEYS.cart, next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const next = prev.filter((x) => x.id !== id);
      write<CartItem>(KEYS.cart, next);
      return next;
    });
  }, []);

  const setDeliveryOption = useCallback((id: string | null) => {
    setDeliveryOptionId(id);
    try {
      if (id) window.localStorage.setItem(KEYS.delivery, id);
      else window.localStorage.removeItem(KEYS.delivery);
    } catch {
      /* ignore */
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    write<CartItem>(KEYS.cart, []);
    setDeliveryOptionId(null);
    try {
      window.localStorage.removeItem(KEYS.delivery);
    } catch {
      /* ignore */
    }
  }, []);

  const cartQuantity = useCallback((id: string) => cart.find((x) => x.id === id)?.quantity ?? 0, [cart]);
  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);

  const value = useMemo<StoreState>(
    () => ({
      favorites,
      compare,
      recentlyViewed,
      cart,
      cartCount,
      cartTotal,
      ready,
      toggleFavorite,
      isFavorite,
      toggleCompare,
      isComparing,
      removeCompare,
      clearCompare,
      addRecentlyViewed,
      removeFavorite,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
      cartQuantity,
      deliveryOptionId,
      setDeliveryOption,
    }),
    [
      favorites,
      compare,
      recentlyViewed,
      cart,
      cartCount,
      cartTotal,
      ready,
      toggleFavorite,
      isFavorite,
      toggleCompare,
      isComparing,
      removeCompare,
      clearCompare,
      addRecentlyViewed,
      removeFavorite,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
      cartQuantity,
      deliveryOptionId,
      setDeliveryOption,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
