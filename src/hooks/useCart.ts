'use client';

import { useContext } from 'react';
import { CartContext, type CartContextValue } from '@/src/context/CartContext';

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
}
