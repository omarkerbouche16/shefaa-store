import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark';
}

const sizes = {
  sm: { circle: 32, text: 'text-base', sub: 'text-[10px]', markFont: 'text-xs' },
  md: { circle: 44, text: 'text-xl', sub: 'text-xs', markFont: 'text-sm' },
  lg: { circle: 60, text: 'text-2xl', sub: 'text-sm', markFont: 'text-lg' },
};

export default function Logo({ className, size = 'md', variant = 'full' }: LogoProps) {
  const s = sizes[size];

  return (
    <Link href="/" className={cn('flex items-center gap-3 group', className)}>
      {/* Circular brand mark */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-full bg-desert-olive border-2 border-honey-gold shadow-warm group-hover:shadow-warm-lg transition-shadow duration-200"
        style={{ width: s.circle, height: s.circle }}
      >
        <span className={cn('font-kufi text-warm-sand font-bold leading-none', s.markFont)}>
          ﷺ
        </span>
        <div className="absolute inset-0 rounded-full border border-honey-gold/40 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>

      {variant === 'full' && (
        <div className="flex flex-col leading-tight">
          <span className={cn('font-kufi font-bold text-desert-olive leading-none', s.text)}>
            الشفاء
          </span>
          <span className={cn('font-inter text-honey-gold tracking-widest uppercase', s.sub)}>
            shefaa
          </span>
        </div>
      )}
    </Link>
  );
}
