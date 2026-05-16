import type { Metadata } from 'next';
import { BRAND } from '@/config/brand';

export const metadata: Metadata = {
  title: 'تواصل معنا — الشفاء',
  description: 'تواصلي مع فريق الشفاء لأي استفسار عن منتجاتنا أو طلباتك.',
};

const FAQS = [
  { q: 'متى يصل طلبي؟', a: 'سنتواصل معك لتأكيد الطلب ثم نجهزه ونوصله داخل ولايات الجزائر. أوقات التوصيل تختلف حسب المنطقة وعادة تتراوح بين 3 إلى 5 أيام.' },
  { q: 'هل الدفع عند الاستلام؟', a: 'نعم، جميع الطلبات بالدفع عند الاستلام. لا حاجة للدفع مسبقاً.' },
  { q: 'كيف أعدل الاسم أو رقم الهاتف؟', a: 'تواصلي معنا قبل تجهيز الطلب وسنعدل لك بسرعة.' },
  { q: 'ماذا لو وصل المنتج تالفاً؟', a: 'تواصلي معنا مباشرة مع صورة وسنعالج الأمر حسب سياسة الاستبدال والضمان الذهبي الخاص بنا.' },
];

export default function ContactPage() {
  return (
    <div className="bg-cream min-h-screen selection:bg-desert-olive selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        
        {/* Header */}
        <h1 className="font-kufi font-extrabold text-4xl md:text-5xl text-desert-olive mb-4 tracking-tight">
          فريق الشفاء معك
        </h1>
        <p className="font-plex text-lg md:text-xl text-charcoal-ink/70 mb-16 leading-relaxed max-w-2xl">
          لأي سؤال عن طلبك أو المنتجات، نحن هنا بالعربي.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Side Column (Contacts) */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <h3 className="font-kufi font-bold text-lg text-desert-olive mb-2">واتساب</h3>
              <a 
                href={`https://wa.me/${BRAND.whatsapp.replace('+', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-plex text-base text-charcoal-ink hover:text-honey-gold transition-colors block"
                dir="ltr"
              >
                {BRAND.whatsapp}
              </a>
            </div>

            <div>
              <h3 className="font-kufi font-bold text-lg text-desert-olive mb-2">البريد الإلكتروني</h3>
              <a 
                href={`mailto:${BRAND.email}`} 
                className="font-plex text-base text-charcoal-ink hover:text-honey-gold transition-colors block"
              >
                {BRAND.email}
              </a>
            </div>

            <div>
              <h3 className="font-kufi font-bold text-lg text-desert-olive mb-2">أوقات الدعم</h3>
              <p className="font-plex text-base text-charcoal-ink/70 leading-relaxed">
                السبت – الخميس<br />
                9 صباحاً – 9 مساءً
              </p>
            </div>
          </div>

          {/* Main Column (FAQ) */}
          <div className="lg:col-span-8">
            <h2 className="font-kufi font-extrabold text-3xl text-desert-olive mb-8 tracking-tight border-b border-border-sand pb-4">
              أسئلة شائعة
            </h2>
            <div className="space-y-10">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-kufi font-bold text-xl text-desert-olive mb-3 leading-snug">
                    {faq.q}
                  </h3>
                  <p className="font-plex text-base md:text-lg text-charcoal-ink/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
