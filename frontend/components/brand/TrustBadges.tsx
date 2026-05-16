import { cn } from '@/lib/utils';
import { ShieldCheckIcon, TruckIcon, MicroscopeIcon, CrownIcon } from '@/components/common/Icons';

interface Badge {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}

const BADGES: Badge[] = [
  { icon: <ShieldCheckIcon className="w-6 h-6 text-honey-gold" />, label: 'ضمان ذهبي', sublabel: 'استرجاع الأموال خلال 30 يوماً' },
  { icon: <TruckIcon className="w-6 h-6 text-honey-gold" />, label: 'توصيل سريع 58 ولاية', sublabel: 'الدفع عند الاستلام بكل أمان' },
  { icon: <MicroscopeIcon className="w-6 h-6 text-honey-gold" />, label: 'فعالية مثبتة', sublabel: 'مكونات طبيعية مدروسة علمياً' },
  { icon: <CrownIcon className="w-6 h-6 text-honey-gold" />, label: 'جودة استثنائية', sublabel: 'مصمم خصيصاً ليناسب مناخنا' },
];

interface TrustBadgesProps {
  className?: string;
  compact?: boolean;
}

export default function TrustBadges({ className, compact = false }: TrustBadgesProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 gap-3',
        className
      )}
    >
      {BADGES.map((badge) => (
        <div
          key={badge.label}
          className={cn(
            'flex items-center gap-3 bg-cream border border-border-sand rounded-2xl',
            compact ? 'p-3' : 'p-4'
          )}
        >
          <span className={cn('shrink-0 flex items-center justify-center bg-desert-olive rounded-xl', compact ? 'w-10 h-10' : 'w-12 h-12')}>
            {badge.icon}
          </span>
          <div className="flex flex-col">
            <span className={cn('font-kufi font-semibold text-desert-olive leading-tight', compact ? 'text-xs' : 'text-sm')}>
              {badge.label}
            </span>
            {!compact && badge.sublabel && (
              <span className="text-xs font-plex text-charcoal-ink/60 leading-tight">
                {badge.sublabel}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
