import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import TrustStrip from '@/components/sections/TrustStrip';
import StorySection from '@/components/sections/StorySection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import IngredientAuthority from '@/components/sections/IngredientAuthority';
import OfferBanner from '@/components/sections/OfferBanner';
import Testimonials from '@/components/sections/Testimonials';
import FAQSection from '@/components/sections/FAQSection';
import FinalCTA from '@/components/sections/FinalCTA';
import HowItWorks from '@/components/sections/HowItWorks';

export const metadata: Metadata = {
  title: 'الشفاء — منتجات طبيعية جزائرية | نقاوة الصحراء، حكمة الأجداد',
  description:
    'تسوقي أفضل المنتجات الطبيعية الجزائرية: بيوتين، كولاجين، زيت الأرغان، عسل بالمكسرات وأعشاب الصحراء. الدفع عند الاستلام في كل الجزائر.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedProducts limit={8} title="منتجاتنا. مشاكل مختلفة. حل طبيعي واحد." />
      <IngredientAuthority />
      <StorySection />
      <OfferBanner />
      <Testimonials />
      <HowItWorks />
      <FinalCTA />
      <FAQSection />
    </>
  );
}
