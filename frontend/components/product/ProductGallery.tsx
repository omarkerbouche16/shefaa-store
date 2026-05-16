'use client';

import { useState } from 'react';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  productName: string;
  category: string;
  className?: string;
}

const THUMB_IDS = [0, 1, 2] as const;

export default function ProductGallery({ productName, category, className }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={cn('relative isolate space-y-3', className)}>
      <div className="relative rounded-3xl overflow-hidden shadow-warm-lg">
        <PlaceholderImage
          key={activeIndex}
          label={activeIndex === 0 ? productName : undefined}
          category={category}
          aspectRatio="portrait"
          className={cn('rounded-3xl transition-opacity duration-200')}
        />
        <div className="pointer-events-none absolute bottom-4 right-4">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-desert-olive text-xs font-kufi font-semibold px-3 py-1.5 rounded-full shadow-card">
            🌿 طبيعي 100%
          </span>
        </div>
      </div>

      <div className="flex gap-2" role="tablist" aria-label="معاينات المنتج">
        {THUMB_IDS.map((i) => {
          const selected = activeIndex === i;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'touch-manipulation flex-1 min-h-[44px] rounded-xl overflow-hidden border-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-honey-gold focus-visible:ring-offset-2',
                selected ? 'border-honey-gold ring-2 ring-honey-gold/25' : 'border-border-sand hover:border-honey-gold/60'
              )}
            >
              <span className="sr-only">صورة {i + 1}</span>
              <PlaceholderImage
                category={category}
                aspectRatio="square"
                className="rounded-none pointer-events-none"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
