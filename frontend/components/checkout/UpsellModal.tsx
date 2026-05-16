'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/react';
import { useCheckoutStore } from '@/store/checkout-store';
import { useCartStore } from '@/store/cart-store';
import { buildCartItem } from '@/store/cart-store';
import { UPSELL_PRICE } from '@/config/offers';
import { formatPrice } from '@/lib/money';
import PlaceholderImage from '@/components/common/PlaceholderImage';

const COUNTDOWN_SECONDS = 12;

export default function UpsellModal() {
  const { step, upsellProduct, acceptUpsell, skipUpsell } = useCheckoutStore();
  const { addItem } = useCartStore();
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isOpen = step === 'upsell' && upsellProduct !== null;

  useEffect(() => {
    if (isOpen) {
      setSeconds(COUNTDOWN_SECONDS);
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  if (!upsellProduct) return null;

  function handleAccept() {
    if (!upsellProduct) return;
    addItem(
      buildCartItem(
        upsellProduct.id,
        upsellProduct.slug,
        upsellProduct.arabicName,
        1,
        UPSELL_PRICE,
        'upsell'
      )
    );
    acceptUpsell();
  }

  const progress = (seconds / COUNTDOWN_SECONDS) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal-ink/60 backdrop-blur-sm"
            style={{ zIndex: 70000 }}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            style={{ zIndex: 70000 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="عرض خاص"
          >
            <div className="w-full max-w-sm bg-cream rounded-3xl shadow-warm-lg overflow-hidden">
              {/* Countdown progress bar */}
              <div className="h-1 bg-border-sand" aria-hidden>
                <motion.div
                  className="h-full bg-honey-gold"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>

              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="text-center space-y-1">
                  <div className="inline-block bg-honey-gold/15 text-honey-gold text-xs font-plex font-bold px-3 py-1 rounded-full">
                    عرض خاص لك • {seconds} ثانية
                  </div>
                  <h2 className="font-kufi font-bold text-xl text-desert-olive">
                    أضيفيه بسعر خاص
                  </h2>
                  <p className="font-plex text-sm text-charcoal-ink/60">
                    هذا العرض يختفي عند انتهاء الوقت
                  </p>
                </div>

                {/* Product */}
                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-border-sand">
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                    <PlaceholderImage
                      category={upsellProduct.category}
                      aspectRatio="square"
                      className="rounded-none"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-kufi font-bold text-sm text-desert-olive leading-snug">
                      {upsellProduct.arabicName}
                    </p>
                    <p className="font-plex text-xs text-charcoal-ink/60 leading-relaxed line-clamp-2">
                      {upsellProduct.headline}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-kufi font-bold text-lg text-honey-gold">
                        {formatPrice(UPSELL_PRICE)}
                      </span>
                      <span className="font-plex text-xs text-charcoal-ink/40 line-through">
                        {formatPrice(upsellProduct.prices[1])}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    fullWidth
                    onPress={handleAccept}
                    className="min-h-[52px] bg-honey-gold hover:bg-desert-olive text-white font-kufi font-bold text-base rounded-full shadow-warm"
                  >
                    نعم، أضيفيه للطلب!
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onPress={skipUpsell}
                    className="min-h-[44px] text-charcoal-ink/40 font-plex text-sm hover:text-charcoal-ink/60"
                  >
                    لا شكراً، أتابع بدونه
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
