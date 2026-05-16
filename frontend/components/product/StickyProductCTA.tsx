'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, toast } from '@heroui/react';
import { formatPrice } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { OfferPieces } from '@/types/commerce';
import { debugCart } from '@/lib/debug-cart';
import { ShieldCheckIcon } from '@/components/common/Icons';

interface StickyProductCTAProps {
  productName: string;
  selectedPieces: OfferPieces;
  selectedPrice: number;
  onAddToCart: () => void;
  className?: string;
}

export default function StickyProductCTA({
  productName,
  selectedPieces,
  selectedPrice,
  onAddToCart,
  className,
}: StickyProductCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleAdd() {
    debugCart('StickyProductCTA', 'sticky add to cart', { pieces: selectedPieces });
    onAddToCart();
    toast.success('أُضيف للسلة!', {
      description: `${productName} — ${selectedPieces} قطع`,
      timeout: 2500,
    });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'fixed bottom-0 inset-x-0 z-[155] pb-[env(safe-area-inset-bottom)] bg-cream/98 border-t border-border-sand shadow-warm-lg px-4 py-3 pointer-events-auto backdrop-blur-sm',
            className
          )}
        >
          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            {/* Product info */}
            <div className="flex-1 min-w-0">
              <p className="font-kufi font-bold text-sm text-desert-olive truncate">
                {productName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-kufi font-bold text-honey-gold text-sm">
                  {formatPrice(selectedPrice)}
                </span>
                <span className="font-plex text-xs text-charcoal-ink/50">
                  / {selectedPieces} قطع
                </span>
              </div>
            </div>

            {/* COD badge */}
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <ShieldCheckIcon className="w-4 h-4 text-success-green" />
              <span className="font-plex text-xs text-charcoal-ink/60">COD</span>
            </div>

            {/* Add to cart button */}
            <Button
              onPress={handleAdd}
              className="shrink-0 min-h-[44px] px-6 bg-honey-gold hover:bg-desert-olive text-white font-kufi font-bold text-sm rounded-full shadow-warm transition-colors duration-200 touch-manipulation"
            >
              أضف للسلة ←
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
