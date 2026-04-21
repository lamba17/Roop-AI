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

function ProductsContent({ latest, activeFilter, t }: any) {
  const { products } = latest.analysis;
  const filtered = activeFilter === 'All'
    ? products
    : products.filter((p: any) => p.type.toLowerCase() === activeFilter.toLowerCase());

  const featured = products[0];
  const glowPoints = Math.round(products.length * 4 + (latest.analysis.glowScore * 0.1));

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
              const color = TYPE_COLOR[p.type] ?? '#a855f7';
              const links = buildLinks(p.name);
              return (
                <div key={i} className="product-card">
                  <div className="product-img-wrap" style={{ background: `${color}18` }}>
                    <div className="product-img-placeholder" style={{ color }}>
                      {p.type === 'cleanser' ? '🧴' :
                       p.type === 'serum' ? '💉' :
                       p.type === 'moisturizer' ? '💧' :
                       p.type === 'sunscreen' ? '☀️' :
                       p.type === 'toner' ? '🌿' :
                       p.type === 'eye cream' ? '👁️' : '✨'}
                    </div>
                  </div>
                  <div className="product-info">
                    <span className="product-type-badge" style={{ background: `${color}22`, color }}>
                      {p.type}
                    </span>
                    <div className="product-name">{p.name}</div>
                    <p className="product-reason">{p.reason}</p>
                    <div className="product-actions">
                      <a
                        href={links.amazon}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="product-buy-btn product-buy-amazon"
                      >
                        {t.buyAmazon}
                      </a>
                      <a
                        href={links.nykaa}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="product-buy-btn product-buy-nykaa"
                      >
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
          <div className="editors-choice-card">
            <div className="editors-badge">✦ Editor's Choice</div>
            <div className="editors-img-wrap">
              <div className="editors-img-placeholder">
                {featured.type === 'sunscreen' ? '☀️' : featured.type === 'serum' ? '💉' : '✨'}
              </div>
            </div>
            <div className="editors-name">{featured.name}</div>
            <div className="editors-type" style={{ color: TYPE_COLOR[featured.type] ?? '#a855f7' }}>
              {featured.type}
            </div>
            <p className="editors-reason">{featured.reason}</p>
            <a
              href={buildLinks(featured.name).amazon}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-glow"
              style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px' }}
            >
              Shop Now
            </a>
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
            <div
              className="potential-bar-fill"
              style={{ width: `${Math.min(glowPoints, 100)}%` }}
            />
          </div>
        </div>

        {/* Skin profile */}
        <div className="skin-profile-card">
          <div className="section-label">Your Skin Profile</div>
          <div className="skin-profile-row">
            <span>Type</span>
            <span className="skin-badge skin-badge-purple">
              {latest.analysis.skinType}
            </span>
          </div>
          <div className="skin-profile-row">
            <span>Oiliness</span>
            <span className="skin-badge skin-badge-cyan">
              {latest.analysis.oiliness}
            </span>
          </div>
          <div className="skin-profile-row">
            <span>Glow Score</span>
            <span className="skin-badge skin-badge-gold">
              {latest.analysis.glowScore}/100
            </span>
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
          <button onClick={() => navigate('/')} className="btn-glow">
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
