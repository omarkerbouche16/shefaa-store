'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="text-6xl">⚠️</div>
        <div className="space-y-2">
          <h1 className="font-kufi font-bold text-2xl text-desert-olive">
            حدث خطأ ما
          </h1>
          <p className="font-plex text-charcoal-ink/60 text-base leading-relaxed">
            واجهنا مشكلة تقنية. يرجى المحاولة مجدداً أو العودة للرئيسية.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-honey-gold hover:bg-desert-olive text-white font-kufi font-bold rounded-full transition-colors duration-200"
          >
            حاول مجدداً
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-desert-olive text-desert-olive hover:bg-desert-olive hover:text-cream font-kufi font-bold rounded-full transition-colors duration-200"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
