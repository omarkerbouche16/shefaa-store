import type { Metadata } from 'next';
import { Noto_Kufi_Arabic, IBM_Plex_Sans_Arabic, Inter } from 'next/font/google';
import './globals.css';
import ClientShell from '@/components/common/ClientShell';
import PixelProvider from '@/components/tracking/PixelProvider';
import PageViewTracker from '@/components/tracking/PageViewTracker';
import { BRAND } from '@/config/brand';

const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-kufi',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-ibm-plex',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.nameArabic} — منتجات طبيعية جزائرية`,
    template: `%s | ${BRAND.nameArabic}`,
  },
  description:
    'الشفاء — متجر جزائري للمنتجات الطبيعية المختارة. علكات البيوتين، كولاجين بحري، زيت الأرغان، عسل بالمكسرات وأكثر. الدفع عند الاستلام في كل الجزائر.',
  keywords: ['منتجات طبيعية', 'جزائر', 'بيوتين', 'كولاجين', 'عسل', 'زيت الأرغان', 'الشفاء'],
  openGraph: {
    type: 'website',
    locale: 'ar_DZ',
    url: BRAND.siteUrl,
    siteName: BRAND.nameArabic,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${notoKufi.variable} ${ibmPlex.variable} ${inter.variable}`}
    >
      <body className="font-plex text-charcoal-ink bg-cream antialiased overflow-x-hidden" suppressHydrationWarning>
        <PixelProvider />
        <PageViewTracker />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
