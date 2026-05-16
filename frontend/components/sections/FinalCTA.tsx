'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LeafIcon, CheckCircleIcon, TruckIcon, ShieldCheckIcon } from '@/components/common/Icons';

const TRUST_ITEMS = [
  { icon: <CheckCircleIcon className="w-4 h-4" />, text: 'COD فقط' },
  { icon: <TruckIcon className="w-4 h-4" />, text: 'كل الجزائر' },
  { icon: <LeafIcon className="w-4 h-4" />, text: '100% طبيعي' },
  { icon: <ShieldCheckIcon className="w-4 h-4" />, text: 'ضمان 30 يوم' },
];

export default function FinalCTA() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-deep-date) 0%, var(--color-desert-olive) 60%, var(--color-palm-green) 100%)' }}
    >
      {/* Pattern overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,248,236,1) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(200,138,45,0.5) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          className="space-y-7 flex flex-col items-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center border border-warm-sand/20"
            style={{ background: 'rgba(232,213,181,0.15)' }}
          >
            <LeafIcon className="w-10 h-10 text-warm-sand" />
          </div>

          {/* Copy */}
          <div className="space-y-3">
            <h2 className="font-kufi font-bold text-3xl md:text-5xl text-warm-sand leading-tight">
              ابدئي رحلتك مع الشفاء اليوم
            </h2>
            <p className="font-plex text-warm-sand/70 text-lg leading-relaxed max-w-xl mx-auto">
              منتجات طبيعية، دفع عند الاستلام، توصيل لكل الجزائر. لا مخاطرة، فقط نتائج حقيقية.
            </p>
          </div>

          {/* CTA button */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-10 min-h-[56px] font-kufi font-bold text-lg rounded-full bg-honey-gold hover:bg-warm-sand hover:text-desert-olive text-white shadow-warm transition-colors duration-300 active:scale-95"
          >
            تسوق عروض الشفاء ←
          </Link>

          {/* Mini trust row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            {TRUST_ITEMS.map((badge) => (
              <span
                key={badge.text}
                className="flex items-center gap-1.5 font-plex text-sm text-warm-sand/60"
              >
                {badge.icon} {badge.text}
              </span>
            ))}
          </div>

          {/* Guarantee note */}
          <p className="font-plex text-xs text-warm-sand/40 max-w-xs">
            مضمون 100% لمدة 30 يوماً أو استرداد كامل للمبلغ — بدون أسئلة
          </p>
        </motion.div>
      </div>
    </section>
  );
}
