'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import ProductCard from '@/components/product/ProductCard';
import TrustStrip from '@/components/sections/TrustStrip';
import FAQSection from '@/components/sections/FAQSection';
import { PRODUCTS } from '@/config/products';
import type { ProductCategory } from '@/types/commerce';
import { cn } from '@/lib/utils';

const CATEGORIES: { value: ProductCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'الكل', emoji: '✨' },
  { value: 'hair', label: 'الشعر', emoji: '💆' },
  { value: 'skin', label: 'البشرة', emoji: '✨' },
  { value: 'food', label: 'العسل والأغذية', emoji: '🍯' },
  { value: 'beauty', label: 'الزيوت والزبدة', emoji: '🌿' },
  { value: 'herbs', label: 'أعشاب الصحراء', emoji: '🌱' },
];

const PRODUCTS_PAGE_FAQ = [
  { id: 'cod', q: 'هل الدفع عند الاستلام متاح؟', a: 'نعم، الدفع يكون عند استلام المنتج في كل ولايات الجزائر. لا يُطلب منك أي دفع مسبق.' },
  { id: 'zones', q: 'ما مناطق التوصيل؟', a: 'نوصل لجميع الولايات الـ 48 في الجزائر. يستغرق التوصيل من 3 إلى 5 أيام عمل.' },
  { id: 'multi', q: 'هل يمكنني طلب أكثر من منتج؟', a: 'بالتأكيد! يمكنك إضافة عدة منتجات للسلة وتأكيد الطلب في عملية واحدة.' },
  { id: 'confirm', q: 'كيف أتأكد أن المنتج وصل؟', a: 'فريقنا سيتصل بك لتأكيد الطلب، وعند الشحن ستتلقى معلومات التتبع.' },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="bg-sand-gradient py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-3"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-kufi font-semibold"
              style={{ background: 'rgba(200,138,45,0.12)', color: 'var(--color-honey-gold)' }}
            >
              مختارة بعناية لك
            </span>
            <h1 className="font-kufi font-bold text-4xl md:text-5xl text-desert-olive">
              منتجات طبيعية مختارة
            </h1>
            <p className="font-plex text-lg text-charcoal-ink/60 max-w-lg mx-auto">
              من الشفاء — مستوحاة من حكمة الأجداد وعطاء الصحراء الجزائرية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter — sticky below header, horizontal scroll */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border-sand py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? 'primary' : 'ghost'}
                size="sm"
                className={cn(
                  'shrink-0 min-h-[40px] rounded-full font-kufi font-semibold touch-manipulation transition-all duration-200',
                  activeCategory === cat.value
                    ? 'bg-desert-olive text-cream shadow-card'
                    : 'text-charcoal-ink hover:bg-warm-sand/60'
                )}
                onPress={() => setActiveCategory(cat.value)}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-10 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Result count */}
          <p className="font-plex text-sm text-charcoal-ink/50 mb-6 text-right">
            {filtered.length} منتج
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="text-4xl">🌿</div>
              <p className="font-kufi font-semibold text-lg text-charcoal-ink/60">
                لا توجد منتجات في هذا التصنيف
              </p>
              <Button
                variant="outline"
                className="rounded-full font-kufi"
                onPress={() => setActiveCategory('all')}
              >
                عرض كل المنتجات
              </Button>
            </div>
          ) : (
            <motion.div
              key={activeCategory}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <TrustStrip />

      <FAQSection
        title="أسئلة عن التوصيل والطلبات"
        items={PRODUCTS_PAGE_FAQ}
      />
    </>
  );
}
