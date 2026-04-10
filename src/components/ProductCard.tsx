import type { ProductRecommendation } from '../types/analysis';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';

const TYPE_COLOR: Record<string, string> = {
  cleanser: '#06b6d4',
  serum: '#a855f7',
  moisturizer: '#22c55e',
  sunscreen: '#f59e0b',
  toner: '#ec4899',
  'eye cream': '#6366f1',
};

const AFFILIATE_TAG = 'roopai03-21';

function buildLinks(name: string) {
  const query = encodeURIComponent(name);
  return {
    amazon: `https://www.amazon.in/s?k=${query}&tag=${AFFILIATE_TAG}`,
    nykaa: `https://www.nykaa.com/search/result/?q=${query}`,
  };
}

export default function ProductCard({ product }: { product: ProductRecommendation }) {
  const { lang } = useLanguage();
  const t = T[lang];
  const color = TYPE_COLOR[product.type] ?? '#a855f7';
  const links = buildLinks(product.name);

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
      <p style={{ margin: 0, fontSize: 13, color: '#888', lineHeight: 1.5, marginBottom: 10 }}>{product.reason}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href={links.amazon}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
            background: 'rgba(245,158,11,0.12)', color: '#f59e0b',
            border: '1px solid rgba(245,158,11,0.25)', textDecoration: 'none',
            letterSpacing: 0.3,
          }}
        >
          {t.buyAmazon}
        </a>
        <a
          href={links.nykaa}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
            background: 'rgba(236,72,153,0.12)', color: '#ec4899',
            border: '1px solid rgba(236,72,153,0.25)', textDecoration: 'none',
            letterSpacing: 0.3,
          }}
        >
          {t.buyNykaa}
        </a>
      </div>
    </div>
  );
}
