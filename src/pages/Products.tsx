import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';

type PriceRange = 'all' | 'under500' | '500to1000' | '1000to2000' | 'above2000';
const PRICE_RANGES: { key: PriceRange; label: string; min: number; max: number }[] = [
  { key: 'all',        label: 'All Prices',   min: 0,    max: Infinity },
  { key: 'under500',   label: 'Under ₹500',   min: 0,    max: 499 },
  { key: '500to1000',  label: '₹500–₹1,000',  min: 500,  max: 1000 },
  { key: '1000to2000', label: '₹1,000–₹2,000',min: 1001, max: 2000 },
  { key: 'above2000',  label: 'Above ₹2,000', min: 2001, max: Infinity },
];

interface StaticProduct {
  name: string;
  brand: string;
  type: string;
  price: number;
  priceLabel: string;
  reason: string;
  rating: number;
}

const STATIC_SKIN_PRODUCTS: StaticProduct[] = [
  { name: 'Mamaearth Ubtan Face Wash', brand: 'Mamaearth', type: 'cleanser', price: 299, priceLabel: '₹299', reason: 'Turmeric & saffron gently cleanse while brightening dull skin.', rating: 4.5 },
  { name: 'Dot & Key Pore Clarifying Facewash', brand: 'Dot & Key', type: 'cleanser', price: 395, priceLabel: '₹395', reason: 'BHA-powered cleanser clears pores and controls oil without stripping.', rating: 4.4 },
  { name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil', type: 'cleanser', price: 549, priceLabel: '₹549', reason: 'Dermatologist-recommended, soap-free formula for sensitive skin.', rating: 4.7 },
  { name: 'Plum Green Tea Pore Cleansing Face Wash', brand: 'Plum', type: 'cleanser', price: 399, priceLabel: '₹399', reason: 'Green tea antioxidants minimize pores and balance oily skin.', rating: 4.4 },
  { name: 'The Derma Co 1% Salicylic Acid Facewash', brand: 'The Derma Co', type: 'cleanser', price: 359, priceLabel: '₹359', reason: 'Salicylic acid exfoliates inside pores, reducing acne and blackheads.', rating: 4.3 },
  { name: 'Simple Kind to Skin Moisturising Cleanser', brand: 'Simple', type: 'cleanser', price: 349, priceLabel: '₹349', reason: 'No perfume or dyes — perfect for sensitive or reactive skin.', rating: 4.2 },
  { name: 'Mamaearth Vitamin C Daily Glow Serum', brand: 'Mamaearth', type: 'serum', price: 599, priceLabel: '₹599', reason: 'Vitamin C + turmeric reduce dark spots and add a healthy glow.', rating: 4.4 },
  { name: 'Dot & Key Waterlight Gel Moisturiser + Serum', brand: 'Dot & Key', type: 'serum', price: 745, priceLabel: '₹745', reason: 'Hyaluronic acid serum-moisturiser combo keeps oily skin matte yet dewy.', rating: 4.5 },
  { name: 'Minimalist 10% Niacinamide Serum', brand: 'Minimalist', type: 'serum', price: 599, priceLabel: '₹599', reason: 'Reduces pore size, controls sebum, and fades hyperpigmentation.', rating: 4.6 },
  { name: 'Plum 15% Vitamin C Serum', brand: 'Plum', type: 'serum', price: 849, priceLabel: '₹849', reason: 'Stable Vitamin C formula evens tone and boosts collagen.', rating: 4.3 },
  { name: 'The Ordinary Hyaluronic Acid 2% + B5', brand: 'The Ordinary', type: 'serum', price: 649, priceLabel: '₹649', reason: 'Intense hydration serum plumps fine lines and restores moisture barrier.', rating: 4.7 },
  { name: 'Dot & Key Cica Calming Serum', brand: 'Dot & Key', type: 'serum', price: 995, priceLabel: '₹995', reason: 'Centella Asiatica calms redness and repairs damaged skin barrier.', rating: 4.5 },
  { name: 'Mamaearth Oil-Free Moisturiser', brand: 'Mamaearth', type: 'moisturizer', price: 349, priceLabel: '₹349', reason: 'Lightweight, non-comedogenic gel moisturiser ideal for oily skin.', rating: 4.3 },
  { name: 'Dot & Key 2% Alpha Hydroxy Acid Moisturiser', brand: 'Dot & Key', type: 'moisturizer', price: 649, priceLabel: '₹649', reason: 'AHA-enriched moisturiser gently exfoliates and hydrates.', rating: 4.5 },
  { name: 'Plum Chamomile & Turmeric Body Lotion', brand: 'Plum', type: 'moisturizer', price: 549, priceLabel: '₹549', reason: 'Soothes irritated skin with natural plant extracts.', rating: 4.4 },
  { name: 'Neutrogena Hydro Boost Hydrating Face Gel', brand: 'Neutrogena', type: 'moisturizer', price: 649, priceLabel: '₹649', reason: 'Hyaluronic acid-infused gel provides lightweight hydration.', rating: 4.6 },
  { name: 'Mamaearth Mineral Sunscreen SPF 50', brand: 'Mamaearth', type: 'sunscreen', price: 429, priceLabel: '₹429', reason: 'Reef-safe mineral sunscreen with zinc oxide for daily protection.', rating: 4.4 },
  { name: 'Dot & Key Lightweight Matte Sunscreen SPF 50', brand: 'Dot & Key', type: 'sunscreen', price: 599, priceLabel: '₹599', reason: 'Non-greasy, invisible sunscreen perfect for oily skin.', rating: 4.5 },
  { name: 'Plum Watermelon Lightweight Sunscreen SPF 50', brand: 'Plum', type: 'sunscreen', price: 349, priceLabel: '₹349', reason: 'Budget-friendly broad spectrum protection with cooling effect.', rating: 4.3 },
  { name: 'The Derma Co Dewy Look Sunscreen SPF 50', brand: 'The Derma Co', type: 'sunscreen', price: 499, priceLabel: '₹499', reason: 'Leaves a dewy finish while protecting against UV damage.', rating: 4.4 },
];

const SKIN_FILTER_TABS = ['All', 'Cleansers', 'Serums', 'Moisturisers', 'Sunscreens'];

function ProductCard({ product }: { product: StaticProduct }) {
  const stars = '⭐'.repeat(Math.round(product.rating));
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      cursor: 'pointer',
      transition: 'all 0.2s',
      height: '100%',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,85,247,0.4)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{product.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{product.brand}</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{product.priceLabel}</div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{product.reason}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{stars}</span>
        <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>{product.rating}</span>
      </div>
      <button style={{
        width: '100%',
        padding: '9px 14px',
        background: 'rgba(168,85,247,0.15)',
        border: '1px solid rgba(168,85,247,0.3)',
        color: '#a855f7',
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: 'auto',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,85,247,0.25)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.5)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,85,247,0.15)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.3)';
        }}
      >
        View on Nykaa ↗
      </button>
    </div>
  );
}

export default function Products() {
  const [history] = useLocalStorage<HistoryEntry[]>('roop_history', []);
  const [activeFilter, setActiveFilter] = useState('All');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const latest = history[0];
  const skinType = latest?.analysis.skinType ?? 'combination';

  if (!latest) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">🧴</div>
          <h3>No Scan Yet</h3>
          <p>Run a Glow Score scan to get AI-recommended skincare products.</p>
          <button className="btn-glow">Start Glow Scan</button>
        </div>
      </AppLayout>
    );
  }

  const filterType = activeFilter === 'All' ? null : activeFilter.toLowerCase().replace('iser', 'izer');
  const priceMin = PRICE_RANGES.find(p => p.key === priceRange)?.min ?? 0;
  const priceMax = PRICE_RANGES.find(p => p.key === priceRange)?.max ?? Infinity;

  const filtered = STATIC_SKIN_PRODUCTS.filter(p => {
    if (filterType && !p.type.includes(filterType)) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="page-products fade-in">
        <div className="products-header">
          <span className="page-eyebrow">Curated For Your Skin</span>
          <h1 className="products-title">
            Ethereal <span className="gradient-text">Selection</span>
          </h1>
          <p className="products-subtitle">
            AI-recommended products tailored to your {skinType} skin profile.
          </p>
        </div>

        {/* Search bar */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
          {SKIN_FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: '9px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                border: `1px solid ${activeFilter === tab ? '#a855f7' : 'var(--border)'}`,
                background: activeFilter === tab ? 'rgba(168,85,247,0.15)' : 'transparent',
                color: activeFilter === tab ? '#a855f7' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Price range filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
          {PRICE_RANGES.map(p => (
            <button
              key={p.key}
              onClick={() => setPriceRange(p.key)}
              style={{
                padding: '9px 16px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: `1px solid ${priceRange === p.key ? '#f59e0b' : 'var(--border)'}`,
                background: priceRange === p.key ? 'rgba(245,158,11,0.15)' : 'transparent',
                color: priceRange === p.key ? '#f59e0b' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No products match your filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {filtered.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
