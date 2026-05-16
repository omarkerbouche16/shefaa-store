import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية — الشفاء',
  description: 'كيف نقوم بحماية بياناتك الشخصية في الشفاء.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-cream min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive mb-4">
            سياسة الخصوصية
          </h1>
          <p className="font-plex text-charcoal-ink/70">
            نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-card border border-border-sand space-y-8">
          
          <section className="space-y-3">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">1. جمع المعلومات</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              عند قيامك بالطلب من موقعنا، نقوم بجمع المعلومات الأساسية اللازمة لإتمام وتوصيل طلبك فقط، وهي:
            </p>
            <ul className="list-disc list-inside font-plex text-charcoal-ink/80 leading-relaxed space-y-1 pr-4">
              <li>الاسم الكامل</li>
              <li>رقم الهاتف المحمول</li>
              <li>الولاية والبلدية (يتم تحديدها هاتفياً)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">2. استخدام المعلومات</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              نستخدم بياناتك الشخصية حصرياً للأغراض التالية:
            </p>
            <ul className="list-disc list-inside font-plex text-charcoal-ink/80 leading-relaxed space-y-1 pr-4">
              <li>تأكيد طلبك هاتفياً.</li>
              <li>توصيل الطلب إلى عنوانك عبر شركات الشحن المعتمدة.</li>
              <li>التواصل معك بخصوص حالة طلبك أو لتقديم دعم ما بعد البيع.</li>
              <li>إرسال عروض حصرية مستقبلاً (يمكنك طلب إيقافها في أي وقت).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">3. حماية ومشاركة البيانات</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              نحن نلتزم بالقانون رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي. 
              <strong> لا نقوم ببيع، تأجير، أو مشاركة بياناتك الشخصية مع أي طرف ثالث لأغراض تسويقية. </strong>
              يتم مشاركة اسمك ورقم هاتفك وعنوانك فقط مع شركة التوصيل (مثل ياليدين أو غيرها) لغرض إيصال الطلب إليك.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">4. ملفات تعريف الارتباط (Cookies)</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              يستخدم موقعنا ملفات تعريف الارتباط وتقنيات التتبع (مثل بيكسل فيسبوك وتيك توك) لتحسين تجربة تصفحك، وفهم كيفية استخدامك للموقع، وتقديم إعلانات تناسب اهتماماتك. يمكنك تعطيل ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
