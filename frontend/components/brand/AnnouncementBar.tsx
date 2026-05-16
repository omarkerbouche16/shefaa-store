'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TruckIcon, ShieldCheckIcon, CheckCircleIcon, LeafIcon } from '@/components/common/Icons';

const MESSAGES = [
  { icon: <TruckIcon className="w-4 h-4" />, text: 'توصيل سريع لكل ولايات الجزائر' },
  { icon: <ShieldCheckIcon className="w-4 h-4" />, text: 'ضمان استرجاع الأموال لمدة 30 يوماً' },
  { icon: <CheckCircleIcon className="w-4 h-4" />, text: 'الدفع عند الاستلام بكل أمان' },
  { icon: <LeafIcon className="w-4 h-4" />, text: 'منتجات طبيعية 100% مصممة لمناخنا' },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-[30] bg-desert-olive text-cream py-2 px-4 text-center overflow-hidden">
      <div className="relative mx-auto flex h-5 max-w-7xl items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 font-kufi text-xs md:text-sm font-semibold tracking-wide"
          >
            <span className="text-honey-gold">{MESSAGES[currentIndex].icon}</span>
            {MESSAGES[currentIndex].text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
