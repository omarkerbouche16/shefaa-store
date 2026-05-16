'use client';

import { create } from 'zustand';
import type { Product } from '@/types/commerce';
import { debugCart } from '@/lib/debug-cart';

type CheckoutStep = 'checkout' | 'upsell' | 'done';

interface CheckoutState {
  isOpen: boolean;
  step: CheckoutStep;
  customerName: string;
  phoneLocal: string;
  phoneE164: string;
  upsellAccepted: boolean;
  upsellProduct: Product | null;
  orderId: string | null;
  initiateCheckoutEventId: string | null;
  purchaseEventId: string | null;

  openCheckout: () => void;
  closeCheckout: () => void;
  setCustomerInfo: (name: string, phoneLocal: string, phoneE164: string) => void;
  setStep: (step: CheckoutStep) => void;
  setUpsellProduct: (product: Product | null) => void;
  acceptUpsell: () => void;
  skipUpsell: () => void;
  setOrderId: (id: string) => void;
  setEventIds: (ids: { initiateCheckout?: string; purchase?: string }) => void;
  reset: () => void;
}

const initialState = {
  isOpen: false,
  step: 'checkout' as CheckoutStep,
  customerName: '',
  phoneLocal: '',
  phoneE164: '',
  upsellAccepted: false,
  upsellProduct: null,
  orderId: null,
  initiateCheckoutEventId: null,
  purchaseEventId: null,
};

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  ...initialState,

  openCheckout: () => {
    debugCart('checkout', 'openCheckout');
    set({ isOpen: true, step: 'checkout' });
  },
  closeCheckout: () => set({ isOpen: false }),

  setCustomerInfo: (customerName, phoneLocal, phoneE164) =>
    set({ customerName, phoneLocal, phoneE164 }),

  setStep: (step) => set({ step }),

  setUpsellProduct: (upsellProduct) => set({ upsellProduct }),

  acceptUpsell: () => set({ upsellAccepted: true, step: 'done' }),

  skipUpsell: () => set({ upsellAccepted: false, step: 'done' }),

  setOrderId: (orderId) => set({ orderId }),

  setEventIds: (ids) =>
    set({
      initiateCheckoutEventId: ids.initiateCheckout ?? null,
      purchaseEventId: ids.purchase ?? null,
    }),

  reset: () => set(initialState),
}));
