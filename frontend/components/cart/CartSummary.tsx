import { formatPrice } from '@/lib/money';

interface CartSummaryProps {
  subtotalDa: number;
}

export default function CartSummary({ subtotalDa }: CartSummaryProps) {
  return (
    <div className="space-y-3 pt-3 border-t border-border-sand">
      <div className="flex items-center justify-between">
        <span className="font-plex text-sm text-charcoal-ink/60">المجموع الفرعي</span>
        <span className="font-kufi font-bold text-base text-desert-olive">
          {formatPrice(subtotalDa)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-plex text-sm text-charcoal-ink/60">التوصيل</span>
        <span className="font-plex text-sm text-success-green font-semibold">
          سيُحدد عند التأكيد
        </span>
      </div>

      <div className="flex items-center gap-2 bg-success-green/10 rounded-xl p-3">
        <span className="text-lg">💵</span>
        <p className="font-plex text-xs text-success-green font-medium">
          الدفع عند الاستلام — لن يُطلب منك دفع مسبق
        </p>
      </div>
    </div>
  );
}
