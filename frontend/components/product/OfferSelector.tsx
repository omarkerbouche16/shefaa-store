'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { OFFERS, OFFER_PRICES } from '@/config/offers';
import { formatPrice } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { OfferPieces } from '@/types/commerce';

interface OfferSelectorProps {
  defaultOffer: OfferPieces;
  onSelect: (pieces: OfferPieces, priceDa: number) => void;
  productPrices?: { 1: number; 2: number; 3: number };
}

export default function OfferSelector({
  defaultOffer,
  onSelect,
  productPrices,
}: OfferSelectorProps) {
  const [selected, setSelected] = useState<OfferPieces>(defaultOffer);

  const prices = productPrices ?? OFFER_PRICES;

  function handleSelect(pieces: OfferPieces) {
    setSelected(pieces);
    onSelect(pieces, prices[pieces]);
  }

  const basePrice = prices[1];

  return (
    <div className="space-y-2">
      <p className="font-kufi text-sm font-semibold text-desert-olive">اختاري كميتك:</p>
      <div className="flex flex-col gap-3">
        {OFFERS.map((offer) => {
          const price = prices[offer.pieces];
          const perPiece = Math.round(price / offer.pieces);
          const savings = basePrice * offer.pieces - price;
          const isSelected = selected === offer.pieces;
          const isMostPopular = offer.pieces === 2;
          const isBestValue = offer.pieces === 3;

          return (
            <motion.button
              key={offer.pieces}
              type="button"
              onClick={() => handleSelect(offer.pieces)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'touch-manipulation relative w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200',
                isSelected && isMostPopular
                  ? 'border-honey-gold bg-honey-gold/10 shadow-warm ring-2 ring-honey-gold/30'
                  : isSelected
                  ? 'border-desert-olive bg-desert-olive/8 shadow-warm'
                  : 'border-border-sand bg-white hover:border-honey-gold/50 hover:bg-warm-sand/30'
              )}
            >
              {/* Badge */}
              <span
                className={cn(
                  'pointer-events-none absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-plex font-bold',
                  isMostPopular
                    ? 'bg-honey-gold text-white'
                    : isBestValue
                    ? 'bg-desert-olive text-cream'
                    : 'bg-warm-sand text-charcoal-ink'
                )}
              >
                {offer.badge}
              </span>

              <div className="flex items-center gap-3">
                {/* Radio indicator */}
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                    isSelected ? 'border-honey-gold' : 'border-border-sand'
                  )}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-honey-gold" />
                  )}
                </div>

                <div className="text-right">
                  <span className="font-kufi font-bold text-desert-olive text-sm">
                    {offer.label}
                  </span>
                  <p className="font-plex text-xs text-charcoal-ink/50">
                    {formatPrice(perPiece)} / قطعة
                  </p>
                </div>
              </div>

              <div className="text-left space-y-0.5">
                <div className="font-kufi font-bold text-lg text-honey-gold leading-none">
                  {formatPrice(price)}
                </div>
                {savings > 0 && (
                  <div className="font-plex text-[10px] text-success-green font-semibold">
                    وفري {formatPrice(savings)}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
