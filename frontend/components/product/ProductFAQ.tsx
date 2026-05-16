'use client';

import { Accordion } from '@heroui/react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  items: FAQItem[];
  className?: string;
}

export default function ProductFAQ({ items, className }: ProductFAQProps) {
  return (
    <Accordion className={cn('w-full space-y-2', className)}>
      {items.map((item, i) => (
        <Accordion.Item key={i} id={String(i)}>
          <Accordion.Heading>
            <Accordion.Trigger className="w-full flex items-center justify-between gap-4 text-right">
              <span className="font-kufi font-semibold text-sm text-desert-olive leading-snug">
                {item.question}
              </span>
              <Accordion.Indicator className="shrink-0 text-honey-gold" />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <p className="font-plex text-sm text-charcoal-ink/70 leading-relaxed">
                {item.answer}
              </p>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
