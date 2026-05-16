'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureUTMFromURL } from '@/lib/utm';
import DeferredPixelScripts from './DeferredPixelScripts';

export default function PixelProvider() {
  const pathname = usePathname();

  useEffect(() => {
    captureUTMFromURL();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.fbq?.('track', 'PageView');
      window.ttq?.track('ViewContent');
      window.snaptr?.('track', 'PAGE_VIEW');
    }
  }, [pathname]);

  return <DeferredPixelScripts />;
}
