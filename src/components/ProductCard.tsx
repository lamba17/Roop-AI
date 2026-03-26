import type { ProductRecommendation } from '../types/analysis';

const TYPE_COLOR: Record<string, string> = {
  cleanser: '#06b6d4',
  serum: '#a855f7',
  moisturizer: '#22c55e',
  sunscreen: '#f59e0b',
  toner: '#ec4899',
  'eye cream': '#6366f1',
};

export default function ProductCard({ product }: { product: ProductRecommendation }) {
  const color = TYPE_COLOR[product.type] ?? '#a855f7';
  return (
    <div style={{
      background: '#12122a', border: '1px solid #1e1e3a', borderRadius: 12,
      padding: '14px 16px', marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 6,
          background: `${color}22`, color,
        }}>{product.type}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f0' }}>{product.name}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: '#888', lineHeight: 1.5 }}>{product.reason}</p>
    </div>
  );
}
