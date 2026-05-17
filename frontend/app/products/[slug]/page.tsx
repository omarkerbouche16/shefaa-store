import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/config/products';
import { BRAND } from '@/config/brand';
import ProductPageContent from '@/components/product/ProductPageContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* ─── SEO metadata ───────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'منتج غير موجود' };

  const title = `${product.arabicName} — ${BRAND.nameArabic}`;
  const description = product.subheadline;
  const url = `${BRAND.siteUrl}/products/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: BRAND.nameArabic,
      locale: 'ar_DZ',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  /* Product structured data (JSON-LD) */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.arabicName,
    description: product.subheadline,
    url: `${BRAND.siteUrl}/products/${slug}`,
    brand: {
      '@type': 'Brand',
      name: BRAND.nameArabic,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'DZD',
      price: product.prices[1],
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
      },
      seller: {
        '@type': 'Organization',
        name: BRAND.nameArabic,
        url: BRAND.siteUrl,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageContent product={product} />
    </>
  );
}
