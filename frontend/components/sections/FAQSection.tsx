'use client';

import { Accordion } from '@heroui/react';

const FAQS = [
  {
    id: 'payment',
    q: 'كيف يتم الدفع؟',
    a: 'الدفع يكون عند استلام المنتج (COD). لا يُطلب منك أي دفع مسبق. عند وصول الطلب، تدفعين للمندوب مباشرة.',
  },
  {
    id: 'delivery',
    q: 'ما مدة التوصيل؟',
    a: 'التوصيل يستغرق عادةً من 3 إلى 5 أيام عمل في كل ولايات الجزائر. قد تختلف المدة حسب الولاية وظروف الشحن.',
  },
  {
    id: 'safety',
    q: 'هل المنتجات آمنة؟',
    a: 'نعم، كل منتجاتنا مكونات طبيعية مختارة بعناية. نقدمها كمكملات غذائية طبيعية وليست أدوية. ننصح باستشارة الطبيب في حالة الحمل أو الرضاعة أو وجود حالة صحية خاصة.',
  },
  {
    id: 'tracking',
    q: 'كيف أتتبع طلبي؟',
    a: 'بعد تأكيد الطلب، سيتصل بك فريقنا لتأكيد التفاصيل وإعطاءك معلومات الشحن. يمكنك دائماً التواصل معنا عبر WhatsApp لمتابعة طلبك.',
  },
  {
    id: 'returns',
    q: 'هل يمكنني إرجاع المنتج؟',
    a: 'نعم، إذا كان المنتج تالفاً أو مخالفاً للطلب، تواصلي معنا خلال 48 ساعة من الاستلام وسنجد الحل المناسب.',
  },
  {
    id: 'bundles',
    q: 'ما الفرق بين عروض الكميات؟',
    a: 'عرض القطعة الواحدة للتجربة بـ 1999 دج. عرض 2 قطع الأكثر طلباً بـ 2790 دج (1395 دج/قطعة). عرض 3 قطع أفضل قيمة بـ 3490 دج (1163 دج/قطعة). كلما زادت الكمية، انخفض سعر القطعة.',
  },
];

interface FAQSectionProps {
  items?: typeof FAQS;
  title?: string;
}

export default function FAQSection({ items = FAQS, title = 'الأسئلة الشائعة' }: FAQSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span
            className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-kufi font-semibold"
            style={{ background: 'rgba(200,138,45,0.12)', color: 'var(--color-honey-gold)' }}
          >
            كل ما تريدين معرفته
          </span>
          <h2 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive">{title}</h2>
          <p className="mt-3 font-plex text-sm text-charcoal-ink/60 max-w-sm mx-auto">
            هل لديك سؤال؟ ستجدين إجابتك هنا.
          </p>
        </div>

        <Accordion className="w-full space-y-2">
          {items.map((faq) => (
            <Accordion.Item key={faq.id} id={faq.id}>
              <Accordion.Heading>
                <Accordion.Trigger className="w-full flex items-center justify-between gap-4 text-right">
                  <span className="font-kufi font-semibold text-sm text-desert-olive leading-snug">
                    {faq.q}
                  </span>
                  <Accordion.Indicator className="shrink-0 text-honey-gold" />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <p className="font-plex text-sm text-charcoal-ink/70 leading-relaxed">
                    {faq.a}
                  </p>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
