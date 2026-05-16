'use client';

import { motion } from 'framer-motion';
import { DropletIcon, PillIcon, FlaskIcon, LeafIcon, SparklesIcon, BoxIcon } from '@/components/common/Icons';

const INGREDIENTS = [
  {
    icon: <DropletIcon className="w-8 h-8 text-honey-gold" />,
    name: 'عسل طبيعي',
    benefit: 'مصدر طاقة وغذاء طبيعي غني بالمعادن والمغذيات',
    color: 'bg-honey-gold/15 border-honey-gold/30',
  },
  {
    icon: <PillIcon className="w-8 h-8 text-palm-green" />,
    name: 'بيوتين',
    benefit: 'يدعم صحة الشعر والأظافر عند استخدامه بانتظام',
    color: 'bg-palm-green/15 border-palm-green/30',
  },
  {
    icon: <FlaskIcon className="w-8 h-8 text-desert-olive" />,
    name: 'كولاجين بحري',
    benefit: 'يساعد على دعم مرونة البشرة ومظهرها الصحي',
    color: 'bg-desert-olive/15 border-desert-olive/30',
  },
  {
    icon: <SparklesIcon className="w-8 h-8 text-clay-terra" />,
    name: 'زيت الأرغان',
    benefit: 'غني بالأحماض الدهنية وفيتامين E للشعر والبشرة',
    color: 'bg-clay-terra/15 border-clay-terra/30',
  },
  {
    icon: <BoxIcon className="w-8 h-8 text-desert-olive" />,
    name: 'زبدة الشيا',
    benefit: 'مرطب طبيعي عميق مناسب لكل أنواع البشرة',
    color: 'bg-warm-sand border-border-sand',
  },
  {
    icon: <LeafIcon className="w-8 h-8 text-palm-green" />,
    name: 'أعشاب الصحراء',
    benefit: 'وصفات تقليدية موروثة بروح الجزائر الأصيلة',
    color: 'bg-palm-green/15 border-palm-green/30',
  },
];

export default function IngredientAuthority() {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block bg-desert-olive/10 text-desert-olive text-xs font-kufi font-semibold px-3 py-1 rounded-full mb-3">
            سر الفعالية
          </span>
          <h2 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive">
            قوة الطبيعة مدعومة بالعلم
          </h2>
          <p className="mt-2 font-plex text-charcoal-ink/70 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            توقفنا عن استخدام المنتجات التي تضر بجمالك واستبدلناها بتركيبات طبيعية فاخرة. كل مكون تم اختباره علمياً ليمنحك أقصى درجات العناية التي تستحقينها.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {INGREDIENTS.map((ingredient, i) => (
            <motion.div
              key={ingredient.name}
              className={`rounded-2xl border p-5 space-y-3 ${ingredient.color}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-white/50 rounded-xl">
                {ingredient.icon}
              </div>
              <div>
                <h3 className="font-kufi font-bold text-sm text-desert-olive">{ingredient.name}</h3>
                <p className="mt-1 font-plex text-xs text-charcoal-ink/60 leading-relaxed">
                  {ingredient.benefit}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
