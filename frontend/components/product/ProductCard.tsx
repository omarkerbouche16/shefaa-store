'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, toast } from '@heroui/react';
import { useCartStore, buildCartItem } from '@/store/cart-store';
import { OFFER_PRICES } from '@/config/offers';
import { formatPrice } from '@/lib/money';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import type { Product } from '@/types/commerce';
import { cn } from '@/lib/utils';
import { StarIcon } from '@/components/common/Icons';

interface ProductCardProps {
  product: Product;
  className?: string;
  hideOfferSelector?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={cn('w-3.5 h-3.5', star <= Math.floor(rating) ? 'text-honey-gold' : 'text-border-sand')}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product, className, hideOfferSelector }: ProductCardProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const price = OFFER_PRICES[product.defaultOffer];

  function handleAddToCart() {
    addItem(
      buildCartItem(
        product.id,
        product.slug,
        product.arabicName,
        product.defaultOffer,
        price,
        'collection'
      )
    );
    openCart();

    toast.success('أُضيف للسلة بنجاح!', {
      description: product.arabicName,
      timeout: 2500,
    });
  }

  function handleExplore() {
    router.push(`/products/${product.slug}`);
  }

  return (
    <article
      className={cn(
        'group relative isolate bg-cream rounded-3xl overflow-hidden border border-border-sand shadow-card hover:shadow-warm-lg transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="relative">
          <PlaceholderImage
            label={product.arabicName}
            category={product.category}
            aspectRatio="portrait"
            className="rounded-none group-hover:scale-105 transition-transform duration-500"
          />
          {/* Scarcity badge */}
          <div className="pointer-events-none absolute top-3 right-3">
            <span className="inline-block bg-error-red/90 text-white text-[10px] font-plex font-semibold px-2 py-1 rounded-full">
              {product.scarcity}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-kufi font-bold text-desert-olive text-sm leading-snug line-clamp-2 hover:text-honey-gold transition-colors">
              {product.arabicName}
            </h3>
          </Link>
          <p className="mt-1 font-plex text-xs text-charcoal-ink/60 leading-relaxed line-clamp-2">
            {product.headline}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="font-inter text-xs text-charcoal-ink/50">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        {!hideOfferSelector && (
          <div className="flex items-baseline gap-1">
            <span className="font-kufi font-bold text-lg text-honey-gold">
              {formatPrice(price)}
            </span>
            <span className="font-plex text-xs text-charcoal-ink/50">
              / {product.defaultOffer} قطع
            </span>
          </div>
        )}

        {/* CTA — HeroUI Button */}
        <Button
          variant={hideOfferSelector ? 'secondary' : 'primary'}
          fullWidth
          className={cn(
            'font-kufi font-bold text-sm rounded-full min-h-[44px] touch-manipulation',
            hideOfferSelector
              ? 'bg-honey-gold hover:bg-desert-olive text-white'
              : 'bg-desert-olive hover:bg-palm-green text-cream'
          )}
          onPress={() => {
            if (hideOfferSelector) handleExplore();
            else handleAddToCart();
          }}
        >
          {hideOfferSelector ? 'اكتشفي المنتج' : 'أضف للسلة'}
        </Button>
      </div>
    </article>
  );
}
