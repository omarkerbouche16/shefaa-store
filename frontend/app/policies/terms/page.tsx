import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الشروط والأحكام — الشفاء',
  description: 'الشروط والأحكام الخاصة باستخدام موقع الشفاء.',
};

export default function TermsPolicyPage() {
  return (
    <div className="bg-cream min-h-screen py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="font-kufi font-bold text-3xl md:text-4xl text-desert-olive mb-4">
            الشروط والأحكام
          </h1>
          <p className="font-plex text-charcoal-ink/70">
            يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-card border border-border-sand space-y-8">
          
          <section className="space-y-3">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">1. مقدمة</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              مرحباً بك في موقع &ldquo;الشفاء&rdquo; (shefaa.shop). باستخدامك لهذا الموقع وطلبك لمنتجاتنا، فإنك توافق على الالتزام بالشروط والأحكام التالية، والتي تتوافق مع القوانين المعمول بها في الجمهورية الجزائرية الديمقراطية الشعبية، بما في ذلك القانون رقم 18-05 المتعلق بالتجارة الإلكترونية.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">2. إخلاء المسؤولية الطبية</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              المنتجات المعروضة في موقعنا هي مكملات غذائية ومنتجات عناية طبيعية وليست أدوية طبية. المعلومات المقدمة على الموقع هي لأغراض تثقيفية فقط ولا تغني عن الاستشارة الطبية. إذا كنت تعاني من حالة طبية، أو حامل، أو مرضع، يرجى استشارة طبيبك قبل استخدام أي منتج.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">3. الطلبات والدفع</h2>
            <ul className="list-disc list-inside font-plex text-charcoal-ink/80 leading-relaxed space-y-2 pr-4">
              <li>نعتمد نظام <strong>الدفع عند الاستلام (COD)</strong> كطريقة دفع أساسية.</li>
              <li>تقديم الطلب يعتبر عقداً ملزماً بالشراء. التهرب من الاستلام بعد تأكيد الطلب هاتفياً وشحنه يعتبر إخلالاً بهذا العقد.</li>
              <li>نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب، بما في ذلك عدم توفر المنتج أو وجود خطأ في السعر.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">4. الأسعار والمنتجات</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              جميع الأسعار معروضة بالدينار الجزائري (DA). نحتفظ بالحق في تعديل الأسعار أو تغيير المنتجات المتاحة في أي وقت دون إشعار مسبق. ومع ذلك، السعر الذي طلبته به هو السعر الذي ستدفعه عند الاستلام.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-kufi font-bold text-xl text-desert-olive">5. حقوق الملكية الفكرية</h2>
            <p className="font-plex text-charcoal-ink/80 leading-relaxed">
              جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص، الصور، الشعارات، والتصميمات، هي ملكية حصرية لعلامة &ldquo;الشفاء&rdquo; ومحمية بقوانين حقوق النشر. يُمنع منعاً باتاً نسخ أو استخدام أي محتوى دون إذن كتابي مسبق.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
