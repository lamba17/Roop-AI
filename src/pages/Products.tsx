import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry, GlamHistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';

/* ── Skin (Glow) constants ───────────────────────────────────────────── */
const SKIN_FILTER_TABS = ['All', 'Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Toner', 'Eye Cream'];

const SKIN_TYPE_COLOR: Record<string, string> = {
  cleanser:    '#06b6d4',
  serum:       '#a855f7',
  moisturizer: '#22c55e',
  sunscreen:   '#f59e0b',
  toner:       '#ec4899',
  'eye cream': '#6366f1',
};

const SKIN_TYPE_IMAGE: Record<string, string> = {
  cleanser:    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=85&fit=crop',
  serum:       'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=85&fit=crop',
  moisturizer: 'https://images.unsplash.com/photo-1607602132700-068258431c7c?w=500&q=85&fit=crop',
  sunscreen:   'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=85&fit=crop',
  toner:       'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&q=85&fit=crop',
  'eye cream': 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=85&fit=crop',
};

const SKIN_TYPE_PRICE: Record<string, string> = {
  cleanser:    '₹349–₹799',
  serum:       '₹599–₹1,499',
  moisturizer: '₹399–₹999',
  sunscreen:   '₹349–₹1,899',
  toner:       '₹299–₹699',
  'eye cream': '₹595–₹1,299',
};

/* ── Makeup (Glam) constants ─────────────────────────────────────────── */
const MAKEUP_FILTER_TABS = ['All', 'Foundation', 'Concealer', 'Eyes', 'Lips', 'Blush', 'Highlighter', 'Powder'];

const MAKEUP_TYPE_COLOR: Record<string, string> = {
  foundation:     '#f59e0b',
  concealer:      '#ec4899',
  powder:         '#a855f7',
  blush:          '#f43f5e',
  highlighter:    '#eab308',
  contour:        '#92400e',
  primer:         '#06b6d4',
  'setting spray':'#8b5cf6',
  eyeshadow:      '#6366f1',
  eyeliner:       '#1e293b',
  mascara:        '#334155',
  brow:           '#92400e',
  lipstick:       '#e11d48',
  gloss:          '#f472b6',
  balm:           '#fb923c',
};

const MAKEUP_TYPE_IMAGE: Record<string, string> = {
  foundation:     'https://images.unsplash.com/photo-1631214524020-3c69d08b3b10?w=500&q=85&fit=crop',
  concealer:      'https://images.unsplash.com/photo-1631214524020-3c69d08b3b10?w=500&q=85&fit=crop',
  powder:         'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  blush:          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  highlighter:    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  contour:        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  primer:         'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=85&fit=crop',
  'setting spray':'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=85&fit=crop',
  eyeshadow:      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  eyeliner:       'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  mascara:        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  brow:           'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  lipstick:       'https://images.unsplash.com/photo-1586495777744-4e6b8f5c4c5e?w=500&q=85&fit=crop',
  gloss:          'https://images.unsplash.com/photo-1586495777744-4e6b8f5c4c5e?w=500&q=85&fit=crop',
  balm:           'https://images.unsplash.com/photo-1586495777744-4e6b8f5c4c5e?w=500&q=85&fit=crop',
};

const MAKEUP_TYPE_PRICE: Record<string, string> = {
  foundation:     '₹399–₹1,299',
  concealer:      '₹349–₹899',
  powder:         '₹299–₹799',
  blush:          '₹349–₹999',
  highlighter:    '₹399–₹1,199',
  contour:        '₹349–₹999',
  primer:         '₹399–₹1,499',
  'setting spray':'₹299–₹799',
  eyeshadow:      '₹399–₹1,899',
  eyeliner:       '₹149–₹699',
  mascara:        '₹299–₹999',
  brow:           '₹199–₹699',
  lipstick:       '₹249–₹999',
  gloss:          '₹199–₹799',
  balm:           '₹149–₹499',
};

const MAKEUP_TYPE_EMOJI: Record<string, string> = {
  foundation: '🏅', concealer: '✨', powder: '🌸', blush: '🌹',
  highlighter: '⭐', contour: '🎨', primer: '🔮', 'setting spray': '💨',
  eyeshadow: '👁️', eyeliner: '✏️', mascara: '🪄', brow: '🖊️',
  lipstick: '💋', gloss: '💄', balm: '🫦',
};

const AFFILIATE_TAG = 'roopai03-21';

function buildLinks(name: string) {
  const query = encodeURIComponent(name);
  return {
    amazon: `https://www.amazon.in/s?k=${query}&tag=${AFFILIATE_TAG}`,
    nykaa:  `https://www.nykaa.com/search/result/?q=${query}`,
  };
}

/* ── Makeup filter group helper ──────────────────────────────────────── */
function matchesMakeupFilter(type: string, filter: string): boolean {
  if (filter === 'All') return true;
  const f = filter.toLowerCase();
  if (f === 'eyes') return ['eyeshadow', 'eyeliner', 'mascara', 'brow'].includes(type);
  if (f === 'lips') return ['lipstick', 'gloss', 'balm'].includes(type);
  return type === f;
}

/* ── Skin Products Section ───────────────────────────────────────────── */
function SkinProductsContent({ latest, activeFilter, t }: any) {
  const { products, glowScore, scores } = latest.analysis;
  const filtered = activeFilter === 'All'
    ? products
    : products.filter((p: any) => p.type.toLowerCase() === activeFilter.toLowerCase());

  const featured = products[0];
  const glowPoints = Math.round(products.length * 4 + (glowScore * 0.1));

  function matchScore(p: any): number {
    const base: Record<string, number> = {
      cleanser:    scores.acne,
      serum:       scores.skinTone,
      moisturizer: 100 - scores.texture + 20,
      sunscreen:   90,
      toner:       scores.texture,
      'eye cream': scores.darkCircles,
    };
    return Math.min(99, Math.max(72, Math.round((base[p.type] ?? 80) * 0.95 + 5)));
  }

  return (
    <div className="products-layout">
      <div className="products-grid-wrap">
        {filtered.length === 0 ? (
          <div className="products-empty">
            <p>No products in this category for your skin type.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p: any, i: number) => {
              const color = SKIN_TYPE_COLOR[p.type] ?? '#a855f7';
              const img   = SKIN_TYPE_IMAGE[p.type] ?? SKIN_TYPE_IMAGE['serum'];
              const price = SKIN_TYPE_PRICE[p.type] ?? '₹499–₹999';
              const links = buildLinks(p.name);
              const match = matchScore(p);
              const isTop = i === 0;

              return (
                <div key={i} className="product-card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: 12, left: 12, zIndex: 2,
                    background: isTop ? 'linear-gradient(135deg,#a855f7,#ec4899)' : 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(8px)', borderRadius: 20,
                    padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.5,
                  }}>
                    {isTop ? '✦ BEST MATCH' : `${match}% Match`}
                  </div>

                  <div style={{ width: '100%', height: 220, overflow: 'hidden', background: `${color}12`, flexShrink: 0 }}>
                    <img
                      src={img} alt={p.name} className="product-card-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = 'none';
                        const parent = el.parentElement;
                        if (parent) {
                          parent.style.display = 'flex'; parent.style.alignItems = 'center';
                          parent.style.justifyContent = 'center'; parent.style.fontSize = '52px';
                          parent.innerHTML = p.type === 'cleanser' ? '🧴' : p.type === 'serum' ? '💧' : p.type === 'moisturizer' ? '🫙' : p.type === 'sunscreen' ? '☀️' : p.type === 'toner' ? '🌿' : '👁️';
                        }
                      }}
                    />
                  </div>

                  <div className="product-info">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="product-type-badge" style={{ background: `${color}22`, color }}>{p.type.toUpperCase()}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{price}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= 4 ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                      <span style={{ fontSize: 11, color: 'var(--text-hint)', marginLeft: 4 }}>4.{(i % 3) + 6}</span>
                    </div>
                    <div className="product-name">{p.name}</div>
                    <p className="product-reason">{p.reason}</p>
                    <div className="product-actions">
                      <a href={links.amazon} target="_blank" rel="noreferrer noopener" className="product-buy-btn product-buy-amazon">{t.buyAmazon}</a>
                      <a href={links.nykaa} target="_blank" rel="noreferrer noopener" className="product-buy-btn product-buy-nykaa">{t.buyNykaa}</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="products-sidebar">
        {featured && (
          <div className="editors-choice-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src={SKIN_TYPE_IMAGE[featured.type] ?? SKIN_TYPE_IMAGE['serum']} alt={featured.name}
                style={{ width: '100%', height: 160, objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(135deg,#a855f7,#ec4899)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                ✦ Editor's Choice
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: 11, color: SKIN_TYPE_COLOR[featured.type] ?? '#a855f7', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{featured.type}</div>
              <div className="editors-name">{featured.name}</div>
              <p className="editors-reason">{featured.reason}</p>
              <a href={buildLinks(featured.name).amazon} target="_blank" rel="noreferrer noopener"
                className="btn-glow" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px' }}>
                Shop Now
              </a>
            </div>
          </div>
        )}

        <div className="routine-potential-card">
          <div className="section-label">Routine Potential</div>
          <div className="routine-potential-score">
            <span className="potential-num">+{glowPoints}</span>
            <span className="potential-label">Glow Points</span>
          </div>
          <p className="potential-desc">Using all recommended products consistently could boost your Glow Score by up to {glowPoints} points.</p>
          <div className="potential-bar-track">
            <div className="potential-bar-fill" style={{ width: `${Math.min(glowPoints, 100)}%` }} />
          </div>
        </div>

        <div className="skin-profile-card">
          <div className="section-label">Your Skin Profile</div>
          <div className="skin-profile-row"><span>Type</span><span className="skin-badge skin-badge-purple">{latest.analysis.skinType}</span></div>
          <div className="skin-profile-row"><span>Oiliness</span><span className="skin-badge skin-badge-cyan">{latest.analysis.oiliness}</span></div>
          <div className="skin-profile-row"><span>Glow Score</span><span className="skin-badge skin-badge-gold">{glowScore}/100</span></div>
        </div>
      </div>
    </div>
  );
}

/* ── Makeup Products Section ─────────────────────────────────────────── */
function MakeupProductsContent({ latest, activeFilter, t }: { latest: GlamHistoryEntry; activeFilter: string; t: any }) {
  const { products, glamScore, makeupStyle, currentLook } = latest.analysis;
  const filtered = products.filter((p: any) => matchesMakeupFilter(p.type, activeFilter));
  const featured = products[0];
  const glamPoints = Math.round(products.length * 5 + glamScore * 0.15);

  return (
    <div className="products-layout">
      <div className="products-grid-wrap">
        {filtered.length === 0 ? (
          <div className="products-empty">
            <p>No makeup products in this category for your look.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p: any, i: number) => {
              const color = MAKEUP_TYPE_COLOR[p.type] ?? '#ec4899';
              const img   = MAKEUP_TYPE_IMAGE[p.type] ?? MAKEUP_TYPE_IMAGE['lipstick'];
              const price = MAKEUP_TYPE_PRICE[p.type] ?? '₹299–₹999';
              const emoji = MAKEUP_TYPE_EMOJI[p.type] ?? '💄';
              const links = buildLinks(p.name);
              const isTop = i === 0;
              const match = Math.min(99, Math.max(70, glamScore - (i * 3) + 10));

              return (
                <div key={i} className="product-card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: 12, left: 12, zIndex: 2,
                    background: isTop ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(8px)', borderRadius: 20,
                    padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.5,
                  }}>
                    {isTop ? '💄 BEST PICK' : `${match}% Match`}
                  </div>

                  <div style={{ width: '100%', height: 220, overflow: 'hidden', background: `${color}15`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <img
                      src={img} alt={p.name} className="product-card-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                      onError={e => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = 'none';
                        const parent = el.parentElement;
                        if (parent) { parent.style.fontSize = '52px'; parent.innerHTML = emoji; }
                      }}
                    />
                    {/* Shade indicator if present */}
                    {p.shade && (
                      <div style={{
                        position: 'absolute', bottom: 10, right: 10, zIndex: 2,
                        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                        borderRadius: 12, padding: '3px 10px',
                        fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: 0.5,
                      }}>
                        {p.shade}
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="product-type-badge" style={{ background: `${color}22`, color }}>{p.type.toUpperCase()}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{price}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= 4 ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                      <span style={{ fontSize: 11, color: 'var(--text-hint)', marginLeft: 4 }}>4.{(i % 3) + 6}</span>
                    </div>
                    <div className="product-name">{p.name}</div>
                    <p className="product-reason">{p.reason}</p>
                    <div className="product-actions">
                      <a href={links.amazon} target="_blank" rel="noreferrer noopener" className="product-buy-btn product-buy-amazon">{t.buyAmazon}</a>
                      <a href={links.nykaa} target="_blank" rel="noreferrer noopener" className="product-buy-btn product-buy-nykaa">{t.buyNykaa}</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="products-sidebar">
        {featured && (
          <div className="editors-choice-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src={MAKEUP_TYPE_IMAGE[featured.type] ?? MAKEUP_TYPE_IMAGE['lipstick']} alt={featured.name}
                style={{ width: '100%', height: 160, objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(135deg,#ec4899,#a855f7)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                💄 Top Pick
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: 11, color: MAKEUP_TYPE_COLOR[featured.type] ?? '#ec4899', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{featured.type}</div>
              <div className="editors-name">{featured.name}</div>
              <p className="editors-reason">{featured.reason}</p>
              <a href={buildLinks(featured.name).nykaa} target="_blank" rel="noreferrer noopener"
                className="btn-glow" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px', background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                Shop Now
              </a>
            </div>
          </div>
        )}

        {/* Glam potential */}
        <div className="routine-potential-card">
          <div className="section-label">Glam Potential</div>
          <div className="routine-potential-score">
            <span className="potential-num" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>+{glamPoints}</span>
            <span className="potential-label">Glam Points</span>
          </div>
          <p className="potential-desc">Using all recommended makeup products could boost your Glam Score by up to {glamPoints} points.</p>
          <div className="potential-bar-track">
            <div className="potential-bar-fill" style={{ width: `${Math.min(glamPoints, 100)}%`, background: 'linear-gradient(90deg,#ec4899,#a855f7)' }} />
          </div>
        </div>

        {/* Glam profile */}
        <div className="skin-profile-card">
          <div className="section-label">Your Glam Profile</div>
          <div className="skin-profile-row"><span>Style</span><span className="skin-badge skin-badge-purple">{makeupStyle}</span></div>
          <div className="skin-profile-row"><span>Current Look</span><span className="skin-badge skin-badge-cyan">{currentLook}</span></div>
          <div className="skin-profile-row"><span>Glam Score</span><span className="skin-badge skin-badge-gold">{glamScore}/100</span></div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function Products() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = T[lang];

  const [history] = useLocalStorage<HistoryEntry[]>('roop_history', []);
  const [glamHistory] = useLocalStorage<GlamHistoryEntry[]>('roop_glam_history', []);
  const [scoreMode] = useLocalStorage<'glow' | 'glam' | null>('roop_score_mode', null);

  const [productTab, setProductTab] = useState<'skin' | 'makeup'>(scoreMode === 'glam' ? 'makeup' : 'skin');
  const [activeFilter, setActiveFilter] = useState('All');

  const latestSkin = history[0];
  const latestGlam = glamHistory[0];

  const hasAnything = latestSkin || latestGlam;

  if (!hasAnything) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">🛍️</div>
          <h3>No Products Yet</h3>
          <p>Complete a skin or makeup analysis to unlock your personalised product recommendations.</p>
          <button onClick={() => navigate('/scan')} className="btn-glow">Start Analysis</button>
        </div>
      </AppLayout>
    );
  }

  /* If user only has glam history, default to makeup tab */
  const effectiveTab = (productTab === 'skin' && !latestSkin && latestGlam) ? 'makeup'
    : (productTab === 'makeup' && !latestGlam && latestSkin) ? 'skin'
    : productTab;

  const filterTabs = effectiveTab === 'makeup' ? MAKEUP_FILTER_TABS : SKIN_FILTER_TABS;

  function handleTabSwitch(tab: 'skin' | 'makeup') {
    setProductTab(tab);
    setActiveFilter('All');
  }

  const isGlam = effectiveTab === 'makeup';

  return (
    <AppLayout>
      <div className="page-products fade-in">
        {/* Header */}
        <div className="products-header">
          <span className="page-eyebrow">{isGlam ? 'Curated For Your Look' : 'Curated For Your Skin'}</span>
          <h1 className="products-title">
            {isGlam ? 'Makeup' : 'Ethereal'} <span className="gradient-text">{isGlam ? 'Arsenal' : 'Selection'}</span>
          </h1>
          <p className="products-subtitle">
            {isGlam
              ? `AI-recommended makeup products matched to your ${latestGlam?.analysis.makeupStyle ?? ''} style.`
              : `AI-recommended products tailored to your ${latestSkin?.analysis.skinType ?? ''} skin profile.`}
          </p>
        </div>

        {/* Tab switcher — only shown when no mode is locked */}
        {!scoreMode && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button
              onClick={() => handleTabSwitch('skin')}
              disabled={!latestSkin}
              style={{
                padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: latestSkin ? 'pointer' : 'not-allowed',
                border: `1.5px solid ${effectiveTab === 'skin' ? '#a855f7' : 'var(--border)'}`,
                background: effectiveTab === 'skin' ? 'rgba(168,85,247,0.12)' : 'transparent',
                color: effectiveTab === 'skin' ? '#a855f7' : 'var(--text-muted)',
                opacity: latestSkin ? 1 : 0.4,
                transition: 'all 0.2s',
              }}
            >
              🌿 Skin Products
            </button>
            <button
              onClick={() => handleTabSwitch('makeup')}
              disabled={!latestGlam}
              style={{
                padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: latestGlam ? 'pointer' : 'not-allowed',
                border: `1.5px solid ${effectiveTab === 'makeup' ? '#ec4899' : 'var(--border)'}`,
                background: effectiveTab === 'makeup' ? 'rgba(236,72,153,0.12)' : 'transparent',
                color: effectiveTab === 'makeup' ? '#ec4899' : 'var(--text-muted)',
                opacity: latestGlam ? 1 : 0.4,
                transition: 'all 0.2s',
              }}
            >
              💄 Makeup Products
            </button>
          </div>
        )}

        {/* Category filter tabs */}
        <div className="products-filters">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* No-analysis-for-this-tab state */}
        {effectiveTab === 'skin' && !latestSkin && (
          <div className="page-empty" style={{ marginTop: 40 }}>
            <div className="page-empty-icon">🌿</div>
            <h3>No Skin Analysis Yet</h3>
            <p>Run a Glow Score scan to see your personalised skincare recommendations.</p>
            <button onClick={() => navigate('/scan')} className="btn-glow">Start Glow Scan</button>
          </div>
        )}

        {effectiveTab === 'makeup' && !latestGlam && (
          <div className="page-empty" style={{ marginTop: 40 }}>
            <div className="page-empty-icon">💄</div>
            <h3>No Glam Analysis Yet</h3>
            <p>Run a Glam Score scan to see your personalised makeup recommendations.</p>
            <button onClick={() => navigate('/scan')} className="btn-glow">Start Glam Scan</button>
          </div>
        )}

        {/* Content */}
        <>
          {effectiveTab === 'skin' && latestSkin && (
            <SkinProductsContent latest={latestSkin} activeFilter={activeFilter} t={t} />
          )}
          {effectiveTab === 'makeup' && latestGlam && (
            <MakeupProductsContent latest={latestGlam} activeFilter={activeFilter} t={t} />
          )}
        </>
      </div>
    </AppLayout>
  );
}
