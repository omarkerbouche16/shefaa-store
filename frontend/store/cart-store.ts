'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, OfferPieces } from '@/types/commerce';
import { debugCart } from '@/lib/debug-cart';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  /** Remove every line with this product id (legacy / convenience). */
  removeItem: (productId: string) => void;
  /** Remove one cart line (same product can exist with different offers). */
  removeLine: (productId: string, offerPieces: OfferPieces) => void;
  /** Update quantity for one line; quantity <= 0 removes that line. */
  updateLineQuantity: (
    productId: string,
    offerPieces: OfferPieces,
    quantity: number
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalDa: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        debugCart('cart', 'addItem', {
          productId: newItem.productId,
          pieces: newItem.offer.pieces,
        });
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.offer.pieces === newItem.offer.pieces
          );

          if (existingIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity:
                updatedItems[existingIndex].quantity + (newItem.quantity ?? 1),
            };
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              { ...newItem, quantity: newItem.quantity ?? 1 },
            ],
          };
        });
      },

      removeItem: (productId) => {
        debugCart('cart', 'removeItem (all lines)', { productId });
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      removeLine: (productId, offerPieces) => {
        debugCart('cart', 'removeLine', { productId, offerPieces });
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.offer.pieces === offerPieces)
          ),
        }));
      },

      updateLineQuantity: (productId, offerPieces, quantity) => {
        debugCart('cart', 'updateLineQuantity', {
          productId,
          offerPieces,
          quantity,
        });
        if (quantity <= 0) {
          get().removeLine(productId, offerPieces);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.offer.pieces === offerPieces
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        debugCart('cart', 'clearCart');
        set({ items: [] });
      },

      openCart: () => {
        debugCart('cart', 'openCart');
        set({ isOpen: true });
      },
      closeCart: () => {
        debugCart('cart', 'closeCart');
        set({ isOpen: false });
      },

      getTotalDa: () => {
        return get().items.reduce(
          (sum, item) => sum + item.offer.priceDa * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'shefaa-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function buildCartItem(
  productId: string,
  slug: string,
  name: string,
  pieces: OfferPieces,
  priceDa: number,
  source: CartItem['source'] = 'product_page'
): Omit<CartItem, 'quantity'> {
  const OFFER_LABELS: Record<OfferPieces, string> = {
    1: '1 قطعة',
    2: '2 قطع',
    3: '3 قطع',
  };

  return {
    productId,
    slug,
    name,
    image: '',
    offer: {
      pieces,
      priceDa,
      label: OFFER_LABELS[pieces],
    },
    source,
  };
}
