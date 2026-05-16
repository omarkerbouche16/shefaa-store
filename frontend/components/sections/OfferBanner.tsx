'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { OFFERS } from '@/config/offers';
import { formatPrice } from '@/lib/money';

export default function OfferBanner() {
  return (
    <section className="py-16 relative overflow-hidden bg-date-gradient">
      {/* Subtle dot pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgba(232,213,181,1) 1.5px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span
            className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-kufi font-semibold"
            style={{ background: 'rgba(200,138,45,0.25)', color: '#E8D5B5' }}
          >
            وفّري أكثر مع الكميات
          </span>
          <h2 className="font-kufi font-bold text-3xl md:text-4xl text-warm-sand">
            اختاري عرضك المناسب
          </h2>
          <p className="mt-2 font-plex text-warm-sand/60">
            كلما زادت الكمية، كلما انخفض سعر القطعة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {OFFERS.map((offer, i) => {
            const isFeatured = offer.pieces === 2;
            return (
              <motion.div
                key={offer.pieces}
                className={[
                  'relative rounded-2xl p-6 text-center space-y-4 border-2 transition-transform',
                  isFeatured
                    ? 'bg-honey-gold border-honey-gold shadow-warm-lg scale-[1.04] md:scale-[1.06]'
                    : 'bg-white/8 border-warm-sand/20 hover:border-warm-sand/40',
                ].join(' ')}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                    <span className="bg-deep-date text-warm-sand text-[10px] font-kufi font-bold px-3 py-1 rounded-full border border-warm-sand/20">
                      ⭐ الأكثر طلباً
                    </span>
                  </div>
                )}

                {/* Piece count */}
                <div
                  className={[
                    'w-12 h-12 rounded-xl mx-auto flex items-center justify-center font-inter font-bold text-lg',
                    isFeatured ? 'bg-white/20 text-white' : 'bg-warm-sand/15 text-warm-sand',
                  ].join(' ')}
                >
                  {offer.pieces}
                </div>

                <div>
                  <p className={`font-kufi font-bold text-base ${isFeatured ? 'text-white' : 'text-warm-sand'}`}>
                    {offer.label}
                  </p>
                  <p className={`font-kufi font-bold text-3xl mt-1 ${isFeatured ? 'text-white' : 'text-honey-gold'}`}>
                    {formatPrice(offer.priceDa)}
                  </p>
                  {offer.perPieceDa && (
                    <p className={`font-plex text-sm mt-0.5 ${isFeatured ? 'text-white/75' : 'text-warm-sand/55'}`}>
                      {formatPrice(offer.perPieceDa)} / قطعة
                    </p>
                  )}
                </div>

                <div className={[
                  'inline-block text-xs font-plex font-semibold px-3 py-1 rounded-full',
                  isFeatured ? 'bg-white/20 text-white' : 'bg-warm-sand/15 text-warm-sand',
                ].join(' ')}>
                  {offer.badge}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-honey-gold hover:bg-warm-sand hover:text-desert-olive text-white font-kufi font-bold text-base rounded-full transition-colors duration-200 shadow-warm active:scale-95"
          >
            تسوق الآن ←
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
