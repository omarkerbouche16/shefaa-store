'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ThankYouSummary from '@/components/checkout/ThankYouSummary';
import { BRAND } from '@/config/brand';

function ThankYouContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId') ?? undefined;
  const name = params.get('name') ?? undefined;
  const phone = params.get('phone') ?? undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-warm-sand/20 to-cream flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        <ThankYouSummary
          orderId={orderId}
          customerName={name}
          phone={phone}
        />

        {/* Next steps */}
        <div className="bg-white rounded-2xl border border-border-sand p-5 space-y-3">
          <h3 className="font-kufi font-bold text-base text-desert-olive">الخطوات التالية</h3>
          <ol className="space-y-2">
            {[
              'انتظري مكالمة من فريقنا لتأكيد الطلب',
              'سيتم شحن طلبك خلال 24-48 ساعة',
              'استلمي طلبك وادفعي عند وصوله',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-honey-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-inter text-[10px] font-bold text-honey-gold">{i + 1}</span>
                </span>
                <span className="font-plex text-sm text-charcoal-ink/70">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Support */}
        <div className="text-center space-y-3">
          <p className="font-plex text-sm text-charcoal-ink/50">
            أي استفسار؟ تواصلي معنا
          </p>
          <a
            href={`https://wa.me/${BRAND.whatsapp.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-success-green hover:bg-success-green/80 text-white font-kufi font-semibold text-sm rounded-full transition-colors"
          >
            واتساب
          </a>
        </div>

        {/* Back to shop */}
        <div className="text-center">
          <Link
            href="/products"
            className="font-plex text-sm text-honey-gold hover:text-desert-olive transition-colors underline"
          >
            تسوق منتجات أخرى ←
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-honey-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-kufi text-desert-olive">جاري التحميل...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
