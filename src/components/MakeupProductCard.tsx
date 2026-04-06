import type { MakeupProduct } from '../types/analysis';

const TYPE_COLOR: Record<string, string> = {
  foundation: '#f59e0b',
  concealer: '#a855f7',
  blush: '#ec4899',
  eyeshadow: '#6366f1',
  mascara: '#1e1e3a',
  lipstick: '#ef4444',
  highlighter: '#f59e0b',
  primer: '#22c55e',
  'setting spray': '#06b6d4',
  contour: '#a16207',
  eyeliner: '#6366f1',
};

const AFFILIATE_TAG = 'roopai03-21';

export default function MakeupProductCard({ product }: { product: MakeupProduct }) {
  const color = TYPE_COLOR[product.type] ?? '#a855f7';
  const query = encodeURIComponent(product.name);
  const amazonUrl = `https://www.amazon.in/s?k=${query}&tag=${AFFILIATE_TAG}`;
  const nykaaUrl = `https://www.nykaa.com/search/result/?q=${query}`;

  return (
    <div style={{
      background: '#12122a', border: '1px solid #1e1e3a', borderRadius: 12,
      padding: '14px 16px', marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 6,
          background: `${color}22`, color,
        }}>{product.type}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f0' }}>{product.name}</span>
        {product.shade && (
          <span style={{ fontSize: 11, color: '#888', fontStyle: 'italic' }}>· {product.shade}</span>
        )}
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 13, color: '#888', lineHeight: 1.5 }}>{product.reason}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <a href={amazonUrl} target="_blank" rel="noreferrer noopener" style={{
          fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
          background: 'rgba(245,158,11,0.12)', color: '#f59e0b',
          border: '1px solid rgba(245,158,11,0.25)', textDecoration: 'none', letterSpacing: 0.3,
        }}>
          🛒 Buy on Amazon
        </a>
        <a href={nykaaUrl} target="_blank" rel="noreferrer noopener" style={{
          fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
          background: 'rgba(236,72,153,0.12)', color: '#ec4899',
          border: '1px solid rgba(236,72,153,0.25)', textDecoration: 'none', letterSpacing: 0.3,
        }}>
          💄 Buy on Nykaa
        </a>
      </div>
    </div>
  );
}
