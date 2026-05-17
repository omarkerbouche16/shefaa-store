'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button, toast } from '@heroui/react';
import { useCartStore, buildCartItem } from '@/store/cart-store';
import { getCrossSellProducts } from '@/config/products';
import { OFFER_PRICES } from '@/config/offers';
import { debugCart } from '@/lib/debug-cart';
import { formatPrice } from '@/lib/money';
import type { Product, OfferPieces } from '@/types/commerce';

import ProductGallery from '@/components/product/ProductGallery';
import OfferSelector from '@/components/product/OfferSelector';
import StickyProductCTA from '@/components/product/StickyProductCTA';
import ProductFAQ from '@/components/product/ProductFAQ';
import ProductCard from '@/components/product/ProductCard';
import ProductReviews from '@/components/product/ProductReviews';
import HowItWorks from '@/components/sections/HowItWorks';
import {
  StarIcon, ShieldCheckIcon, TruckIcon, CheckCircleIcon,
  LeafIcon, SparklesIcon, FlaskIcon, ClockIcon,
} from '@/components/common/Icons';

/* ─── Seed data ─────────────────────────────────────────────────────────── */

const SEED_REVIEWS = [
  { name: 'آمنة ح.', wilaya: 'الجزائر العاصمة', rating: 5, text: 'منتج رائع جداً، لاحظت فرقاً واضحاً بعد أسبوعين فقط. التوصيل سريع والتغليف أنيق ومحترف.', date: 'أبريل 2026' },
  { name: 'مريم س.', wilaya: 'وهران', rating: 5, text: 'كنت مترددة في البداية لكن الدفع عند الاستلام أراحني كثيراً. المنتج ممتاز وسأعيد الطلب بالتأكيد.', date: 'مارس 2026' },
  { name: 'إيناس ب.', wilaya: 'قسنطينة', rating: 4, text: 'المنتج جيد جداً والمكونات طبيعية. الطلب وصل في 4 أيام وخدمة الزبائن ممتازة وسريعة الرد.', date: 'مارس 2026' },
  { name: 'هدى ر.', wilaya: 'سطيف', rating: 5, text: 'أجمل ما في المنتج أنه طبيعي بالكامل وبدون مواد حافظة. جربته لشهر كامل والنتيجة تشجع على الاستمرار.', date: 'فبراير 2026' },
];

const PRODUCT_FAQS = [
  { question: 'متى أرى النتائج؟', answer: 'النتائج تختلف من شخص لآخر. عموماً يُنصح بالاستمرار لمدة 4-8 أسابيع للحصول على أفضل النتائج. كثير من عملائنا يلاحظون فرقاً في الأسابيع الأولى.' },
  { question: 'هل المنتج آمن للاستخدام؟', answer: 'نعم، مكوناتنا طبيعية 100% مختارة بعناية فائقة. نقدمه كمكمل غذائي طبيعي. ننصح باستشارة الطبيب في حالة الحمل أو الرضاعة أو أخذ أدوية معينة.' },
  { question: 'كيف يتم التوصيل والدفع؟', answer: 'التوصيل لكل ولايات الجزائر الـ58 خلال 3-5 أيام عمل. الدفع عند الاستلام فقط — لا تدفع أي شيء مسبقاً.' },
  { question: 'هل يمكن الإرجاع أو الاسترداد؟', answer: 'نعم. إذا وصلك المنتج تالفاً أو مختلفاً عن طلبك، تواصلي معنا خلال 48 ساعة وسنحل المشكلة فوراً. نضمن رضاك بشكل كامل.' },
  { question: 'كم قطعة أحتاج لكورس كامل؟', answer: 'يُنصح عادةً بعبوة واحدة للتجربة الأولى. للحصول على نتائج أفضل وتوفير أكبر، اختاري عرض 2 أو 3 قطع.' },
];

const TRUST_BADGES = [
  { icon: '💵', title: 'دفع عند الاستلام', sub: 'لا دفع مسبق' },
  { icon: '🌿', title: 'طبيعي 100%', sub: 'بدون مواد ضارة' },
  { icon: '🚚', title: 'توصيل سريع', sub: 'كل ولايات الجزائر' },
  { icon: '🛡️', title: 'ضمان 30 يوم', sub: 'أو استرداد كامل' },
];

/* ─── Sub-sections ───────────────────────────────────────────────────────── */

function TrustRow() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {TRUST_BADGES.map((b) => (
        <div
          key={b.title}
          className="flex flex-col items-center text-center gap-1 p-3 bg-white rounded-xl border border-border-sand shadow-card"
        >
          <span className="text-2xl">{b.icon}</span>
          <p className="font-kufi font-bold text-xs text-desert-olive">{b.title}</p>
          <p className="font-plex text-[10px] text-charcoal-ink/50">{b.sub}</p>
        </div>
      ))}
    </div>
  );
}

function BenefitsSection({ benefits }: { benefits: string[] }) {
  const icons = ['✨', '💪', '🌱', '⚡', '❤️'];
  return (
    <section>
      <div className="text-center mb-6">
        <span className="inline-block bg-palm-green/10 text-palm-green text-xs font-kufi font-semibold px-3 py-1 rounded-full mb-2">
          لماذا تختارينه؟
        </span>
        <h2 className="font-kufi font-bold text-2xl text-desert-olive">
          فوائد حقيقية تشعرين بها
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {benefits.map((benefit, i) => (
          <motion.div
            key={benefit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-border-sand shadow-card hover:shadow-warm hover:border-honey-gold/30 transition-all duration-200"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-honey-gold/10 flex items-center justify-center text-xl">
              {icons[i % icons.length]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-kufi font-semibold text-sm text-desert-olive leading-snug">{benefit}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function StorytellingSection({ product }: { product: Product }) {
  return (
    <div className="space-y-12">
      {/* The Problem */}
      <motion.div
        className="flex flex-col lg:flex-row gap-8 items-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full lg:w-2/5 aspect-square bg-gradient-to-br from-warning-amber/20 to-honey-gold/10 rounded-3xl flex items-center justify-center border border-honey-gold/20 shrink-0">
          <div className="text-center space-y-3 px-6">
            <span className="text-6xl">😔</span>
            <p className="font-kufi font-bold text-xl text-desert-olive">هل تعانين من هذا؟</p>
            <p className="font-plex text-sm text-charcoal-ink/60 leading-relaxed">
              شمس الجزائر القوية، مناخنا الجاف، وضغوطات الحياة...
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <span className="inline-block bg-warning-amber/10 text-warning-amber text-xs font-kufi font-semibold px-3 py-1 rounded-full">
            المشكلة
          </span>
          <h2 className="font-kufi font-bold text-2xl text-desert-olive leading-tight">
            المنتجات التجارية لا تناسب مناخنا الجزائري
          </h2>
          <p className="font-plex text-charcoal-ink/70 leading-relaxed">
            أغلب المنتجات المستوردة مصممة لمناخات مختلفة تماماً. في الجزائر، نواجه شمساً حارقة، جفافاً، ورياحاً تأخذ بشرتك وشعرك إلى الإرهاق — بينما تبقى هذه المنتجات عاجزة عن المساعدة.
          </p>
          <ul className="space-y-2">
            {['نتائج بطيئة أو منعدمة', 'مكونات صناعية مجهولة المصدر', 'أسعار مرتفعة لا تستحق', 'لا تناسب البشرة العربية'].map((pain) => (
              <li key={pain} className="flex items-center gap-2">
                <span className="text-error-red text-base">✗</span>
                <span className="font-plex text-sm text-charcoal-ink/70">{pain}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* The Solution */}
      <motion.div
        className="flex flex-col lg:flex-row-reverse gap-8 items-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full lg:w-2/5 aspect-square bg-gradient-to-br from-palm-green/20 to-desert-olive/10 rounded-3xl flex items-center justify-center border border-palm-green/20 shrink-0">
          <div className="text-center space-y-3 px-6">
            <span className="text-6xl">🌿</span>
            <p className="font-kufi font-bold text-xl text-desert-olive">الحل الطبيعي</p>
            <p className="font-plex text-sm text-charcoal-ink/60 leading-relaxed">
              مكونات طبيعية اختبرها أجدادنا لقرون
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <span className="inline-block bg-palm-green/10 text-palm-green text-xs font-kufi font-semibold px-3 py-1 rounded-full">
            الحل
          </span>
          <h2 className="font-kufi font-bold text-2xl text-desert-olive leading-tight">
            {product.arabicName} — تركيبة طبيعية لنتائج حقيقية
          </h2>
          <p className="font-plex text-charcoal-ink/70 leading-relaxed">
            {product.subheadline}
          </p>
          <ul className="space-y-2">
            {product.benefits.slice(0, 4).map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-success-green/15 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-success-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="font-plex text-sm text-charcoal-ink/80">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

function IngredientsSection({ ingredients }: { ingredients: string[] }) {
  const ingredientDetails: Record<string, { emoji: string; origin: string }> = {
    'بيوتين': { emoji: '🧬', origin: 'مستخرج طبيعي' },
    'فيتامين C': { emoji: '🍊', origin: 'مضاد أكسدة قوي' },
    'زنك': { emoji: '⚡', origin: 'معدن أساسي' },
    'كولاجين بحري': { emoji: '🌊', origin: 'من أعماق البحر' },
    'حمض الهيالورونيك': { emoji: '💧', origin: 'ترطيب عميق' },
    'زبدة الشيا الخام': { emoji: '🧈', origin: 'أفريقيا الغربية' },
    'زيت الأرغان الخالص': { emoji: '✨', origin: 'المغرب العربي' },
    'عسل طبيعي': { emoji: '🍯', origin: 'مناحل طبيعية' },
    'مستخلص أشواغاندا': { emoji: '🌿', origin: 'الهند القديمة' },
    'جذور مجففة طبيعية': { emoji: '🌱', origin: 'مجففة طبيعياً' },
  };

  return (
    <section>
      <div className="text-center mb-6">
        <span className="inline-block bg-desert-olive/10 text-desert-olive text-xs font-kufi font-semibold px-3 py-1 rounded-full mb-2">
          ما يجعله فريداً
        </span>
        <h2 className="font-kufi font-bold text-2xl text-desert-olive">
          مكونات مختارة بعناية فائقة
        </h2>
        <p className="mt-2 font-plex text-sm text-charcoal-ink/60 max-w-md mx-auto">
          كل مكون يخضع لمعايير صارمة للتأكد من نقاوته وفعاليته قبل وصوله إليك
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ingredients.map((ing, i) => {
          const detail = ingredientDetails[ing] ?? { emoji: '🌿', origin: 'طبيعي 100%' };
          return (
            <motion.div
              key={ing}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-2xl border border-border-sand shadow-card hover:border-honey-gold/40 hover:shadow-warm transition-all duration-200"
            >
              <span className="text-3xl">{detail.emoji}</span>
              <p className="font-kufi font-bold text-sm text-desert-olive leading-snug">{ing}</p>
              <span className="inline-block bg-warm-sand/60 text-charcoal-ink/60 text-[10px] font-plex px-2 py-0.5 rounded-full">
                {detail.origin}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Quality promise */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {[
          { icon: <FlaskIcon className="w-4 h-4" />, text: 'مُختبر للجودة' },
          { icon: <LeafIcon className="w-4 h-4" />, text: 'طبيعي 100%' },
          { icon: <ShieldCheckIcon className="w-4 h-4" />, text: 'بدون مواد حافظة' },
        ].map((item) => (
          <span key={item.text} className="inline-flex items-center gap-1.5 bg-white border border-border-sand text-charcoal-ink/70 text-xs font-plex px-3 py-1.5 rounded-full shadow-sm">
            <span className="text-palm-green">{item.icon}</span>
            {item.text}
          </span>
        ))}
      </div>
    </section>
  );
}

function HowToUseSection({ steps, disclaimer }: { steps: string; disclaimer: string }) {
  const stepList = steps.split('. ').filter(Boolean).map((s) => s.replace(/\.$/, ''));

  return (
    <section>
      <div className="text-center mb-6">
        <span className="inline-block bg-honey-gold/10 text-honey-gold text-xs font-kufi font-semibold px-3 py-1 rounded-full mb-2">
          بسيط وسهل
        </span>
        <h2 className="font-kufi font-bold text-2xl text-desert-olive">طريقة الاستخدام</h2>
      </div>

      <div className="space-y-3">
        {stepList.length > 1 ? (
          stepList.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-border-sand shadow-card"
            >
              <div className="w-9 h-9 shrink-0 rounded-full bg-honey-gold flex items-center justify-center shadow-warm">
                <span className="font-inter font-bold text-sm text-white">{i + 1}</span>
              </div>
              <p className="font-plex text-sm text-charcoal-ink/80 leading-relaxed flex-1 pt-1">
                {step}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-border-sand shadow-card">
            <div className="w-10 h-10 shrink-0 rounded-full bg-honey-gold/15 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-honey-gold" />
            </div>
            <p className="font-plex text-sm text-charcoal-ink/80 leading-relaxed flex-1 pt-1">
              {steps}
            </p>
          </div>
        )}
      </div>

      {/* Timing tip */}
      <div className="mt-3 flex items-start gap-3 p-4 bg-desert-olive/5 rounded-2xl border border-desert-olive/10">
        <ClockIcon className="w-5 h-5 text-desert-olive shrink-0 mt-0.5" />
        <p className="font-plex text-xs text-charcoal-ink/70 leading-relaxed flex-1">
          {disclaimer}
        </p>
      </div>
    </section>
  );
}

function GuaranteeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-honey-gold/20 via-warning-amber/10 to-cream border border-honey-gold/30 shadow-warm"
    >
      {/* Decorative circle */}
      <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-honey-gold/10 pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-warning-amber/10 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
        <div className="shrink-0 flex flex-col items-center gap-1">
          <div className="w-20 h-20 rounded-full bg-white shadow-warm flex items-center justify-center">
            <ShieldCheckIcon className="w-10 h-10 text-honey-gold" />
          </div>
          <span className="font-inter font-bold text-2xl text-honey-gold">30</span>
          <span className="font-kufi text-xs text-desert-olive font-semibold">يوم ضمان</span>
        </div>
        <div className="flex-1 text-center sm:text-right space-y-2">
          <h3 className="font-kufi font-bold text-xl text-desert-olive">
            الضمان الذهبي — راحة بالك مضمونة
          </h3>
          <p className="font-plex text-sm text-charcoal-ink/70 leading-relaxed">
            نحن واثقون من جودة منتجاتنا. جربيه لمدة 30 يوماً كاملة — إذا لم تلاحظي أي فرق، تواصلي معنا وسنسترجع مبلغك بالكامل. بدون تعقيدات، بدون أسئلة.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
            {['استرداد كامل', 'بدون شروط', 'خلال 48 ساعة'].map((item) => (
              <span key={item} className="inline-flex items-center gap-1 bg-white/80 text-desert-olive text-[11px] font-kufi font-semibold px-2.5 py-1 rounded-full border border-honey-gold/20">
                <CheckCircleIcon className="w-3 h-3 text-success-green" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function ProductPageContent({ product }: { product: Product }) {
  const [selectedPieces, setSelectedPieces] = useState<OfferPieces>(product.defaultOffer);
  const [selectedPrice, setSelectedPrice] = useState(OFFER_PRICES[product.defaultOffer]);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const { addItem, openCart } = useCartStore();
  const crossSells = getCrossSellProducts(product.id).slice(0, 3);

  function handleOfferSelect(pieces: OfferPieces, price: number) {
    setSelectedPieces(pieces);
    setSelectedPrice(price);
  }

  function handleAddToCart() {
    debugCart('ProductPage', 'add to cart', { productId: product.id, pieces: selectedPieces });
    addItem(
      buildCartItem(
        product.id,
        product.slug,
        product.arabicName,
        selectedPieces,
        selectedPrice,
        'product_page'
      )
    );
    openCart();
    toast.success('أُضيف للسلة بنجاح! 🛒', {
      description: `${product.arabicName} — ${selectedPieces} ${selectedPieces === 1 ? 'قطعة' : 'قطع'}`,
      timeout: 2500,
    });
  }

  const savingsVsSingle = product.prices[1] * selectedPieces - selectedPrice;

  return (
    <>
      {/* ── 1. Breadcrumb ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <nav className="flex items-center gap-2 text-xs font-plex text-charcoal-ink/50" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-honey-gold transition-colors">الرئيسية</Link>
          <span aria-hidden>/</span>
          <Link href="/products" className="hover:text-honey-gold transition-colors">المنتجات</Link>
          <span aria-hidden>/</span>
          <span className="text-charcoal-ink font-medium truncate max-w-[160px]">{product.arabicName}</span>
        </nav>
      </div>

      {/* ── 2. Hero: Gallery + Info ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery
              productName={product.arabicName}
              category={product.category}
              scarcity={product.scarcity}
            />
          </motion.div>

          {/* Product info */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Category tag */}
            <span className="inline-block bg-warm-sand text-desert-olive/70 text-[11px] font-plex font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              {product.category}
            </span>

            {/* Product name */}
            <div>
              <h1 className="font-kufi font-bold text-2xl sm:text-3xl text-desert-olive leading-tight">
                {product.arabicName}
              </h1>
              <p className="mt-2 font-plex text-charcoal-ink/65 leading-relaxed text-sm sm:text-base">
                {product.subheadline}
              </p>
            </div>

            {/* Rating + social proof */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="flex items-center gap-1.5 group"
                aria-label="انتقل للتقييمات"
              >
                <div className="flex gap-0.5" dir="ltr">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      className="w-4 h-4 text-honey-gold"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="font-inter text-sm font-bold text-charcoal-ink group-hover:text-honey-gold transition-colors">
                  {product.rating}
                </span>
                <span className="font-plex text-sm text-charcoal-ink/50 underline underline-offset-2 group-hover:text-honey-gold transition-colors">
                  ({product.reviewCount} تقييم)
                </span>
              </button>

              {/* Social proof live counter */}
              <span className="inline-flex items-center gap-1 bg-success-green/10 text-success-green text-xs font-plex font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success-green animate-pulse" />
                اشترتها 23 سيدة هذا الأسبوع
              </span>
            </div>

            {/* Price display */}
            <div className="flex items-baseline gap-2">
              <span className="font-kufi font-bold text-3xl sm:text-4xl text-honey-gold">
                {formatPrice(selectedPrice)}
              </span>
              <span className="font-plex text-sm text-charcoal-ink/50">
                / {selectedPieces} {selectedPieces === 1 ? 'قطعة' : 'قطع'}
              </span>
              {savingsVsSingle > 0 && (
                <span className="inline-block bg-success-green/15 text-success-green text-xs font-plex font-semibold px-2 py-0.5 rounded-full">
                  وفري {formatPrice(savingsVsSingle)}
                </span>
              )}
            </div>

            {/* Offer selector */}
            <OfferSelector
              defaultOffer={product.defaultOffer}
              onSelect={handleOfferSelect}
              productPrices={product.prices}
            />

            {/* Main CTA */}
            <div className="space-y-2.5">
              <Button
                fullWidth
                onPress={handleAddToCart}
                className="min-h-[56px] bg-honey-gold hover:bg-desert-olive text-white font-kufi font-bold text-lg rounded-2xl shadow-warm touch-manipulation transition-colors duration-200"
              >
                <TruckIcon className="w-5 h-5" />
                أضف للسلة — الدفع عند الاستلام
              </Button>

              {/* Risk reversal */}
              <p className="text-center font-plex text-xs text-charcoal-ink/50">
                🔒 ضمان 30 يوم · لا دفع مسبق · إرجاع مجاني
              </p>
            </div>

            {/* Inline trust icons */}
            <div className="flex items-center gap-3 flex-wrap pt-1 border-t border-border-sand/50">
              {[
                { icon: <CheckCircleIcon className="w-4 h-4 text-success-green" />, text: 'دفع عند الاستلام' },
                { icon: <TruckIcon className="w-4 h-4 text-desert-olive" />, text: 'كل الجزائر' },
                { icon: <LeafIcon className="w-4 h-4 text-palm-green" />, text: 'طبيعي 100%' },
                { icon: <ShieldCheckIcon className="w-4 h-4 text-honey-gold" />, text: 'ضمان 30 يوم' },
              ].map((item) => (
                <span key={item.text} className="inline-flex items-center gap-1 text-xs font-plex text-charcoal-ink/60">
                  {item.icon} {item.text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── 3. Trust strip ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <TrustRow />
      </div>

      {/* ── 4. Benefits ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-14">
        <BenefitsSection benefits={product.benefits} />
      </div>

      {/* ── 5. Storytelling (Problem + Solution) ───────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <StorytellingSection product={product} />
      </div>

      {/* ── 6. Ingredients ─────────────────────────────────────────── */}
      <div className="mt-16 bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <IngredientsSection ingredients={product.ingredients} />
        </div>
      </div>

      {/* ── 7. How to Use ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-14">
        <HowToUseSection steps={product.howToUse} disclaimer={product.disclaimer} />
      </div>

      {/* ── 8. 30-day Guarantee ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <GuaranteeCard />
      </div>

      {/* ── 9. Mid-page CTA ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="bg-gradient-to-r from-desert-olive to-palm-green rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <p className="font-kufi font-bold text-xl text-cream">
            {product.scarcity} — لا تفوتيه!
          </p>
          <p className="font-plex text-cream/75 text-sm">
            اختاري عرضك الآن والدفع عند الاستلام
          </p>
          <Button
            onPress={handleAddToCart}
            className="min-h-[50px] px-8 bg-honey-gold hover:bg-warm-sand hover:text-desert-olive text-white font-kufi font-bold text-base rounded-full shadow-warm touch-manipulation"
          >
            أضف للسلة الآن ←
          </Button>
        </div>
      </div>

      {/* ── 10. How It Works ───────────────────────────────────────── */}
      <HowItWorks />

      {/* ── 11. Reviews ────────────────────────────────────────────── */}
      <div ref={reviewsRef} className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 scroll-mt-6">
        <ProductReviews
          reviews={SEED_REVIEWS}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </div>

      {/* ── 12. FAQ ────────────────────────────────────────────────── */}
      <div className="mt-14 bg-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="inline-block bg-warm-sand text-desert-olive/70 text-xs font-kufi font-semibold px-3 py-1 rounded-full mb-2">
              أسئلة شائعة
            </span>
            <h2 className="font-kufi font-bold text-2xl text-desert-olive">كل ما تريدين معرفته</h2>
          </div>
          <ProductFAQ items={PRODUCT_FAQS} />
        </div>
      </div>

      {/* ── 13. Related products ───────────────────────────────────── */}
      {crossSells.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-14 mb-4">
          <div className="bg-cream rounded-3xl border border-border-sand p-6 sm:p-8 shadow-card">
            <div className="text-center mb-8">
              <span className="inline-block bg-desert-olive/10 text-desert-olive text-xs font-kufi font-semibold px-3 py-1 rounded-full mb-2">
                روتين متكامل
              </span>
              <h2 className="font-kufi font-bold text-2xl text-desert-olive">
                يكملون بعض لنتائج أسرع
              </h2>
              <p className="mt-2 font-plex text-charcoal-ink/60 text-sm max-w-md mx-auto">
                دمجها مع هذه المنتجات يضاعف الفعالية
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {crossSells.map((related) => (
                <ProductCard key={related.id} product={related} hideOfferSelector />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacer for sticky CTA */}
      <div className="h-32" aria-hidden />

      {/* ── 13. Sticky CTA ─────────────────────────────────────────── */}
      <StickyProductCTA
        productName={product.arabicName}
        selectedPieces={selectedPieces}
        selectedPrice={selectedPrice}
        rating={product.rating}
        reviewCount={product.reviewCount}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
