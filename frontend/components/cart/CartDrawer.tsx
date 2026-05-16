'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { useCheckoutStore } from '@/store/checkout-store';
import { getCrossSellProducts } from '@/config/products';
import CartLineItem from './CartLineItem';
import CartSummary from './CartSummary';
import CartCrossSell from './CartCrossSell';
import { Button } from '@heroui/react';
import { TruckIcon, ShieldCheckIcon, CheckCircleIcon, BoxIcon, SparklesIcon } from '@/components/common/Icons';

/**
 * Architecture: one fixed wrapper covers the whole viewport at z-50000.
 *
 * Pointer-events strategy (fixes Safari/iOS Chromium GPU compositing bug):
 *  - Wrapper          → pointer-events:auto  — captures "backdrop" clicks via
 *                        onPointerDown(e.target===e.currentTarget) guard.
 *  - Backdrop (scrim) → pointer-events:none  — purely visual; cannot steal clicks
 *                        from the panel regardless of GPU compositing layer order.
 *  - Panel            → pointer-events:auto + onPointerDown stopPropagation +
 *                        explicit zIndex:1 — always on top, interactions never
 *                        bubble to the wrapper's close handler.
 *
 * No backdrop-filter on the scrim: backdrop-filter promotes an element to its
 * own GPU compositing layer, which can absorb pointer-events from siblings on
 * Safari / some Chromium builds even when z-index is correct.
 */
const WRAPPER_Z = 50_000;

// Debug: set NEXT_PUBLIC_DEBUG_CART_LAYERS=1 to see coloured layer outlines.
const DBG = process.env.NEXT_PUBLIC_DEBUG_CART_LAYERS === '1';

export default function CartDrawer() {
  const router = useRouter();
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  // Mount into a clean div that's a direct child of <body> (avoids any
  // overflow-x:hidden containment on the body element itself).
  const portalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let el = document.getElementById('__cart_portal') as HTMLDivElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = '__cart_portal';
      el.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;';
      document.body.appendChild(el);
    }
    portalRef.current = el;
    setPortalEl(el);
    return () => { /* leave the element — unmount race would cause flicker */ };
  }, []);

  const { openCheckout } = useCheckoutStore();
  const { items, isOpen, closeCart, getTotalDa } = useCartStore();

  // Scroll lock — target <html> not <body> to avoid "body as containing block"
  // bugs in Safari when body already has overflow-x:hidden.
  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) {
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = '';
    }
    return () => { root.style.overflow = ''; };
  }, [isOpen]);

  const firstItemId = items[0]?.productId;
  const crossSells = firstItemId
    ? getCrossSellProducts(firstItemId)
        .filter((p) => !items.some((i) => i.productId === p.id))
        .slice(0, 2)
    : [];

  const subtotal = getTotalDa();

  const handleCheckout = () => {
    console.log('Checkout button clicked');
    console.log('[cart] checkout CTA clicked — items:', items.length, 'subtotal:', subtotal);
    closeCart();
    openCheckout();
    // Safety-net: verify the checkout store opened; if not (e.g. Zustand hydration
    // mismatch), fall back to router navigation so the user is never left stuck.
    requestAnimationFrame(() => {
      if (!useCheckoutStore.getState().isOpen) {
        console.warn('[cart] checkout modal did not open — falling back to router');
        router.push('/checkout');
      }
    });
  };

  const content = (
    <AnimatePresence>
      {isOpen && (
        /**
         * WRAPPER — fixed, full-viewport, very high z-index.
         * pointer-events:auto so the wrapper itself captures backdrop clicks.
         * Clicks that land directly on the wrapper (not on the panel) close the
         * drawer; the panel stops propagation so its clicks never reach here.
         * This avoids relying on DOM paint-order between the backdrop and panel
         * GPU compositing layers, which can be inverted on Safari / iOS Chromium.
         */
        <div
          data-cart-layer="wrapper"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: WRAPPER_Z,
            pointerEvents: 'auto', // captures clicks in the backdrop area
          }}
          onPointerDown={(e) => {
            // Only close when clicking the wrapper itself (the translucent area
            // outside the panel), not when clicks bubble up from the panel.
            if (e.target === e.currentTarget) {
              console.log('[cart] backdrop dismissed');
              closeCart();
            }
          }}
        >
          {/* BACKDROP — purely visual; pointer-events:none so it never steals
              clicks from the panel regardless of GPU compositing layer order.
              No backdrop-filter (creates a compositing layer that can absorb
              pointer events on siblings in Safari/iOS). */}
          <motion.div
            key="cart-backdrop"
            data-cart-layer="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(30,25,20,0.5)',
              pointerEvents: 'none', // visual only — wrapper handles close
              ...(DBG ? { outline: '4px solid red' } : {}),
            }}
          />

          {/* PANEL — explicit zIndex:1 ensures it is above the backdrop in every
              GPU compositing scenario. onPointerDown stops propagation so panel
              interactions never bubble up to the wrapper's close handler. */}
          <motion.aside
            key="cart-panel"
            data-cart-layer="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            aria-modal="true"
            aria-label="سلة التسوق"
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 1, // always above backdrop regardless of compositing order
              width: 'min(24rem, 100vw)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--color-cream, #FAF6EE)',
              pointerEvents: 'auto',
              overflow: 'hidden',
              boxShadow: '-8px 0 40px rgba(30,25,20,0.18)',
              ...(DBG ? { outline: '4px solid cyan' } : {}),
            }}
          >
            {/* ── Header ── */}
            <div
              data-cart-layer="panel-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--color-border-sand, #E8E0D4)',
                flexShrink: 0,
                ...(DBG ? { background: 'rgba(255,0,255,0.15)' } : {}),
              }}
            >
              <h2 className="font-kufi font-bold text-lg text-desert-olive">سلة التسوق</h2>
              <button
                type="button"
                onClick={() => {
                  console.log('[cart] close button clicked');
                  closeCart();
                }}
                style={{ pointerEvents: 'auto', cursor: 'pointer', touchAction: 'manipulation' }}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 hover:bg-warm-sand transition-colors"
                aria-label="إغلاق السلة"
              >
                <svg className="w-5 h-5 text-charcoal-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Scroll body ── */}
            <div
              data-cart-layer="panel-body"
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '1rem 1.25rem',
                pointerEvents: 'auto',
                ...(DBG ? { background: 'rgba(255,200,0,0.12)' } : {}),
              }}
            >
              {items.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <BoxIcon className="mb-3 h-12 w-12 text-charcoal-ink/20" />
                  <p className="font-kufi text-base text-charcoal-ink/60">السلة فارغة</p>
                  <p className="mt-1 font-plex text-sm text-charcoal-ink/40">أضيفي منتجاتك المفضلة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    {items.map((item) => (
                      <CartLineItem key={`${item.productId}-${item.offer.pieces}`} item={item} />
                    ))}
                  </div>

                  <CartSummary subtotalDa={subtotal} />

                  {crossSells.length > 0 && (
                    <div className="space-y-2 pb-2">
                      <p className="font-kufi text-xs font-semibold text-charcoal-ink/60">قد يعجبك أيضاً</p>
                      {crossSells.map((product) => (
                        <CartCrossSell key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Footer checkout ── */}
            {items.length > 0 && (
              <div
                data-cart-layer="panel-footer"
                style={{
                  flexShrink: 0,
                  borderTop: '1px solid var(--color-border-sand, #E8E0D4)',
                  padding: '1rem 1.25rem',
                  background: 'var(--color-cream, #FAF6EE)',
                  pointerEvents: 'auto',
                  ...(DBG ? { background: 'rgba(0,255,100,0.2)' } : {}),
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2">
                    <SparklesIcon className="h-4 w-4 shrink-0 text-error-red" />
                    <p className="font-plex text-xs font-semibold text-error-red">
                      الكمية محدودة — أكثر من 12 شخص يتسوقون الآن
                    </p>
                  </div>

                  <Button
                    data-testid="cart-checkout-cta"
                    fullWidth
                    onPress={handleCheckout}
                    style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
                    className="min-h-[52px] rounded-full bg-honey-gold hover:bg-desert-olive text-white text-lg font-kufi font-bold shadow-warm gap-2"
                  >
                    <ShieldCheckIcon className="h-5 w-5" />
                    أتم طلبك (الدفع عند الاستلام)
                  </Button>

                  <div className="flex flex-wrap items-center justify-center gap-4 select-none">
                    <span className="flex items-center gap-1 font-plex text-[11px] text-charcoal-ink/50">
                      <CheckCircleIcon className="w-3.5 h-3.5 shrink-0" /> بدون دفع مسبق
                    </span>
                    <span className="flex items-center gap-1 font-plex text-[11px] text-charcoal-ink/50">
                      <TruckIcon className="w-3.5 h-3.5 shrink-0" /> توصيل لكل الجزائر
                    </span>
                    <span className="flex items-center gap-1 font-plex text-[11px] text-charcoal-ink/50">
                      <ShieldCheckIcon className="w-3.5 h-3.5 shrink-0" /> ضمان 30 يوم
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    fullWidth
                    onPress={() => {
                      console.log('[cart] continue shopping clicked');
                      closeCart();
                    }}
                    style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
                    className="min-h-[40px] font-plex text-xs text-charcoal-ink/40 hover:text-charcoal-ink/70"
                  >
                    متابعة التسوق
                  </Button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  if (!portalEl) return null;
  return createPortal(content, portalEl);
}
