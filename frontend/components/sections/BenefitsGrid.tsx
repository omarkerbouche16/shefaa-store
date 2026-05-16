'use client';

import { motion } from 'framer-motion';

interface BenefitItem {
  icon: string;
  title: string;
  desc: string;
}

interface BenefitsGridProps {
  benefits: BenefitItem[];
  title?: string;
}

export default function BenefitsGrid({ benefits, title = 'لماذا هذا المنتج؟' }: BenefitsGridProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-kufi font-bold text-lg text-desert-olive">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {benefits.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            className="flex items-start gap-3 p-4 bg-cream rounded-2xl border border-border-sand"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
          >
            <span className="text-2xl shrink-0 mt-0.5">{benefit.icon}</span>
            <div>
              <p className="font-kufi font-semibold text-sm text-desert-olive">{benefit.title}</p>
              <p className="font-plex text-xs text-charcoal-ink/60 leading-relaxed mt-0.5">{benefit.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
