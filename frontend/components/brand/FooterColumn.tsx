'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

export default function FooterColumn({ title, children }: FooterColumnProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-warm-sand/10 md:border-none py-4 md:py-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none"
      >
        <h3 className="font-kufi font-bold text-warm-sand">{title}</h3>
        <span className="md:hidden text-warm-sand/70 text-xl transition-transform duration-200" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          +
        </span>
      </button>

      {/* Mobile view (collapsible) */}
      <div className="md:hidden">
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop view (always visible) */}
      <div className="hidden md:block mt-4">
        {children}
      </div>
    </div>
  );
}
