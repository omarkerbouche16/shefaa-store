'use client';

import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/money';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import type { CartItem, OfferPieces } from '@/types/commerce';
import { PRODUCTS } from '@/config/products';
import { debugCart } from '@/lib/debug-cart';

interface CartLineItemProps {
  item: CartItem;
}

export default function CartLineItem({ item }: CartLineItemProps) {
  const { removeLine, updateLineQuantity } = useCartStore();
  const product = PRODUCTS.find((p) => p.id === item.productId);
  const pieces = item.offer.pieces as OfferPieces;

  function decrement() {
    debugCart('CartLineItem', 'decrement', { id: item.productId, qty: item.quantity - 1 });
    updateLineQuantity(item.productId, pieces, item.quantity - 1);
  }

  function increment() {
    debugCart('CartLineItem', 'increment', { id: item.productId, qty: item.quantity + 1 });
    updateLineQuantity(item.productId, pieces, item.quantity + 1);
  }

  function remove() {
    debugCart('CartLineItem', 'remove', { id: item.productId });
    removeLine(item.productId, pieces);
  }

  return (
    <div className="relative z-10 flex gap-3 border-b border-border-sand py-3 last:border-0 isolate">
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl isolate">
        <PlaceholderImage
          category={product?.category ?? 'default'}
          aspectRatio="square"
          className="rounded-none"
        />
      </div>

      {/* Details */}
      <div className="relative z-10 min-w-0 flex-1 space-y-1">
        <p className="font-kufi text-xs font-semibold leading-snug text-desert-olive line-clamp-2">
          {item.name}
        </p>
        <p className="font-plex text-[11px] text-charcoal-ink/50">
          {item.offer.label}
        </p>

        <div className="flex items-center justify-between gap-2">
          {/* Qty controls — 44×44 touch target with 32px visual */}
          <div
            className="flex items-center rounded-full border border-border-sand bg-white shadow-sm overflow-hidden isolate"
            role="group"
            aria-label="كمية المنتج"
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); decrement(); }}
              style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
              className="touch-manipulation pointer-events-auto flex min-h-[44px] min-w-[44px] items-center justify-center text-sm font-bold text-desert-olive transition-colors hover:bg-warm-sand active:bg-warm-sand"
              aria-label="إنقاص الكمية"
            >
              −
            </button>
            <span className="min-w-[1.5rem] px-1 text-center font-inter text-xs font-semibold text-charcoal-ink select-none">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); increment(); }}
              style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
              className="touch-manipulation pointer-events-auto flex min-h-[44px] min-w-[44px] items-center justify-center text-sm font-bold text-desert-olive transition-colors hover:bg-warm-sand active:bg-warm-sand"
              aria-label="زيادة الكمية"
            >
              +
            </button>
          </div>

          <span className="font-kufi shrink-0 text-sm font-bold text-honey-gold">
            {formatPrice(item.offer.priceDa * item.quantity)}
          </span>
        </div>
      </div>

      {/* Remove button — 44×44 touch target */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); remove(); }}
        style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
        className="touch-manipulation pointer-events-auto shrink-0 self-start flex items-center justify-center min-h-[44px] min-w-[44px] text-charcoal-ink/30 hover:text-error-red transition-colors rounded-full"
        aria-label="حذف المنتج"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
