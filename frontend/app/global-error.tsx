'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="ar" dir="rtl">
      <body style={{ background: '#FFF8EC', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</p>
          <h1 style={{ color: '#3F4A2F', marginBottom: '0.5rem' }}>حدث خطأ غير متوقع</h1>
          <p style={{ color: '#1F1A1680', marginBottom: '1.5rem' }}>يرجى تحديث الصفحة أو المحاولة لاحقاً.</p>
          <button
            onClick={reset}
            style={{ padding: '0.75rem 2rem', background: '#C88A2D', color: '#fff', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            تحديث
          </button>
        </div>
      </body>
    </html>
  );
}
