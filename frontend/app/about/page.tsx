import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'من نحن — الشفاء',
  description: 'قصة الشفاء، رحلتنا من الطبيعة الجزائرية إلى منتجات طبيعية تصل لبيتك.',
};

const VALUES = [
  { icon: '🌿', title: 'الطبيعية أولاً', desc: 'كل مكون نختاره يأتي من مصدر طبيعي موثوق. لا مواد حافظة ضارة، لا إضافات غير ضرورية.' },
  { icon: '🤝', title: 'الشفافية والثقة', desc: 'نُعلمك بكل مكون في كل منتج. لأن ثقتك بنا هي الأساس.' },
  { icon: '🏺', title: 'الموروث الجزائري', desc: 'نستوحي وصفاتنا من استعمالات تقليدية جزائرية متوارثة عبر الأجيال.' },
  { icon: '💎', title: 'الجودة أولاً', desc: 'كل دفعة تمر برقابة جودة دقيقة قبل وصولها إليك.' },
];

const QUALITY_STEPS = [
  { step: '01', title: 'اختيار المكونات', desc: 'نختار مكوناتنا بعناية فائقة من مصادر طبيعية موثوقة في الجزائر وخارجها.' },
  { step: '02', title: 'الفحص والتحليل', desc: 'كل دفعة تخضع لفحص جودة للتأكد من النقاوة والجودة.' },
  { step: '03', title: 'التعبئة الآمنة', desc: 'نستخدم تعبئة صحية محكمة للحفاظ على جودة المنتج حتى يصل إليك.' },
  { step: '04', title: 'التوصيل السريع', desc: 'نشحن طلبك خلال 24-48 ساعة ليصل إليك في 3-5 أيام عمل.' },
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-desert-olive to-palm-green text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-5xl mb-4 block">🌿</span>
          <h1 className="font-kufi font-bold text-4xl md:text-5xl text-warm-sand leading-tight">
            من وصفات الجدّة
            <br />
            إلى يدَيكِ
          </h1>
          <p className="mt-4 font-plex text-warm-sand/70 text-lg leading-relaxed max-w-xl mx-auto">
            الشفاء متجر جزائري يؤمن بأن الطبيعة لها كل ما تحتاجه
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="font-kufi font-bold text-3xl text-desert-olive">قصتنا</h2>
          <div className="space-y-4 font-plex text-charcoal-ink/70 leading-relaxed text-base">
            <p>
              ولدت فكرة الشفاء من ذكريات جميلة في بيوت الجزائر. بيوت كانت فيها الجدّات يعرفن كل عشبة ووصفة، ويحضّرن للعائلة من عطاء الأرض وخيرات الطبيعة.
            </p>
            <p>
              مع تسارع وتيرة الحياة، ابتعدنا عن كثير من هذه الوصفات والمنتجات الطبيعية. قررنا في الشفاء أن نستعيد هذه القيم ونقدّمها بشكل عصري يلائم حياتنا اليوم.
            </p>
            <p>
              كل منتج نختاره يمر بعملية دقيقة للتأكد من جودته ونقائه، لأن هدفنا الأول هو ثقتك وسلامتك. الشفاء ليس مجرد متجر، بل وعد بالجودة والأصالة.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-kufi font-bold text-3xl text-desert-olive mb-8 text-center">
            قيمنا
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((value) => (
              <div key={value.title} className="flex gap-4 p-5 bg-cream rounded-2xl border border-border-sand">
                <span className="text-3xl shrink-0 mt-1">{value.icon}</span>
                <div>
                  <h3 className="font-kufi font-bold text-base text-desert-olive">{value.title}</h3>
                  <p className="mt-1 font-plex text-sm text-charcoal-ink/60 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality process */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-kufi font-bold text-3xl text-desert-olive mb-8 text-center">
            كيف نضمن الجودة؟
          </h2>
          <div className="space-y-4">
            {QUALITY_STEPS.map((step) => (
              <div key={step.step} className="flex gap-4 items-start p-5 bg-white rounded-2xl border border-border-sand shadow-card">
                <div className="w-10 h-10 shrink-0 rounded-full bg-honey-gold/15 flex items-center justify-center">
                  <span className="font-inter font-bold text-sm text-honey-gold">{step.step}</span>
                </div>
                <div>
                  <h3 className="font-kufi font-bold text-base text-desert-olive">{step.title}</h3>
                  <p className="mt-1 font-plex text-sm text-charcoal-ink/60 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-desert-olive text-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-4">
          <h2 className="font-kufi font-bold text-2xl text-warm-sand">
            جاهزة لتجربي منتجاتنا؟
          </h2>
          <p className="font-plex text-warm-sand/70">
            الدفع عند الاستلام، توصيل لكل الجزائر، منتجات طبيعية مضمونة
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3.5 bg-honey-gold hover:bg-warm-sand hover:text-desert-olive text-white font-kufi font-bold text-base rounded-full transition-colors duration-200"
          >
            تسوق الآن ←
          </Link>
        </div>
      </section>
    </div>
  );
}
