import { formatPrice } from '@/lib/money';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import { CheckCircleIcon } from '@/components/common/Icons';
import type { CartItem } from '@/types/commerce';
import { PRODUCTS } from '@/config/products';

interface OrderSummaryProps {
  items: CartItem[];
  totalDa: number;
}

export default function OrderSummary({ items, totalDa }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl bg-[#F9F6F0] border border-warm-sand/40 p-4 space-y-3">
      <h3 className="font-kufi font-bold text-sm text-charcoal-ink">طلبك</h3>

      <div className="space-y-3 max-h-44 overflow-y-auto pr-1">
        {items.map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId);
          return (
            <div
              key={`${item.productId}-${item.offer.pieces}`}
              className="flex items-start gap-3"
            >
              <div className="w-14 h-14 rounded-xl border border-border-sand overflow-hidden shrink-0">
                <PlaceholderImage
                  category={product?.category ?? 'default'}
                  aspectRatio="square"
                  className="rounded-none"
                />
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className="font-plex text-sm text-charcoal-ink leading-snug line-clamp-2">
                  {item.name}
                </p>
                <p className="font-plex text-xs text-charcoal-ink/55 mt-0.5">
                  {item.offer.label}
                  {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                </p>
              </div>
              <span className="font-kufi font-semibold text-sm text-charcoal-ink shrink-0 pt-0.5">
                {formatPrice(item.offer.priceDa * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-warm-sand/60 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-kufi font-bold text-base text-charcoal-ink">الإجمالي</span>
          <span className="font-kufi font-bold text-lg text-success-green">
            {formatPrice(totalDa)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-success-green">
          <CheckCircleIcon className="w-4 h-4 shrink-0" />
          <p className="font-plex text-xs font-medium">
            شحن مجاني • الدفع عند الاستلام فقط
          </p>
        </div>
      </div>
    </div>
  );
}
