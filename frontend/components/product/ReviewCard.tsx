import { cn } from '@/lib/utils';
import { StarIcon } from '@/components/common/Icons';

interface ReviewCardProps {
  name: string;
  wilaya: string;
  rating: number;
  text: string;
  date?: string;
  className?: string;
}

export default function ReviewCard({
  name,
  wilaya,
  rating,
  text,
  date,
  className,
}: ReviewCardProps) {
  return (
    <div className={cn('bg-white rounded-2xl p-5 border border-border-sand shadow-card space-y-3', className)}>
      {/* Stars */}
      <div className="flex gap-0.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={cn('w-4 h-4', star <= rating ? 'text-honey-gold' : 'text-border-sand')}
          />
        ))}
      </div>

      {/* Text */}
      <p className="font-plex text-sm text-charcoal-ink leading-relaxed">{text}</p>

      {/* Author */}
      <div className="flex items-center justify-between pt-1 border-t border-border-sand/50">
        <div>
          <p className="font-kufi font-semibold text-sm text-desert-olive">{name}</p>
          <p className="font-plex text-xs text-charcoal-ink/50">{wilaya}</p>
        </div>
        {date && (
          <span className="font-inter text-xs text-charcoal-ink/40">{date}</span>
        )}
      </div>
    </div>
  );
}
