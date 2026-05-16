'use client';

import { notFound } from 'next/navigation';
import { useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getProductBySlug, getCrossSellProducts } from '@/config/products';
import { OFFER_PRICES } from '@/config/offers';
import { useCartStore, buildCartItem } from '@/store/cart-store';
import { debugCart } from '@/lib/debug-cart';
import { Button, toast } from '@heroui/react';
import ProductGallery from '@/components/product/ProductGallery';
import OfferSelector from '@/components/product/OfferSelector';
import ReviewCard from '@/components/product/ReviewCard';
import ProductFAQ from '@/components/product/ProductFAQ';
import StickyProductCTA from '@/components/product/StickyProductCTA';
import ProductCard from '@/components/product/ProductCard';
import TrustStrip from '@/components/sections/TrustStrip';
import { formatPrice } from '@/lib/money';
import type { OfferPieces } from '@/types/commerce';
import { StarIcon, CheckCircleIcon, TruckIcon, LeafIcon, ShieldCheckIcon, SparklesIcon } from '@/components/common/Icons';

const SEED_REVIEWS = [
  { name: 'آمنة ح.', wilaya: 'الجزائر العاصمة', rating: 5, text: 'منتج رائع، لاحظت فرقاً بعد أسبوعين. التوصيل سريع والتغليف أنيق.', date: 'أبريل 2026' },
  { name: 'مريم س.', wilaya: 'وهران', rating: 5, text: 'كنت متترددة بالبداية لكن الدفع عند الاستلام أراحني. المنتج ممتاز وسأعيد الطلب.', date: 'مارس 2026' },
  { name: 'إيناس ب.', wilaya: 'قسنطينة', rating: 4, text: 'المنتج جيد والمكونات طبيعية. الطلب وصل في 4 أيام وخدمة الزبائن ممتازة.', date: 'مارس 2026' },
  { name: 'هدى ر.', wilaya: 'سطيف', rating: 5, text: 'أجمل ما في المنتج أنه طبيعي بالكامل. جربته لشهر والنتيجة تشجع على الاستمرار.', date: 'فبراير 2026' },
];

const PRODUCT_FAQS = [
  { question: 'متى أرى نتائج؟', answer: 'النتائج تختلف من شخص لآخر. عموماً يُنصح بالاستمرار لمدة 4-8 أسابيع للحصول على أفضل النتائج.' },
  { question: 'هل المنتج آمن؟', answer: 'نعم، مكوناتنا طبيعية مختارة بعناية. نقدمه كمكمل غذائي طبيعي. ننصح باستشارة الطبيب في حالة الحمل أو الرضاعة.' },
  { question: 'كيف يتم التوصيل والدفع؟', answer: 'التوصيل لكل ولايات الجزائر خلال 3-5 أيام. الدفع عند الاستلام فقط، لا دفع مسبق.' },
  { question: 'هل يمكن الإرجاع؟', answer: 'إذا وصلك المنتج تالفاً أو مختلفاً عن الطلب، تواصلي معنا خلال 48 ساعة وسنحل المشكلة.' },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const productData = getProductBySlug(slug);

  if (!productData) {
    notFound();
  }

  // notFound() throws, so productData is defined here
  const product = productData!;

  const [selectedPieces, setSelectedPieces] = useState<OfferPieces>(product.defaultOffer);
  const [selectedPrice, setSelectedPrice] = useState(OFFER_PRICES[product.defaultOffer]);

  const { addItem, openCart } = useCartStore();
  const crossSells = getCrossSellProducts(product.id).slice(0, 2);

  function handleOfferSelect(pieces: OfferPieces, price: number) {
    setSelectedPieces(pieces);
    setSelectedPrice(price);
  }

  function handleAddToCart() {
    debugCart('ProductPage', 'main CTA add to cart', {
      productId: product.id,
      pieces: selectedPieces,
    });
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
    toast.success('أُضيف للسلة بنجاح!', {
      description: `${product.arabicName} — ${selectedPieces} قطع`,
      timeout: 2500,
    });
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-plex text-charcoal-ink/50 mb-6">
          <Link href="/" className="hover:text-honey-gold transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-honey-gold transition-colors">المنتجات</Link>
          <span>/</span>
          <span className="text-charcoal-ink">{product.arabicName}</span>
        </nav>

        {/* Main product section */}
        <div id="product-heading" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery
              productName={product.arabicName}
              category={product.category}
            />
          </motion.div>

          {/* Product info */}
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Scarcity */}
            <div className="inline-flex items-center gap-1.5 bg-error-red/10 text-error-red text-xs font-plex font-semibold px-3 py-1 rounded-full">
              <SparklesIcon className="w-3.5 h-3.5" /> {product.scarcity}
            </div>

            {/* Name & headline */}
            <div>
              <h1 className="font-kufi font-bold text-2xl md:text-3xl text-desert-olive leading-tight">
                {product.arabicName}
              </h1>
              <p className="mt-2 font-plex text-charcoal-ink/70 leading-relaxed">
                {product.subheadline}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5" dir="ltr">
                {[1,2,3,4,5].map((s) => (
                  <StarIcon key={s} className="w-4 h-4 text-honey-gold" />
                ))}
              </div>
              <span className="font-inter text-sm font-semibold text-charcoal-ink">
                {product.rating}
              </span>
              <span className="font-plex text-sm text-charcoal-ink/50">
                ({product.reviewCount} تقييم)
              </span>
            </div>

            {/* Offer selector */}
            <OfferSelector
              defaultOffer={product.defaultOffer}
              onSelect={handleOfferSelect}
              productPrices={product.prices}
            />

            {/* Price display */}
            <div className="flex items-baseline gap-2">
              <span className="font-kufi font-bold text-3xl text-honey-gold">
                {formatPrice(selectedPrice)}
              </span>
              <span className="font-plex text-sm text-charcoal-ink/50">
                / {selectedPieces} {selectedPieces === 1 ? 'قطعة' : 'قطع'}
              </span>
            </div>

            {/* CTA */}
            <Button
              fullWidth
              onPress={handleAddToCart}
              className="min-h-[52px] bg-desert-olive hover:bg-palm-green text-cream font-kufi font-bold text-lg rounded-full shadow-warm touch-manipulation"
            >
              أضف العرض للسلة ←
            </Button>

            {/* Trust mini row */}
            <div className="flex flex-wrap gap-3 pt-1">
              {[
                { icon: <CheckCircleIcon className="w-4 h-4 text-success-green" />, text: 'دفع عند الاستلام' },
                { icon: <TruckIcon className="w-4 h-4 text-desert-olive" />, text: 'كل الجزائر' },
                { icon: <LeafIcon className="w-4 h-4 text-palm-green" />, text: 'طبيعي 100%' },
              ].map((item) => (
                <span key={item.text} className="inline-flex items-center gap-1 text-xs font-plex text-charcoal-ink/60">
                  {item.icon}
                  {item.text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Details sections */}
        <div className="mt-14 space-y-20">
          {/* Section 1: The Pain (Text Right, Image Left) */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 aspect-square bg-warm-sand/40 rounded-2xl overflow-hidden relative border border-border-sand">
              <div className="absolute inset-0 flex items-center justify-center text-charcoal-ink/20">
                <span className="text-4xl font-kufi">صورة توضيحية (اليسار)</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <span className="inline-block bg-warning-amber/10 text-warning-amber text-xs font-kufi font-semibold px-3 py-1 rounded-full">
                تأثير مناخنا القاسي
              </span>
              <h2 className="font-kufi font-bold text-2xl md:text-3xl text-desert-olive leading-tight">
                هل تعانين من الجفاف والتعب المستمر؟
              </h2>
              <p className="font-plex text-charcoal-ink/70 leading-relaxed text-sm md:text-base">
                في الجزائر، شمسنا القوية ومناخنا المتغير، إلى جانب ضغوطات الحياة اليومية، يتركون أثراً واضحاً على بشرتك وشعرك. أغلب المنتجات التجارية المستوردة لا تلائم طبيعة مناخنا الصحراوي والجاف، مما يجعلك تبحثين عن حل حقيقي يعالج المشكلة من الداخل.
              </p>
              <ul className="space-y-3 mt-4">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-honey-gold/20 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-honey-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-plex text-sm md:text-base text-charcoal-ink/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 2: The Solution / Science (Text Left, Image Right) */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="w-full md:w-1/2 aspect-square bg-palm-green/10 rounded-2xl overflow-hidden relative border border-palm-green/20">
              <div className="absolute inset-0 flex items-center justify-center text-palm-green/30">
                <span className="text-4xl font-kufi">صورة توضيحية (اليمين)</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <span className="inline-block bg-palm-green/10 text-palm-green text-xs font-kufi font-semibold px-3 py-1 rounded-full">
                دليل علمي و طبيعي
              </span>
              <h2 className="font-kufi font-bold text-2xl md:text-3xl text-desert-olive leading-tight">
                تركيبة معتمدة، من قلب الطبيعة
              </h2>
              <p className="font-plex text-charcoal-ink/70 leading-relaxed text-sm md:text-base">
                اكتشف خبراؤنا أن دمج المكونات الطبيعية النقية يضاعف الفعالية، استناداً إلى أبحاث علمية وحكمة أجدادنا. كل مكون نختاره يخضع لمعايير صارمة لضمان أعلى درجات الامتصاص والنتائج لبشرتك وشعرك.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {product.ingredients.map((ing) => (
                  <div key={ing} className="bg-white border border-border-sand p-3 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                    <LeafIcon className="w-5 h-5 text-palm-green" />
                    <span className="font-kufi font-bold text-xs text-desert-olive">{ing}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: 30 Days Warranty & How to use */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-honey-gold/20 to-warning-amber/10 rounded-2xl border border-honey-gold/30 flex flex-col justify-center items-center text-center shadow-warm">
              <ShieldCheckIcon className="w-12 h-12 text-honey-gold mb-4" />
              <h3 className="font-kufi font-bold text-2xl text-desert-olive mb-3">ضمان ذهبي 30 يوماً</h3>
              <p className="font-plex text-sm md:text-base text-charcoal-ink/80 leading-relaxed">
                نحن واثقون من جودة منتجاتنا. إذا لم تلاحظي أي فرق خلال 30 يوماً من الاستخدام المنتظم، تواصلي معنا وسنقوم بإرجاع مبلغك بالكامل. راحتك وثقتك هي أولويتنا. بدون أي تعقيدات.
              </p>
            </div>
            <div className="w-full md:w-1/2 p-8 bg-cream rounded-2xl border border-border-sand flex flex-col justify-center shadow-sm">
              <h3 className="font-kufi font-bold text-2xl text-desert-olive mb-4 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-honey-gold" /> طريقة الاستخدام
              </h3>
              <p className="font-plex text-charcoal-ink/80 leading-relaxed mb-6 text-sm md:text-base">
                {product.howToUse}
              </p>
              <div className="p-4 bg-error-red/5 border border-error-red/10 rounded-xl mt-auto">
                <p className="font-plex text-xs text-error-red/80 leading-relaxed">
                  ملاحظة: {product.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TrustStrip */}
        <div className="mt-10">
          <TrustStrip compact />
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="font-kufi font-bold text-2xl text-desert-olive mb-6">
            آراء العملاء ({product.reviewCount})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEED_REVIEWS.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="font-kufi font-bold text-2xl text-desert-olive mb-6">
            أسئلة شائعة
          </h2>
          <ProductFAQ items={PRODUCT_FAQS} />
        </div>

        {/* Related products */}
        {crossSells.length > 0 && (
          <div className="mt-14 bg-white p-6 md:p-8 rounded-3xl border border-border-sand shadow-card">
            <div className="text-center mb-8">
              <span className="inline-block bg-desert-olive/10 text-desert-olive text-xs font-kufi font-semibold px-3 py-1 rounded-full mb-3">
                روتين متكامل
              </span>
              <h2 className="font-kufi font-bold text-2xl md:text-3xl text-desert-olive mb-2">
                يكملون بعض لنتائج أسرع
              </h2>
              <p className="font-plex text-charcoal-ink/60 text-sm md:text-base max-w-lg mx-auto">
                استخدام هذا المنتج مع المنتجات التالية يضاعف الفعالية ويمنحك روتيناً طبيعياً متكاملاً.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crossSells.map((related) => (
                <ProductCard key={related.id} product={related} hideOfferSelector />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA (Desktop & Mobile) */}
      <StickyProductCTA
        productName={product.arabicName}
        selectedPieces={selectedPieces}
        selectedPrice={selectedPrice}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
