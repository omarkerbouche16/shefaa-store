'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { PRODUCTS } from '@/config/products';

interface FeaturedProductsProps {
  limit?: number;
  title?: string;
}

export default function FeaturedProducts({
  limit,
  title = 'منتجاتنا الطبيعية',
}: FeaturedProductsProps) {
  const products = limit ? PRODUCTS.slice(0, limit) : PRODUCTS;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span
            className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-kufi font-semibold"
            style={{ background: 'rgba(200,138,45,0.12)', color: 'var(--color-honey-gold)' }}
          >
            مختار بعناية
          </span>
          <h2 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive mb-2">
            {title}
          </h2>
          <p className="font-plex text-charcoal-ink/60 max-w-md mx-auto leading-relaxed">
            كل منتج مدروس، طبيعي، ومضمون — لأن صحتكِ تستحق الأفضل
          </p>
        </motion.div>

        {/* Products grid — 2 cols on mobile for thumb-friendly layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View all CTA */}
        {limit && PRODUCTS.length > limit && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 min-h-[48px] font-kufi font-bold rounded-full border-2 border-desert-olive text-desert-olive hover:bg-desert-olive hover:text-cream transition-colors duration-200"
            >
              عرض كل المنتجات ←
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
