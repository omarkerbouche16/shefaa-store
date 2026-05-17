'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, toast } from '@heroui/react';
import { formatPrice } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { OfferPieces } from '@/types/commerce';
import { debugCart } from '@/lib/debug-cart';
import { ShieldCheckIcon, StarIcon } from '@/components/common/Icons';

interface StickyProductCTAProps {
  productName: string;
  selectedPieces: OfferPieces;
  selectedPrice: number;
  rating: number;
  reviewCount: number;
  onAddToCart: () => void;
  className?: string;
}

export default function StickyProductCTA({
  productName,
  selectedPieces,
  selectedPrice,
  rating,
  reviewCount,
  onAddToCart,
  className,
}: StickyProductCTAProps) {
  const [visible, setVisible] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const show = window.scrollY > 500;
      setVisible(show);
      if (show && !hasShownOnce) setHasShownOnce(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasShownOnce]);

  function handleAdd() {
    debugCart('StickyProductCTA', 'sticky add', { pieces: selectedPieces });
    onAddToCart();
    toast.success('أُضيف للسلة!', {
      description: `${productName} — ${selectedPieces} ${selectedPieces === 1 ? 'قطعة' : 'قطع'}`,
      timeout: 2500,
    });
  }

  const piecesLabel = selectedPieces === 1 ? 'قطعة' : selectedPieces === 2 ? 'قطعتين' : `${selectedPieces} قطع`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className={cn(
            'fixed bottom-0 inset-x-0 z-[155] pointer-events-auto',
            'pb-[env(safe-area-inset-bottom)]',
            className
          )}
        >
          {/* Subtle border + blur backdrop */}
          <div className="bg-cream/98 border-t border-border-sand shadow-[0_-8px_30px_-5px_rgba(40,35,30,0.12)] backdrop-blur-md px-4 pt-3 pb-3">
            <div className="max-w-7xl mx-auto">
              {/* Mobile: stacked layout */}
              <div className="flex items-center gap-3">
                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="font-kufi font-bold text-sm text-desert-olive truncate leading-tight">
                    {productName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5" dir="ltr">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon
                          key={s}
                          className={cn(
                            'w-3 h-3',
                            s <= Math.round(rating) ? 'text-honey-gold fill-honey-gold' : 'text-border-sand'
                          )}
                          fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="font-inter text-[11px] text-charcoal-ink/50">
                      ({reviewCount})
                    </span>
                    <span className="font-kufi font-bold text-sm text-honey-gold">
                      {formatPrice(selectedPrice)}
                    </span>
                    <span className="font-plex text-[11px] text-charcoal-ink/50">
                      / {piecesLabel}
                    </span>
                  </div>
                </div>

                {/* COD badge (hidden on very small screens) */}
                <div className="hidden xs:flex items-center gap-1 shrink-0 text-charcoal-ink/50">
                  <ShieldCheckIcon className="w-4 h-4 text-success-green" />
                  <span className="font-plex text-[11px]">COD</span>
                </div>

                {/* CTA button */}
                <Button
                  onPress={handleAdd}
                  className={cn(
                    'shrink-0 min-h-[44px] px-5 sm:px-7',
                    'bg-honey-gold hover:bg-desert-olive text-white',
                    'font-kufi font-bold text-sm rounded-full shadow-warm',
                    'touch-manipulation transition-colors duration-200',
                    hasShownOnce && 'animate-[pulse_2s_ease-in-out_1]'
                  )}
                >
                  أضف للسلة ←
                </Button>
              </div>

              {/* Mini trust row */}
              <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-border-sand/50">
                {[
                  { emoji: '🚚', text: 'توصيل لكل الجزائر' },
                  { emoji: '💵', text: 'دفع عند الاستلام' },
                  { emoji: '✅', text: 'ضمان 30 يوم' },
                ].map((item) => (
                  <span key={item.text} className="flex items-center gap-1 text-[10px] font-plex text-charcoal-ink/50 whitespace-nowrap">
                    <span>{item.emoji}</span>
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
