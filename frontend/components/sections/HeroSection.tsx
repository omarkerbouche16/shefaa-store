'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { StarIcon, CheckCircleIcon, TruckIcon, LeafIcon, ShieldCheckIcon } from '@/components/common/Icons';

const STATS = [
  { value: '+650', label: 'طلب مكتمل' },
  { value: '48', label: 'ولاية' },
  { value: '4.8★', label: 'تقييم' },
  { value: '30', label: 'يوم ضمان' },
];

const TRUST_PILLS = [
  { icon: <CheckCircleIcon className="w-3.5 h-3.5 text-success-green" />, label: 'COD — دفع عند الاستلام' },
  { icon: <TruckIcon className="w-3.5 h-3.5 text-desert-olive" />, label: 'توصيل لكل الجزائر' },
  { icon: <LeafIcon className="w-3.5 h-3.5 text-palm-green" />, label: '100% طبيعي' },
  { icon: <ShieldCheckIcon className="w-3.5 h-3.5 text-honey-gold" />, label: 'ضمان 30 يوماً' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-cream">
      {/* Ambient background blobs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(200,138,45,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(63,74,47,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-10"
          style={{ background: 'radial-gradient(ellipse, rgba(232,213,181,0.8) 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Visual panel ── */}
          <motion.div
            className="order-first md:order-last"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Main visual card */}
            <div className="relative aspect-[4/5] rounded-4xl overflow-hidden shadow-warm-lg">
              <div className="absolute inset-0 bg-olive-gradient" />

              {/* Pattern overlay */}
              <div aria-hidden className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,248,236,0.6) 1px, transparent 0)`,
                  backgroundSize: '32px 32px',
                }} />

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
                {/* Brand mark */}
                <motion.div
                  className="w-28 h-28 rounded-full bg-cream/15 border border-warm-sand/30 flex items-center justify-center backdrop-blur-sm"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <LeafIcon className="w-14 h-14 text-warm-sand" />
                </motion.div>

                <div className="space-y-1">
                  <p className="font-kufi font-bold text-3xl text-warm-sand tracking-tight">الشفاء</p>
                  <p className="font-inter text-xs text-warm-sand/50 tracking-[0.2em] uppercase">shefaa.shop</p>
                </div>

                {/* Stats row */}
                <div className="w-full grid grid-cols-4 gap-2 px-2">
                  {STATS.map((s) => (
                    <div key={s.label} className="bg-warm-sand/10 rounded-xl py-2 px-1 text-center border border-warm-sand/20">
                      <p className="font-kufi font-bold text-sm text-warm-sand">{s.value}</p>
                      <p className="font-plex text-[9px] text-warm-sand/60 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating social proof card */}
            <motion.div
              className="absolute -bottom-4 -right-1 md:-right-5 bg-white rounded-2xl shadow-warm-lg p-3.5 border border-border-sand max-w-[190px] z-10"
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 shrink-0 rounded-full bg-success-green/15 flex items-center justify-center text-success-green font-bold text-sm">
                  ✓
                </div>
                <div>
                  <p className="font-kufi text-xs font-bold text-desert-olive">طلب جديد</p>
                  <p className="font-plex text-[10px] text-charcoal-ink/50 mt-0.5">منذ دقيقتين — وهران</p>
                  <div className="flex gap-0.5 mt-1" dir="ltr">
                    {[1,2,3,4,5].map((s) => (
                      <StarIcon key={s} className="w-2.5 h-2.5 text-honey-gold" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Copy panel ── */}
          <motion.div
            className="space-y-7 text-right order-last md:order-first"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants}>
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-kufi font-semibold"
                style={{ background: 'rgba(200,138,45,0.12)', color: 'var(--color-honey-gold)' }}
              >
                <LeafIcon className="w-4 h-4" />
                منتجات طبيعية من قلب الجزائر
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants}>
              <h1 className="font-kufi font-bold text-4xl sm:text-5xl lg:text-6xl text-desert-olive leading-[1.1] tracking-tight">
                نقاوة الصحراء،
                <br />
                <span
                  className="relative inline-block"
                  style={{ color: 'var(--color-honey-gold)' }}
                >
                  حكمة الأجداد
                  {/* Underline decoration */}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 right-0 w-full h-[3px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--color-honey-gold), transparent)' }}
                  />
                </span>
              </h1>
            </motion.div>

            {/* Body */}
            <motion.p
              className="font-plex text-lg text-charcoal-ink/65 leading-relaxed max-w-lg"
              variants={itemVariants}
            >
              منتجات طبيعية مختارة بعناية، مستوحاة من حكمة الأجداد وعطاء الصحراء الجزائرية. الدفع عند الاستلام في كل ولايات الجزائر.
            </motion.p>

            {/* Trust pills */}
            <motion.div className="flex flex-wrap gap-2" variants={itemVariants}>
              {TRUST_PILLS.map((pill) => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 bg-white border border-border-sand text-charcoal-ink/70 text-xs font-plex font-medium px-3 py-1.5 rounded-full shadow-card"
                >
                  {pill.icon}
                  {pill.label}
                </span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div className="flex flex-wrap gap-3" variants={itemVariants}>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 min-h-[52px] bg-desert-olive hover:bg-palm-green text-cream font-kufi font-bold text-base rounded-full transition-colors duration-200 shadow-warm active:scale-95"
              >
                تسوق عروض الشفاء ←
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-6 min-h-[52px] border-2 border-desert-olive/30 text-desert-olive hover:border-honey-gold hover:text-honey-gold font-kufi font-semibold text-sm rounded-full transition-colors duration-200"
              >
                اعرفي قصتنا
              </Link>
            </motion.div>

            {/* Star rating */}
            <motion.div className="flex items-center gap-3" variants={itemVariants}>
              <div className="flex gap-0.5" dir="ltr">
                {[1,2,3,4,5].map((s) => (
                  <StarIcon key={s} className="w-4 h-4 text-honey-gold" />
                ))}
              </div>
              <span className="font-inter text-sm font-bold text-charcoal-ink">4.8</span>
              <span className="font-plex text-sm text-charcoal-ink/50">من أكثر من 650 طلب مكتمل</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
