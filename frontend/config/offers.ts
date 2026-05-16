import type { Offer, OfferPieces } from '@/types/commerce';

export const UPSELL_PRICE = 999;

export const OFFER_PRICES: Record<OfferPieces, number> = {
  1: 1999,
  2: 2790,
  3: 3490,
};

export const OFFERS: Offer[] = [
  {
    pieces: 2,
    priceDa: 2790,
    label: '2 قطع',
    badge: 'الأكثر طلبا',
    perPieceDa: 1395,
  },
  {
    pieces: 3,
    priceDa: 3490,
    label: '3 قطع',
    badge: 'أفضل قيمة',
    perPieceDa: 1163,
  },
  {
    pieces: 1,
    priceDa: 1999,
    label: '1 قطعة',
    badge: 'للتجربة',
  },
];

export const OFFER_BADGES: Record<OfferPieces, string> = {
  1: 'للتجربة',
  2: 'الأكثر طلبا',
  3: 'أفضل قيمة',
};
