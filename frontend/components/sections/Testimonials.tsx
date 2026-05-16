'use client';

import { motion } from 'framer-motion';
import ReviewCard from '@/components/product/ReviewCard';

const REVIEWS = [
  {
    name: 'فاطمة ز.',
    wilaya: 'وهران',
    rating: 5,
    text: 'جربت علكات البيوتين منذ شهرين والفرق واضح. شعري أصبح أقوى وأقل تساقطاً. المنتج طبيعي والطعم ممتاز، أنصح به بشدة.',
    date: 'أبريل 2026',
  },
  {
    name: 'نور الهدى م.',
    wilaya: 'الجزائر العاصمة',
    rating: 5,
    text: 'مشروب الكولاجين رائع! بعد ثلاثة أسابيع لاحظت بشرتي أنعم وأكثر إشراقاً. التوصيل كان سريعاً والتغليف أنيق.',
    date: 'مارس 2026',
  },
  {
    name: 'سمية ب.',
    wilaya: 'قسنطينة',
    rating: 5,
    text: 'زيت الأرغان من الشفاء من أجود ما جربت. أضعه على شعري قبل النوم والصباح يكون لامعاً وناعماً. سعر معقول ومنتج ممتاز.',
    date: 'مارس 2026',
  },
  {
    name: 'خديجة أ.',
    wilaya: 'عنابة',
    rating: 4,
    text: 'العسل بالمكسرات لذيذ جداً! العائلة كلها أحبته. مع الفطور يعطيك طاقة كافية للصباح. الدفع عند الاستلام ميزة رائعة.',
    date: 'فبراير 2026',
  },
];

const AGGREGATE_STATS = [
  { value: '4.8★', label: 'متوسط التقييم' },
  { value: '+650', label: 'طلب مكتمل' },
  { value: '48', label: 'ولاية في الجزائر' },
  { value: '98%', label: 'نسبة الرضا' },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 overflow-hidden" style={{ background: 'rgba(232,213,181,0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-kufi font-semibold"
            style={{ background: 'rgba(200,138,45,0.12)', color: 'var(--color-honey-gold)' }}
          >
            آراء حقيقية
          </span>
          <h2 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive leading-tight">
            عميلات قرأن المكونات قبل ما يطلبن
          </h2>
          <p className="mt-3 font-plex text-charcoal-ink/60 max-w-md mx-auto leading-relaxed">
            الشفاء هو اختيار النساء اللواتي يبحثن عن الجودة الحقيقية والنتائج المضمونة.
          </p>
        </motion.div>

        {/* Aggregate stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {AGGREGATE_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 text-center border border-border-sand shadow-card"
            >
              <p className="font-kufi font-bold text-2xl text-honey-gold">{stat.value}</p>
              <p className="font-plex text-sm text-charcoal-ink/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <ReviewCard {...review} />
            </motion.div>
          ))}
        </div>

        {/* Bottom social proof */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-plex text-sm text-charcoal-ink/50">
            جميع التقييمات من زبونات حقيقيات — لا تعليقات مزيفة، ولا وعود كاذبة.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
