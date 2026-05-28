'use client';

import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product } from '@/src/types/product';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  quantity: number;
  maxStock: number;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, size: string, quantity: number) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isHydrated: boolean;
}

export const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'hadarah-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      // localStorage corrompido — começa vazio
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, size: string, quantity: number) => {
    const maxStock = product.sizes[size] ?? 0;
    if (maxStock === 0 || quantity < 1) return;

    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.size === size
            ? { ...i, quantity: Math.min(i.quantity + quantity, maxStock) }
            : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          size,
          quantity: Math.min(quantity, maxStock),
          maxStock,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size)));
  }, []);

  const updateQuantity = useCallback((id: string, size: string, qty: number) => {
    if (qty < 1) return;
    setItems(prev =>
      prev.map(i =>
        i.id === id && i.size === size
          ? { ...i, quantity: Math.min(qty, i.maxStock) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isHydrated: hydrated }}>
      {children}
    </CartContext.Provider>
  );
}
