'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    num: '١',
    emoji: '🛍️',
    title: 'اختاري روتينك',
    desc: 'تصفحي مجموعتنا الطبيعية واختاري ما يناسب احتياجاتك. منتج واحد أو روتين متكامل.',
    color: 'bg-honey-gold/10 border-honey-gold/30',
    numColor: 'text-honey-gold',
  },
  {
    num: '٢',
    emoji: '📋',
    title: 'أكّدي طلبك (بدون دفع)',
    desc: 'اسمك ورقم هاتفك فقط. الدفع عند الاستلام، وفريقنا يتواصل معك لتأكيد العنوان.',
    color: 'bg-desert-olive/10 border-desert-olive/30',
    numColor: 'text-desert-olive',
  },
  {
    num: '٣',
    emoji: '🚚',
    title: 'استلمي وادفعي',
    desc: 'نوصل لباب بيتك في كل الجزائر خلال 3-5 أيام. دفعك نقداً وقت الاستلام فقط.',
    color: 'bg-palm-green/10 border-palm-green/30',
    numColor: 'text-palm-green',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span
            className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-kufi font-semibold"
            style={{ background: 'rgba(63,74,47,0.1)', color: 'var(--color-desert-olive)' }}
          >
            خطوات بسيطة
          </span>
          <h2 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive leading-tight">
            من الطلب لباب بيتك في 3 خطوات
          </h2>
          <p className="mt-3 font-plex text-charcoal-ink/60 max-w-md mx-auto text-lg leading-relaxed">
            بدون دفع أونلاين. بدون التزام. بدون مخاطرة.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector for desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute top-14 right-[18%] left-[18%] h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--color-border-sand), var(--color-border-sand), transparent)',
            }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              className={`relative flex flex-col items-center text-center p-6 rounded-3xl border-2 ${step.color}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {/* Step circle */}
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-full bg-white shadow-card border-2 border-current/10 flex items-center justify-center text-4xl">
                  {step.emoji}
                </div>
                <span
                  className={`absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-current/10 flex items-center justify-center font-kufi font-bold text-sm ${step.numColor}`}
                >
                  {step.num}
                </span>
              </div>

              <h3 className="font-kufi font-bold text-lg text-desert-olive mb-2">
                {step.title}
              </h3>
              <p className="font-plex text-sm text-charcoal-ink/65 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Guarantee note */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="inline-flex items-center gap-2 font-plex text-sm text-charcoal-ink/50">
            <span>🛡️</span>
            ضمان 30 يوم أو استرداد كامل — بدون أسئلة
          </p>
        </motion.div>
      </div>
    </section>
  );
}
