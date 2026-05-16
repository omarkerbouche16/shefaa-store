import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة | الشفاء',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="text-7xl font-kufi font-black text-border-sand select-none">
          404
        </div>
        <div className="space-y-2">
          <h1 className="font-kufi font-bold text-2xl text-desert-olive">
            الصفحة غير موجودة
          </h1>
          <p className="font-plex text-charcoal-ink/60 text-base leading-relaxed">
            الرابط الذي زرته غير موجود أو تم نقله. تصفح منتجاتنا الطبيعية.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-honey-gold hover:bg-desert-olive text-white font-kufi font-bold rounded-full transition-colors duration-200"
          >
            العودة للرئيسية
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 border-2 border-desert-olive text-desert-olive hover:bg-desert-olive hover:text-cream font-kufi font-bold rounded-full transition-colors duration-200"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
