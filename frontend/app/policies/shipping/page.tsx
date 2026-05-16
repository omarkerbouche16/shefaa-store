import type { Metadata } from 'next';
import { ShieldCheckIcon, TruckIcon, PhoneIcon } from '@/components/common/Icons';

export const metadata: Metadata = {
  title: 'سياسة الشحن والتوصيل — الشفاء',
  description: 'تعرفي على سياسة الشحن والتوصيل الخاصة بمتجر الشفاء في الجزائر.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-cream min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive mb-4">
            سياسة الشحن والتوصيل
          </h1>
          <p className="font-plex text-charcoal-ink/70">
            نلتزم بتوصيل طلبك بأسرع وقت وبأعلى جودة إلى باب منزلك في أي ولاية جزائرية.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-card border border-border-sand space-y-10">
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <PhoneIcon className="w-6 h-6 text-honey-gold" />
              <h2 className="font-kufi font-bold text-xl text-desert-olive">1. تأكيد الطلب (مهم جداً)</h2>
            </div>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              بمجرد إتمامك للطلب عبر الموقع، سيقوم فريق خدمة العملاء بالاتصال بك هاتفياً خلال 24 ساعة لتأكيد الطلب ومراجعة العنوان. 
              <strong> لن يتم شحن أي طلب قبل تأكيده هاتفياً.</strong> يرجى التأكد من إدخال رقم هاتف صحيح ومتاح.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <TruckIcon className="w-6 h-6 text-honey-gold" />
              <h2 className="font-kufi font-bold text-xl text-desert-olive">2. مدة وتكلفة التوصيل</h2>
            </div>
            <ul className="list-disc list-inside font-plex text-charcoal-ink/80 leading-relaxed space-y-2 pr-4">
              <li>نقوم بالتوصيل إلى جميع ولايات الجزائر (58 ولاية).</li>
              <li><strong>الولايات الشمالية والوسطى:</strong> التوصيل يستغرق عادة من 2 إلى 4 أيام عمل.</li>
              <li><strong>الولايات الجنوبية:</strong> التوصيل يستغرق عادة من 3 إلى 6 أيام عمل.</li>
              <li>يتم تحديد تكلفة التوصيل أثناء المكالمة الهاتفية بناءً على ولايتك وبلديتك، وغالباً ما نوفر عروض توصيل مجاني أو مخفض.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-honey-gold" />
              <h2 className="font-kufi font-bold text-xl text-desert-olive">3. الالتزام بالاستلام (الدفع عند الاستلام)</h2>
            </div>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              نحن نوفر خدمة <strong>الدفع عند الاستلام (COD)</strong> لراحتك وثقتك. هذا يعني أن شركتنا تتحمل تكاليف الشحن والتغليف مسبقاً.
            </p>
            <div className="bg-warning-amber/10 border border-warning-amber/20 rounded-xl p-4 mt-3">
              <p className="font-plex text-sm text-warning-amber leading-relaxed font-semibold">
                ملاحظة قانونية وأخلاقية: طلبك للمنتج هو التزام جاد بالشراء. رفض استلام الطلب بعد تأكيده هاتفياً وشحنه يكبد الشركة خسائر مالية في الشحن والتغليف. نحتفظ بحق حظر الأرقام والأسماء التي ترفض الاستلام بدون عذر قاهر من الطلب مستقبلاً، وذلك وفقاً لقوانين التجارة الإلكترونية.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">4. تتبع الطلب</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              سيتصل بك مندوب التوصيل (Livreur) في يوم التوصيل لترتيب موعد ومكان الاستلام. يرجى الرد على أرقام الهواتف غير المحفوظة في ذلك اليوم لتجنب تأخر طلبك.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
