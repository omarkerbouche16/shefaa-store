'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StarIcon } from '@/components/common/Icons';

interface Review {
  name: string;
  wilaya: string;
  rating: number;
  text: string;
  date?: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  className?: string;
}

const STAR_DIST = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 14 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" dir="ltr" aria-label={`${rating} نجوم`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon
          key={s}
          className={cn('w-3.5 h-3.5', s <= rating ? 'text-honey-gold' : 'text-border-sand')}
          fill={s <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 120;
  const displayText = !expanded && isLong ? review.text.slice(0, 120) + '…' : review.text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-white rounded-2xl p-5 border border-border-sand shadow-card space-y-3"
    >
      {/* Stars + verified */}
      <div className="flex items-center justify-between">
        <StarRow rating={review.rating} />
        <span className="inline-flex items-center gap-1 bg-success-green/10 text-success-green text-[10px] font-plex font-semibold px-2 py-0.5 rounded-full">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          مشتري موثق
        </span>
      </div>

      {/* Review text */}
      <p className="font-plex text-sm text-charcoal-ink/80 leading-relaxed">
        {displayText}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mr-1 text-honey-gold font-semibold hover:text-desert-olive transition-colors"
          >
            {expanded ? 'أقل' : 'المزيد'}
          </button>
        )}
      </p>

      {/* Author */}
      <div className="flex items-center justify-between pt-2 border-t border-border-sand/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-desert-olive to-palm-green flex items-center justify-center shrink-0">
            <span className="font-kufi font-bold text-xs text-cream">
              {review.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-kufi font-semibold text-sm text-desert-olive leading-none">{review.name}</p>
            <p className="font-plex text-[11px] text-charcoal-ink/50 mt-0.5">{review.wilaya}</p>
          </div>
        </div>
        {review.date && (
          <span className="font-inter text-[11px] text-charcoal-ink/40">{review.date}</span>
        )}
      </div>
    </motion.div>
  );
}

export default function ProductReviews({
  reviews,
  rating,
  reviewCount,
  className,
}: ProductReviewsProps) {
  const [filter, setFilter] = useState<number | null>(null);
  const filtered = filter ? reviews.filter((r) => r.rating === filter) : reviews;

  return (
    <section className={cn('space-y-6', className)}>
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-kufi font-bold text-2xl text-desert-olive">
          آراء العملاء
        </h2>
        <span className="font-inter text-sm text-charcoal-ink/50">
          {reviewCount} تقييم
        </span>
      </div>

      {/* Aggregate card */}
      <div className="bg-white rounded-2xl border border-border-sand p-5 shadow-card">
        <div className="flex gap-6 items-center">
          {/* Big score */}
          <div className="text-center shrink-0">
            <div className="font-inter font-bold text-5xl text-desert-olive leading-none">
              {rating}
            </div>
            <div className="flex justify-center gap-0.5 mt-1.5" dir="ltr">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  className="w-4 h-4 text-honey-gold"
                  fill="currentColor"
                />
              ))}
            </div>
            <p className="font-plex text-[11px] text-charcoal-ink/50 mt-1">
              من 5
            </p>
          </div>

          {/* Star bars */}
          <div className="flex-1 space-y-1.5">
            {STAR_DIST.map(({ stars, pct }) => (
              <button
                key={stars}
                type="button"
                onClick={() => setFilter(filter === stars ? null : stars)}
                className={cn(
                  'w-full flex items-center gap-2 group rounded-lg px-1 py-0.5 transition-colors',
                  filter === stars ? 'bg-honey-gold/5' : 'hover:bg-warm-sand/30'
                )}
              >
                <span className="font-inter text-xs font-semibold text-charcoal-ink/60 w-4 shrink-0 text-left" dir="ltr">
                  {stars}
                </span>
                <StarIcon
                  className="w-3 h-3 text-honey-gold shrink-0"
                  fill="currentColor"
                />
                <div className="flex-1 h-2 bg-border-sand rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 * (5 - stars), ease: 'easeOut' }}
                    className={cn(
                      'h-full rounded-full',
                      filter === stars ? 'bg-honey-gold' : 'bg-honey-gold/70 group-hover:bg-honey-gold'
                    )}
                  />
                </div>
                <span className="font-inter text-[11px] text-charcoal-ink/40 shrink-0 w-7 text-right" dir="ltr">
                  {pct}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        {filter && (
          <div className="mt-3 pt-3 border-t border-border-sand/50 flex items-center gap-2">
            <span className="font-plex text-xs text-charcoal-ink/60">فلترة:</span>
            <button
              type="button"
              onClick={() => setFilter(null)}
              className="inline-flex items-center gap-1 bg-honey-gold/15 text-honey-gold text-xs font-plex font-semibold px-2.5 py-1 rounded-full hover:bg-honey-gold/25 transition-colors"
            >
              {filter} نجوم ×
            </button>
          </div>
        )}
      </div>

      {/* Review cards grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter ?? 'all'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {filtered.length > 0 ? (
            filtered.map((review, i) => (
              <ReviewCard key={review.name + i} review={review} index={i} />
            ))
          ) : (
            <p className="font-plex text-sm text-charcoal-ink/50 col-span-2 text-center py-8">
              لا توجد تقييمات بهذا التصنيف
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
