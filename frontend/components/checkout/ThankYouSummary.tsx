import { cn } from '@/lib/utils';
import { PhoneIcon, CheckCircleIcon, TruckIcon } from '@/components/common/Icons';

interface ThankYouSummaryProps {
  orderId?: string;
  customerName?: string;
  phone?: string;
  className?: string;
}

export default function ThankYouSummary({
  orderId,
  customerName,
  phone,
  className,
}: ThankYouSummaryProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl border border-border-sand shadow-[0_8px_40px_-12px_rgba(40,35,30,0.12)] p-6 sm:p-8 space-y-5',
        className
      )}
    >
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-success-green/15 flex items-center justify-center ring-4 ring-success-green/10">
          <svg className="w-8 h-8 text-success-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="font-kufi font-bold text-2xl text-desert-olive">
          تم استلام طلبك!
        </h2>
        <p className="font-plex text-sm text-charcoal-ink/65">
          {customerName ? `شكراً ${customerName}` : 'شكراً لك'}
          {' '}— سنتواصل معك قريباً لتأكيد الطلب
        </p>
      </div>

      <div className="rounded-2xl bg-[#F9F6F0] border border-warm-sand/40 p-4 space-y-3">
        {orderId && (
          <div className="flex items-center justify-between gap-2">
            <span className="font-plex text-sm text-charcoal-ink/60">رقم الطلب</span>
            <span className="font-inter text-sm font-semibold text-desert-olive" dir="ltr">
              #{orderId}
            </span>
          </div>
        )}
        {phone && (
          <div className="flex items-center justify-between gap-2">
            <span className="font-plex text-sm text-charcoal-ink/60">رقم الهاتف</span>
            <span className="font-inter text-sm font-semibold text-charcoal-ink" dir="ltr">
              {phone}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {[
          {
            icon: <PhoneIcon className="w-5 h-5 text-honey-gold" />,
            text: 'سيتصل بك فريقنا لتأكيد الطلب',
          },
          {
            icon: <CheckCircleIcon className="w-5 h-5 text-honey-gold" />,
            text: 'الدفع عند استلام الطلب فقط',
          },
          {
            icon: <TruckIcon className="w-5 h-5 text-honey-gold" />,
            text: 'التوصيل خلال 3–5 أيام عمل',
          },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-3 p-3.5 bg-cream/80 rounded-2xl border border-border-sand/50"
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="font-plex text-sm text-charcoal-ink/75 text-right flex-1">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
