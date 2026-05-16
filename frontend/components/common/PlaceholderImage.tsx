import type { ProductCategory } from '@/types/commerce';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  category?: ProductCategory | string;
  aspectRatio?: 'square' | 'portrait' | '4/3' | '3/4' | '16/9';
  label?: string;
  className?: string;
}

const CATEGORY_CONFIG: Record<string, { from: string; to: string; icon: React.ReactNode }> = {
  hair: {
    from: '#FEF3C7',
    to: '#FDE68A',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-2/5 h-2/5 opacity-50">
        <path
          d="M16 4C12 4 8 7 8 12c0 3 1.5 5.5 4 7v5a4 4 0 008 0v-5c2.5-1.5 4-4 4-7 0-5-4-8-8-8z"
          fill="#92400E"
        />
        <circle cx="16" cy="11" r="3" fill="#B45309" opacity="0.6" />
      </svg>
    ),
  },
  skin: {
    from: '#FCE7F3',
    to: '#FBCFE8',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-2/5 h-2/5 opacity-50">
        <path
          d="M16 6c-5.5 0-9 4-9 8 0 2.5 1 4.5 3 6l1 8h10l1-8c2-1.5 3-3.5 3-6 0-4-3.5-8-9-8z"
          fill="#BE185D"
        />
        <circle cx="12" cy="14" r="1.5" fill="#F9A8D4" />
        <circle cx="20" cy="14" r="1.5" fill="#F9A8D4" />
      </svg>
    ),
  },
  food: {
    from: '#DCFCE7',
    to: '#BBF7D0',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-2/5 h-2/5 opacity-50">
        <path
          d="M16 4c-1.5 0-3 .8-4 2-1-1-2.5-1.5-4-1C6 7 6 10 8 12l8 14 8-14c2-2 2-5-.5-7-1.5-.5-3 0-4 1-1-1.2-2.5-2-3.5-2z"
          fill="#15803D"
        />
      </svg>
    ),
  },
  beauty: {
    from: '#EDE9FE',
    to: '#DDD6FE',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-2/5 h-2/5 opacity-50">
        <path
          d="M16 5l2.5 7h7.5l-6 4.5 2.5 7L16 19.5 9.5 23.5l2.5-7L6 12h7.5L16 5z"
          fill="#7C3AED"
        />
      </svg>
    ),
  },
  herbs: {
    from: '#D1FAE5',
    to: '#A7F3D0',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-2/5 h-2/5 opacity-50">
        <path
          d="M16 28c0 0-8-6-8-14 0-4.5 3.5-8 8-8s8 3.5 8 8c0 8-8 14-8 14z"
          fill="#065F46"
        />
        <path
          d="M16 14c0 0-5-4-5-8 3 0 5 2 5 2s2-2 5-2c0 4-5 8-5 8z"
          fill="#34D399"
          opacity="0.7"
        />
      </svg>
    ),
  },
  default: {
    from: '#FEF9EE',
    to: '#FDE8C0',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-2/5 h-2/5 opacity-40">
        <rect x="6" y="8" width="20" height="16" rx="3" fill="#B45309" />
        <circle cx="16" cy="16" r="5" fill="#FDE68A" />
        <circle cx="16" cy="16" r="2" fill="#B45309" opacity="0.5" />
      </svg>
    ),
  },
};

export default function PlaceholderImage({
  category = 'default',
  aspectRatio = 'square',
  label,
  className,
}: PlaceholderImageProps) {
  const cfg = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.default;

  const cssAspectRatio =
    aspectRatio === 'square' ? '1 / 1'
    : aspectRatio === 'portrait' ? '3 / 4'
    : aspectRatio === '4/3' ? '4 / 3'
    : aspectRatio === '3/4' ? '3 / 4'
    : aspectRatio === '16/9' ? '16 / 9'
    : undefined;

  return (
    <div
      className={cn('relative w-full h-full flex flex-col items-center justify-center overflow-hidden', className)}
      style={{
        background: `linear-gradient(135deg, ${cfg.from} 0%, ${cfg.to} 100%)`,
        aspectRatio: cssAspectRatio,
      }}
      aria-hidden="true"
      role="img"
    >
      {cfg.icon}
      {label && (
        <span
          className="absolute bottom-0 inset-x-0 px-2 py-1.5 text-center font-kufi text-[10px] font-semibold leading-tight line-clamp-2"
          style={{ color: cfg.from === '#FEF3C7' ? '#92400E' : '#1C1917', background: 'rgba(255,255,255,0.55)' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
