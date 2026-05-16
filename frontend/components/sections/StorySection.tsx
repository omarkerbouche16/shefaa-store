'use client';

import { motion } from 'framer-motion';
import { HandshakeHeartIcon, FlaskIcon, TruckIcon, SparklesIcon, LeafIcon } from '@/components/common/Icons';

const VALUES = [
  { icon: <HandshakeHeartIcon className="w-6 h-6 text-honey-gold" />, title: 'ضمان 30 يوماً', desc: 'نضمن لك النتائج أو نسترجع أموالك بكل ثقة' },
  { icon: <FlaskIcon className="w-6 h-6 text-honey-gold" />, title: 'فعالية مثبتة', desc: 'مكونات طبيعية مدروسة علمياً لنتائج سريعة وملموسة' },
  { icon: <TruckIcon className="w-6 h-6 text-honey-gold" />, title: 'توصيل سريع وموثوق', desc: 'الدفع عند الاستلام بعد التأكد من منتجك في كل ولايات الجزائر' },
  { icon: <SparklesIcon className="w-6 h-6 text-honey-gold" />, title: 'مصمم لمناخنا', desc: 'تركيبات مخصصة لتحمل قساوة المناخ وحماية بشرتك وشعرك' },
];

export default function StorySection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <motion.div
            className="relative order-last md:order-first"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-desert-olive via-palm-green to-honey-gold shadow-warm-lg">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-cream/20 flex items-center justify-center">
                  <LeafIcon className="w-8 h-8 text-warm-sand" />
                </div>
                <p className="font-kufi text-2xl font-bold text-warm-sand">من الصحراء</p>
                <p className="font-plex text-sm text-warm-sand/70 leading-relaxed">
                  صحراء الجزائر الشاسعة، مصدر الإلهام والعطاء
                </p>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-4 border-honey-gold/30" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-warm-sand border-4 border-border-sand" />
          </motion.div>

          {/* Copy */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <span className="inline-block bg-honey-gold/15 text-honey-gold text-xs font-kufi font-semibold px-3 py-1 rounded-full mb-3">
                لماذا الشفاء؟
              </span>
              <h2 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive leading-tight">
                حلول حقيقية صُممت خصيصاً لكِ
              </h2>
            </div>

            <div className="space-y-4 font-plex text-charcoal-ink/70 leading-relaxed">
              <p>
                ندرك تماماً التحديات التي تواجهينها يومياً: شمس الجزائر القوية، المناخ الجاف الذي يسلب بشرتك نضارتها، والتعب الذي يؤثر على صحتك. المنتجات التجارية لم تعد تكفي، وأنتِ تستحقين الأفضل.
              </p>
              <p>
                لذلك، عدنا في &quot;الشفاء&quot; إلى جذورنا وإلى حكمة أجدادنا. جمعنا أقوى المكونات الطبيعية الفعالة—وطورناها لتناسب احتياجاتك العصرية. لأننا نؤمن أن الجمال الحقيقي يبدأ من الصحة، نقدم لكِ منتجات مجربة، ومضمونة 100% لمدة 30 يوماً.
              </p>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-2 gap-3">
              {VALUES.map((value) => (
                <div key={value.title} className="bg-white rounded-2xl p-4 border border-border-sand space-y-2 shadow-card">
                  <div className="w-10 h-10 rounded-xl bg-desert-olive flex items-center justify-center">
                    {value.icon}
                  </div>
                  <p className="font-kufi font-bold text-sm text-desert-olive">{value.title}</p>
                  <p className="font-plex text-xs text-charcoal-ink/60 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
