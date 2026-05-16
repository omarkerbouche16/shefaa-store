import TrustBadges from '@/components/brand/TrustBadges';

interface TrustStripProps {
  compact?: boolean;
}

export default function TrustStrip({ compact = false }: TrustStripProps) {
  return (
    <section className="bg-white border-y border-border-sand py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustBadges compact={compact} />
      </div>
    </section>
  );
}
