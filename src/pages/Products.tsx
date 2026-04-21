import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';
import { useAuth } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];

const FILTER_TABS = ['All', 'Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Toner', 'Eye Cream'];

const TYPE_COLOR: Record<string, string> = {
  cleanser:    '#06b6d4',
  serum:       '#a855f7',
  moisturizer: '#22c55e',
  sunscreen:   '#f59e0b',
  toner:       '#ec4899',
  'eye cream': '#6366f1',
};

// Real product photos from Unsplash — one per type
const TYPE_IMAGE: Record<string, string> = {
  cleanser:    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=85&fit=crop',
  serum:       'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=85&fit=crop',
  moisturizer: 'https://images.unsplash.com/photo-1607602132700-068258431c7c?w=500&q=85&fit=crop',
  sunscreen:   'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=85&fit=crop',
  toner:       'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&q=85&fit=crop',
  'eye cream': 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=85&fit=crop',
};

const TYPE_PRICE: Record<string, string> = {
  cleanser:    '₹349–₹799',
  serum:       '₹599–₹1,499',
  moisturizer: '₹399–₹999',
  sunscreen:   '₹349–₹1,899',
  toner:       '₹299–₹699',
  'eye cream': '₹595–₹1,299',
};

const AFFILIATE_TAG = 'roopai03-21';

function buildLinks(name: string) {
  const query = encodeURIComponent(name);
  return {
    amazon: `https://www.amazon.in/s?k=${query}&tag=${AFFILIATE_TAG}`,
    nykaa:  `https://www.nykaa.com/search/result/?q=${query}`,
  };
}

function matchScore(p: any, analysis: any): number {
  const base: Record<string, number> = {
    cleanser:    analysis.scores.acne,
    serum:       analysis.scores.skinTone,
    moisturizer: 100 - analysis.scores.texture + 20,
    sunscreen:   90,
    toner:       analysis.scores.texture,
    'eye cream': analysis.scores.darkCircles,
  };
  return Math.min(99, Math.max(72, Math.round((base[p.type] ?? 80) * 0.95 + 5)));
}

function ProductsContent({ latest, activeFilter, t }: any) {
  const { products, glowScore } = latest.analysis;
  const filtered = activeFilter === 'All'
    ? products
    : products.filter((p: any) => p.type.toLowerCase() === activeFilter.toLowerCase());

  const featured = products[0];
  const glowPoints = Math.round(products.length * 4 + (glowScore * 0.1));

  return (
    <div className="products-layout">
      {/* Product Grid */}
      <div className="products-grid-wrap">
        {filtered.length === 0 ? (
          <div className="products-empty">
            <p>No products in this category for your skin type.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p: any, i: number) => {
              const color  = TYPE_COLOR[p.type]  ?? '#a855f7';
              const img    = TYPE_IMAGE[p.type]  ?? TYPE_IMAGE['serum'];
              const price  = TYPE_PRICE[p.type]  ?? '₹499–₹999';
              const links  = buildLinks(p.name);
              const match  = matchScore(p, latest.analysis);
              const isTop  = i === 0;

              return (
                <div key={i} className="product-card" style={{ position: 'relative', overflow: 'hidden' }}>
                  {/* Match badge */}
                  <div style={{
                    position: 'absolute', top: 12, left: 12, zIndex: 2,
                    background: isTop ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(8px)', borderRadius: 20,
                    padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.5,
                  }}>
                    {isTop ? '✦ BEST MATCH' : `${match}% Match`}
                  </div>

                  {/* Product image */}
                  <div style={{ width: '100%', height: 220, overflow: 'hidden', background: `${color}12`, flexShrink: 0 }}>
                    <img
                      src={img}
                      alt={p.name}
                      className="product-card-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = 'none';
                        const parent = el.parentElement;
                        if (parent) {
                          parent.style.display = 'flex';
                          parent.style.alignItems = 'center';
                          parent.style.justifyContent = 'center';
                          parent.style.fontSize = '52px';
                          parent.innerHTML = p.type === 'cleanser' ? '🧴' : p.type === 'serum' ? '💧' : p.type === 'moisturizer' ? '🫙' : p.type === 'sunscreen' ? '☀️' : p.type === 'toner' ? '🌿' : '👁️';
                        }
                      }}
                    />
                  </div>

                  <div className="product-info">
                    {/* Type + price row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="product-type-badge" style={{ background: `${color}22`, color }}>
                        {p.type.toUpperCase()}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{price}</span>
                    </div>

                    {/* Stars */}
                    <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= 4 ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                      <span style={{ fontSize: 11, color: 'var(--text-hint)', marginLeft: 4 }}>4.{Math.floor(Math.random() * 3) + 6}</span>
                    </div>

                    <div className="product-name">{p.name}</div>
                    <p className="product-reason">{p.reason}</p>

                    <div className="product-actions">
                      <a href={links.amazon} target="_blank" rel="noreferrer noopener" className="product-buy-btn product-buy-amazon">
                        {t.buyAmazon}
                      </a>
                      <a href={links.nykaa} target="_blank" rel="noreferrer noopener" className="product-buy-btn product-buy-nykaa">
                        {t.buyNykaa}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="products-sidebar">
        {/* Editor's Choice */}
        {featured && (
          <div className="editors-choice-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={TYPE_IMAGE[featured.type] ?? TYPE_IMAGE['serum']}
                alt={featured.name}
                style={{ width: '100%', height: 160, objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(135deg,#a855f7,#ec4899)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                ✦ Editor's Choice
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: 11, color: TYPE_COLOR[featured.type] ?? '#a855f7', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{featured.type}</div>
              <div className="editors-name">{featured.name}</div>
              <p className="editors-reason">{featured.reason}</p>
              <a href={buildLinks(featured.name).amazon} target="_blank" rel="noreferrer noopener"
                className="btn-glow" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px' }}>
                Shop Now
              </a>
            </div>
          </div>
        )}

        {/* Routine Potential */}
        <div className="routine-potential-card">
          <div className="section-label">Routine Potential</div>
          <div className="routine-potential-score">
            <span className="potential-num">+{glowPoints}</span>
            <span className="potential-label">Glow Points</span>
          </div>
          <p className="potential-desc">
            Using all recommended products consistently could boost your Glow Score by up to {glowPoints} points.
          </p>
          <div className="potential-bar-track">
            <div className="potential-bar-fill" style={{ width: `${Math.min(glowPoints, 100)}%` }} />
          </div>
        </div>

        {/* Skin profile */}
        <div className="skin-profile-card">
          <div className="section-label">Your Skin Profile</div>
          <div className="skin-profile-row">
            <span>Type</span>
            <span className="skin-badge skin-badge-purple">{latest.analysis.skinType}</span>
          </div>
          <div className="skin-profile-row">
            <span>Oiliness</span>
            <span className="skin-badge skin-badge-cyan">{latest.analysis.oiliness}</span>
          </div>
          <div className="skin-profile-row">
            <span>Glow Score</span>
            <span className="skin-badge skin-badge-gold">{glowScore}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = T[lang];
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user ?? null);
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);
  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);
  const [activeFilter, setActiveFilter] = useState('All');
  const latest = history[0];

  if (!latest) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">🛍️</div>
          <h3>No Products Yet</h3>
          <p>Complete a skin analysis to unlock your personalised product recommendations.</p>
          <button onClick={() => navigate('/scan')} className="btn-glow">
            Start Analysis
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => { setShowPremium(false); refreshPremium(); }}
        />
      )}

      <div className="page-products fade-in">
        {/* Header */}
        <div className="products-header">
          <span className="page-eyebrow">Curated For Your Skin</span>
          <h1 className="products-title">
            Ethereal <span className="gradient-text">Selection</span>
          </h1>
          <p className="products-subtitle">
            AI-recommended products tailored to your {latest.analysis.skinType} skin profile.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="products-filters">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {!hasFullAccess ? (
          <div className="locked-section">
            {/* Blurred preview */}
            <div className="locked-blur-preview" aria-hidden="true">
              <ProductsContent latest={latest} activeFilter={activeFilter} setActiveFilter={setActiveFilter} t={t} />
            </div>

            {/* Lock overlay */}
            <div className="locked-overlay">
              <div className="locked-overlay-inner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                  Unlock Your Product Picks
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                  Get your personalised product recommendations with Nykaa &amp; Amazon links — all matched to your skin type.
                </p>
                <button
                  onClick={() => setShowPremium(true)}
                  className="btn-glow"
                  style={{ justifyContent: 'center', fontSize: 14, padding: '12px 28px' }}
                >
                  🚀 Try Full Access — ₹25 for 7 days
                </button>
                <p style={{ fontSize: 11, color: 'var(--text-hint)', marginTop: 10 }}>
                  Then just ₹49/month · Cancel anytime · No surprises
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ProductsContent latest={latest} activeFilter={activeFilter} setActiveFilter={setActiveFilter} t={t} />
        )}
      </div>
    </AppLayout>
  );
}
