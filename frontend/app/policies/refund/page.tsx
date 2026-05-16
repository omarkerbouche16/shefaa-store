import type { Metadata } from 'next';
import { ShieldCheckIcon, CheckCircleIcon } from '@/components/common/Icons';

export const metadata: Metadata = {
  title: 'سياسة الاستبدال والاسترجاع — الشفاء',
  description: 'تعرفي على الضمان الذهبي وسياسة الاسترجاع في متجر الشفاء.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-cream min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive mb-4">
            سياسة الاستبدال والاسترجاع
          </h1>
          <p className="font-plex text-charcoal-ink/70">
            راحتك وثقتك هي أولويتنا. نقدم لك سياسة استرجاع مرنة ومضمونة.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-card border border-border-sand space-y-10">
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-honey-gold" />
              <h2 className="font-kufi font-bold text-2xl text-desert-olive">الضمان الذهبي (30 يوماً)</h2>
            </div>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              نحن في &ldquo;الشفاء&rdquo; نثق تماماً في جودة وفعالية منتجاتنا الطبيعية. لذلك، نقدم لك <strong>ضمان استرجاع الأموال لمدة 30 يوماً</strong>.
            </p>
            <ul className="list-disc list-inside font-plex text-charcoal-ink/80 leading-relaxed space-y-2 pr-4">
              <li>إذا استخدمتِ المنتج بانتظام حسب التعليمات المرفقة لمدة 30 يوماً ولم تلاحظي أي تحسن أو نتيجة إيجابية، يحق لك المطالبة باسترجاع أموالك.</li>
              <li>يجب التواصل معنا عبر الواتساب أو البريد الإلكتروني قبل انتهاء مدة الـ 30 يوماً من تاريخ الاستلام.</li>
              <li>قد نطلب منك بعض التفاصيل حول كيفية استخدامك للمنتج لتحسين جودتنا.</li>
              <li>يتم استرجاع قيمة المنتج (لا تشمل تكاليف الشحن) عبر تحويل بريدي (CCP) أو بنكي (BaridiMob).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="w-6 h-6 text-honey-gold" />
              <h2 className="font-kufi font-bold text-xl text-desert-olive">المنتجات التالفة أو الخاطئة</h2>
            </div>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              وفقاً لقانون حماية المستهلك الجزائري، إذا وصلك المنتج تالفاً، مكسوراً، أو مختلفاً عن ما قمت بطلبه:
            </p>
            <ul className="list-disc list-inside font-plex text-charcoal-ink/80 leading-relaxed space-y-2 pr-4">
              <li>يرجى التواصل معنا فوراً (خلال 48 ساعة من الاستلام) وإرسال صورة للمنتج التالف.</li>
              <li>سنقوم بإرسال منتج بديل لك مجاناً وبدون أي تكاليف شحن إضافية.</li>
              <li>أو يمكنك طلب استرجاع المبلغ بالكامل بما في ذلك تكلفة الشحن.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">إلغاء الطلب</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              يمكنك إلغاء طلبك بكل سهولة وبدون أي رسوم طالما أن الطلب لم يتم شحنه بعد. بمجرد خروج الطلب مع شركة التوصيل، نرجو منك الالتزام باستلامه تجنباً لتكبيد الشركة خسائر الشحن.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
