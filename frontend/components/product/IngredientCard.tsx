import { cn } from '@/lib/utils';
import { LeafIcon } from '@/components/common/Icons';

interface IngredientCardProps {
  name: string;
  benefit: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function IngredientCard({
  name,
  benefit,
  icon = <LeafIcon className="w-6 h-6 text-desert-olive" />,
  className,
}: IngredientCardProps) {
  return (
    <div
      className={cn(
        'bg-cream border border-border-sand rounded-2xl p-4 space-y-2 hover:shadow-card transition-shadow',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-border-sand">{icon}</span>
        <h4 className="font-kufi font-bold text-sm text-desert-olive">{name}</h4>
      </div>
      <p className="font-plex text-xs text-charcoal-ink/60 leading-relaxed">{benefit}</p>
    </div>
  );
}
