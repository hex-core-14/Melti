// app/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProductItem } from '@/app/config/productsConfig';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  shortName: string;
  packSize: string;
  cocoaPercent: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  couponCode: string | null;
  couponError: string;
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addItem: (product: ProductItem, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'melti_cart_v1';
const FREE_SHIPPING_THRESHOLD = 999;

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate cart from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (typeof parsed.couponCode === 'string') setCouponCode(parsed.couponCode);
      }
    } catch {
      // Ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);


  // Persist cart updates
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, couponCode }));
    } catch {
      // Ignore storage quota issues
    }
  }, [items, couponCode, hydrated]);

    // Add inside CartProvider in app/context/CartContext.tsx
    useEffect(() => {
      if (!items || items.length === 0) return;

      const timer = window.setTimeout(() => {
        fetch('/api/cart/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        }).catch(() => {});
      }, 3000);

      return () => window.clearTimeout(timer);
    }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  // Calculate discount safely
  let discount = 0;
  if (couponCode === 'FIRSTPOUR15' && subtotal > 0) {
    discount = Math.round(subtotal * 0.15);
  } else if (couponCode === 'MELTI150' && subtotal >= 250) {
    discount = 150;
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shippingFee =
    subtotal === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const totalAmount = discountedSubtotal + shippingFee;
  const amountToFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal
  );

  const addItem = (product: ProductItem, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          shortName: product.shortName,
          packSize: product.packSize,
          cocoaPercent: product.cocoaPercent,
          unitPrice: product.price,
          quantity: qty,
          imageUrl: product.imageUrl,
        },
      ];
    });
    setIsBagOpen(true);
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i
      )
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId);
      const nextSub = next.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
      if (couponCode === 'MELTI150' && nextSub < 250) {
        setCouponCode(null);
      }
      return next;
    });
  };

  const applyCoupon = (rawCode: string): boolean => {
    const clean = rawCode.trim().toUpperCase();
    setCouponError('');

    if (!clean) {
      setCouponError('Enter a promo code.');
      return false;
    }

    if (clean === 'FIRSTPOUR15') {
      if (subtotal === 0) {
        setCouponError('Add a pack to your bag first.');
        return false;
      }
      setCouponCode('FIRSTPOUR15');
      return true;
    }

    if (clean === 'MELTI150') {
      if (subtotal < 250) {
        setCouponError('MELTI150 requires ₹250+ (add a 200g Family Pack).');
        return false;
      }
      setCouponCode('MELTI150');
      return true;
    }

    setCouponError('Invalid code. Try FIRSTPOUR15 or MELTI150.');
    return false;
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponError('');
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setCouponError('');
  };
  

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        discount,
        shippingFee,
        totalAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountToFreeShipping,
        couponCode,
        couponError,
        isBagOpen,
        openBag: () => setIsBagOpen(true),
        closeBag: () => setIsBagOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}