const RARITY_STYLES: Record<string, string> = {
  common: 'text-seafoam border-seafoam/50',
  uncommon: 'text-lure border-lure',
  rare: 'text-sky-700 border-sky-600',
  epic: 'text-fuchsia-700 border-fuchsia-600',
  legendary: 'text-catch border-catch',
  mythic: 'text-rose-700 border-rose-600',
  secret: 'text-red-700 border-red-600',
};

export type Item = {
  id: string;
  name: string;
  category: string;
  rarity: string;
  image_url: string | null;
  status: string;
  owner_id: string;
  rap?: number | null;
};

export default function ItemCard({ item, footer }: { item: Item; footer?: React.ReactNode }) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="aspect-square bg-deep border-b-2 border-foam flex items-center justify-center">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-seafoam/50 text-3xl">🐟</span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <span className={`tag-rarity self-start ${RARITY_STYLES[item.rarity] ?? RARITY_STYLES.common}`}>
          {item.rarity}
        </span>
        <h3 className="font-display text-sm leading-tight">{item.name}</h3>
        <span className="text-seafoam text-xs">{item.category}</span>
        {!!item.rap && (
          <span className="text-xs font-mono text-catch">RAP: {item.rap.toLocaleString('id-ID')}</span>
        )}
        {item.status !== 'available' && (
          <span className="text-[11px] text-catch font-mono">{item.status === 'in_trade' ? 'sedang ditrade' : 'sudah ditrade'}</span>
        )}
      </div>
      {footer && <div className="p-3 pt-0">{footer}</div>}
    </div>
  );
}
