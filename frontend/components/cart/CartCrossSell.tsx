'use client';

import { Button, toast } from '@heroui/react';
import { useCartStore, buildCartItem } from '@/store/cart-store';
import { OFFER_PRICES } from '@/config/offers';
import { formatPrice } from '@/lib/money';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import type { Product } from '@/types/commerce';
import { debugCart } from '@/lib/debug-cart';

interface CartCrossSellProps {
  product: Product;
}

export default function CartCrossSell({ product }: CartCrossSellProps) {
  const { addItem } = useCartStore();

  function handleAdd() {
    debugCart('CartCrossSell', 'add cross-sell', { id: product.id });
    addItem(
      buildCartItem(
        product.id,
        product.slug,
        product.arabicName,
        product.defaultOffer,
        OFFER_PRICES[product.defaultOffer],
        'cart_cross_sell'
      )
    );
    toast.success('أُضيف للسلة!', {
      description: product.arabicName,
      timeout: 2000,
    });
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border-sand">
      {/* Thumbnail */}
      <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden">
        <PlaceholderImage
          category={product.category}
          aspectRatio="square"
          className="rounded-none"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-kufi text-xs font-semibold text-desert-olive leading-snug line-clamp-1">
          {product.arabicName}
        </p>
        <p className="font-kufi text-xs text-honey-gold font-bold mt-0.5">
          {formatPrice(OFFER_PRICES[product.defaultOffer])}
        </p>
      </div>

      {/* Add button — 44px touch target */}
      <Button
        size="sm"
        onPress={(e) => {
          // stop bubbling to cart wrapper's onPointerDown close handler
          (e.target as HTMLElement)?.closest('[data-cart-layer="panel"]');
          handleAdd();
        }}
        style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
        className="shrink-0 min-h-[44px] px-4 rounded-full bg-desert-olive hover:bg-palm-green text-white font-plex text-xs font-semibold"
      >
        أضف
      </Button>
    </div>
  );
}
