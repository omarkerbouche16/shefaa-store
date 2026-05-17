'use client';

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  productName: string;
  category: string;
  scarcity?: string;
  className?: string;
}

const SLIDE_COUNT = 4;
const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => i);

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function ProductGallery({
  productName,
  category,
  scarcity,
  className,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  function goTo(index: number, dir?: number) {
    const next = Math.max(0, Math.min(SLIDE_COUNT - 1, index));
    setDirection(dir ?? (next > active ? 1 : -1));
    setActive(next);
  }

  function handleDragEnd(_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const threshold = 40;
    if (info.offset.x < -threshold && active < SLIDE_COUNT - 1) goTo(active + 1, 1);
    else if (info.offset.x > threshold && active > 0) goTo(active - 1, -1);
  }

  return (
    <div className={cn('select-none', className)}>
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-3xl bg-warm-sand/30 shadow-warm-lg aspect-[4/5]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.9 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
          >
            <PlaceholderImage
              label={active === 0 ? productName : undefined}
              category={category}
              aspectRatio="portrait"
              className="w-full h-full rounded-3xl pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/25 to-transparent rounded-b-3xl" />

        {/* Top badges */}
        <div className="pointer-events-none absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-palm-green text-[11px] font-plex font-bold px-2.5 py-1.5 rounded-full shadow-card">
            🌿 طبيعي 100%
          </span>
          {scarcity && (
            <motion.span
              initial={{ scale: 0.85 }}
              animate={{ scale: [0.85, 1.05, 1] }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="inline-flex items-center gap-1 bg-error-red text-white text-[11px] font-plex font-bold px-2.5 py-1.5 rounded-full shadow-card"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
              {scarcity}
            </motion.span>
          )}
        </div>

        {/* Slide counter */}
        <div className="pointer-events-none absolute bottom-4 left-4">
          <span className="font-inter text-xs font-bold text-white/80 tabular-nums" dir="ltr">
            {active + 1} / {SLIDE_COUNT}
          </span>
        </div>

        {/* Swipe hint (mobile) */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 sm:hidden">
          <span className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white/80 text-[10px] font-plex px-2.5 py-1 rounded-full">
            اسحب للتصفح
          </span>
        </div>

        {/* Desktop arrow nav */}
        {active > 0 && (
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm items-center justify-center shadow-card hover:bg-white transition-colors"
            aria-label="الصورة السابقة"
          >
            <svg className="w-4 h-4 text-desert-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {active < SLIDE_COUNT - 1 && (
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm items-center justify-center shadow-card hover:bg-white transition-colors"
            aria-label="الصورة التالية"
          >
            <svg className="w-4 h-4 text-desert-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Pill dot indicators */}
      <div className="flex justify-center items-center gap-1.5 mt-3" role="tablist" aria-label="اختيار الصورة">
        {slides.map((i) => (
          <motion.button
            key={i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`صورة ${i + 1}`}
            onClick={() => goTo(i)}
            animate={{ width: active === i ? 24 : 8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className={cn(
              'h-2 rounded-full touch-manipulation transition-colors',
              active === i ? 'bg-honey-gold' : 'bg-border-sand hover:bg-honey-gold/40'
            )}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-3" role="tablist" aria-label="معاينات المنتج">
        {slides.map((i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`صورة ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              'touch-manipulation flex-1 min-h-[56px] rounded-xl overflow-hidden border-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-honey-gold focus-visible:ring-offset-2',
              active === i
                ? 'border-honey-gold shadow-[0_0_0_3px_rgba(212,160,23,0.2)]'
                : 'border-border-sand opacity-60 hover:opacity-90 hover:border-honey-gold/50'
            )}
          >
            <PlaceholderImage
              category={category}
              aspectRatio="square"
              className="rounded-none pointer-events-none"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
