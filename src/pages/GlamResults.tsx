import { useLocation, useNavigate } from 'react-router-dom';
import type { GlamAnalysis, GlamScores } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import MakeupArtistFinder from '../components/MakeupArtistFinder';
import PremiumModal from '../components/PremiumModal';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];
import {
  BRAND_LABELS, BRAND_COLORS, PRICE_RANGE,
  getShadeRecommendation, getDepthLabel, getNykaaLink, getAmazonLink,
  type FoundationBrand, type Undertone,
} from '../data/foundationShades';

/* ── Accent tokens (same in both themes) ─────────────────────────────── */
const PRIMARY     = '#bd9dff';
const PRIMARY_DIM = '#8a4cfc';
const SECONDARY   = '#ff6a9f';
const NEON_SHADOW = '0 0 40px -5px rgba(189, 157, 255, 0.08)';

const fontHeadline: React.CSSProperties = { fontFamily: "'Epilogue', system-ui, sans-serif" };
const fontBody: React.CSSProperties     = { fontFamily: "'Manrope', system-ui, sans-serif" };

/* ── Theme-aware color tokens ─────────────────────────────────────────── */
interface GlamColors {
  bg:       string;
  card:     React.CSSProperties;
  elevated: string;
  cardTop:  string;
  text:     string;
  muted:    string;
  outline:  string;
}

function useGlamColors(isDark: boolean): GlamColors {
  return isDark
    ? {
        bg:       '#120b1b',
        card:     { background: 'rgba(43,33,56,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' },
        elevated: '#251b31',
        cardTop:  '#2b2138',
        text:     '#eee1f8',
        muted:    '#b2a7bd',
        outline:  'rgba(77,68,87,0.5)',
      }
    : {
        bg:       'var(--bg-primary)',
        card:     { background: 'var(--bg-card)' },
        elevated: 'var(--bg-elevated)',
        cardTop:  'var(--bg-elevated)',
        text:     'var(--text-primary)',
        muted:    'var(--text-muted)',
        outline:  'var(--border)',
      };
}

/* ── Animated glam score ring ────────────────────────────────────────── */
function GlamRing({ score, textColor, trackColor }: { score: number; textColor: string; trackColor: string }) {
  const [displayed, setDisplayed] = useState(0);
  const r = 120, size = 256, cx = 128, cy = 128;
  const circ = 2 * Math.PI * r;
  const dash = (displayed / 100) * circ;

  useEffect(() => {
    setDisplayed(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const p = Math.min((Date.now() - start) / 1400, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(e * score));
      if (p >= 1) clearInterval(tick);
    }, 16);
    return () => clearInterval(tick);
  }, [score]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${SECONDARY}18 0%, ${PRIMARY}10 40%, transparent 70%)`, pointerEvents: 'none' }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'relative', zIndex: 1 }}>
        <defs>
          <linearGradient id="glamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={PRIMARY} />
            <stop offset="100%" stopColor={SECONDARY} />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={8} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#glamGrad)" strokeWidth={12} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)' }}
        />
        <text x={cx} y={cy - 14} textAnchor="middle" fill={textColor} fontSize="72" fontWeight="900" style={{ ...fontHeadline }}>{displayed}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill={SECONDARY} fontSize="11" fontWeight="700" letterSpacing="3" style={{ ...fontBody }}>GLAM SCORE</text>
        <text x={cx} y={cy + 38} textAnchor="middle" fill={PRIMARY} fontSize="12" fontWeight="600" letterSpacing="1" style={{ ...fontBody }}>
          {score >= 80 ? 'Elite Level' : score >= 65 ? 'Pro Level' : score >= 50 ? 'Rising Star' : 'Developing'}
        </text>
      </svg>
    </div>
  );
}

/* ── Animated score bar ──────────────────────────────────────────────── */
function AnimatedBar({ score, color, delay = 0, trackColor }: { score: number; color: string; delay?: number; trackColor: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay + 200);
    return () => clearTimeout(t);
  }, [score, delay]);
  return (
    <div style={{ height: 8, background: trackColor, borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${width}%`,
        background: color, borderRadius: 999,
        transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${delay}ms`,
        boxShadow: `0 0 10px ${color}66`,
      }} />
    </div>
  );
}

function ScoreRow({ label, score, color, delay = 0, colors }: { label: string; score: number; color: string; delay?: number; colors: GlamColors }) {
  const applied = score > 0;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ ...fontBody, fontSize: 15, fontWeight: 700, color: colors.text }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            ...fontBody, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
            padding: '2px 8px', borderRadius: 999,
            background: applied ? `${PRIMARY}18` : `${colors.outline}30`,
            color: applied ? PRIMARY : colors.outline,
          }}>
            {applied ? '✓ Applied' : '✕ None'}
          </span>
          <span style={{ ...fontHeadline, fontSize: 18, fontWeight: 900, color }}>{score}%</span>
        </div>
      </div>
      <AnimatedBar score={score} color={color} delay={delay} trackColor={colors.cardTop} />
    </div>
  );
}

/* ── Section heading ─────────────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...fontBody, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: SECONDARY, marginBottom: 16 }}>
      {children}
    </div>
  );
}

/* ── Glass card wrapper ──────────────────────────────────────────────── */
function GlassCard({ children, style, colors }: { children: React.ReactNode; style?: React.CSSProperties; colors: GlamColors }) {
  return (
    <div style={{
      ...colors.card, borderRadius: 20, padding: '28px 28px', marginBottom: 16,
      boxShadow: NEON_SHADOW, border: `1px solid ${colors.outline}`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Foundation Shade Finder ─────────────────────────────────────────── */
const BRANDS: FoundationBrand[] = ['maybelline', 'loreal', 'lakme', 'myglamm', 'faces', 'nykaa'];

function FoundationShadeSection({ depthScore, undertone, colors }: { depthScore: number; undertone: Undertone; colors: GlamColors }) {
  const shades = getShadeRecommendation(depthScore, undertone);
  if (!shades) return null;
  const depthLabel = getDepthLabel(depthScore);
  const undertoneLabel = undertone.charAt(0).toUpperCase() + undertone.slice(1);

  return (
    <GlassCard colors={colors} style={{ border: `1px solid rgba(245,158,11,0.2)`, background: 'rgba(245,158,11,0.03)' }}>
      <SectionHeading>Foundation Shade Matches</SectionHeading>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={{ ...fontBody, fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 999, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
          {depthLabel} · Depth {depthScore}/10
        </span>
        <span style={{ ...fontBody, fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 999, background: `${PRIMARY}18`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}>
          {undertoneLabel} Undertone
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {BRANDS.map((brand) => {
          const shade = shades[brand];
          const color = BRAND_COLORS[brand];
          return (
            <div key={brand} style={{ background: colors.elevated, border: `1px solid ${color}30`, borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ ...fontBody, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color, marginBottom: 4 }}>{BRAND_LABELS[brand]}</div>
              <div style={{ ...fontHeadline, fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 2 }}>{shade}</div>
              <div style={{ ...fontBody, fontSize: 11, color: colors.muted, marginBottom: 12 }}>{PRICE_RANGE[brand]}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <a href={getNykaaLink(brand, shade)} target="_blank" rel="noreferrer noopener" style={{ ...fontBody, fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 999, textDecoration: 'none', background: `${SECONDARY}18`, color: SECONDARY, border: `1px solid ${SECONDARY}30` }}>
                  💄 Nykaa
                </a>
                <a href={getAmazonLink(brand, shade)} target="_blank" rel="noreferrer noopener" style={{ ...fontBody, fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 999, textDecoration: 'none', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
                  🛒 Amazon
                </a>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ ...fontBody, marginTop: 14, fontSize: 12, color: colors.muted, lineHeight: 1.6, fontStyle: 'italic' }}>
        💡 Always swatch on your jawline in natural light. Go one shade deeper for a sun-kissed finish.
      </p>
    </GlassCard>
  );
}

/* ── Product card ────────────────────────────────────────────────────── */
function GlamProductCard({ product, colors }: { product: { name: string; type: string; reason: string; amazonLink?: string; nykaaLink?: string }; colors: GlamColors }) {
  const typeColor = product.type === 'lipstick' || product.type === 'gloss' ? SECONDARY : PRIMARY;
  return (
    <div style={{
      background: colors.elevated, borderRadius: 16, padding: '18px 20px',
      border: `1px solid ${colors.outline}`, marginBottom: 10,
      display: 'flex', gap: 14, alignItems: 'flex-start',
      transition: 'transform 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.borderColor = `${PRIMARY}40`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.borderColor = colors.outline; }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${typeColor}18`, border: `1px solid ${typeColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
        {product.type === 'lipstick' || product.type === 'gloss' ? '💋' : product.type === 'eyeshadow' || product.type === 'eyeliner' || product.type === 'mascara' ? '👁' : '✨'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <div style={{ ...fontBody, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: typeColor, marginBottom: 2 }}>{product.type}</div>
            <div style={{ ...fontHeadline, fontSize: 15, fontWeight: 700, color: colors.text }}>{product.name}</div>
          </div>
        </div>
        <p style={{ ...fontBody, fontSize: 13, color: colors.muted, lineHeight: 1.5, margin: '6px 0 10px' }}>{product.reason}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {product.nykaaLink && (
            <a href={product.nykaaLink} target="_blank" rel="noreferrer noopener" style={{ ...fontBody, fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 999, textDecoration: 'none', background: `${SECONDARY}18`, color: SECONDARY, border: `1px solid ${SECONDARY}30` }}>
              💄 Nykaa
            </a>
          )}
          {product.amazonLink && (
            <a href={product.amazonLink} target="_blank" rel="noreferrer noopener" style={{ ...fontBody, fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 999, textDecoration: 'none', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
              🛒 Amazon
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────── */
export default function GlamResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const colors = useGlamColors(theme === 'dark');
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user ?? null);
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);

  const { analysis, imageUrl } = (location.state ?? {}) as { analysis: GlamAnalysis; imageUrl?: string };

  const [isWide, setIsWide] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  useEffect(() => {
    const handler = () => setIsWide(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (!analysis) {
    return (
      <AppLayout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
          <div style={{ ...fontBody, color: colors.muted, fontSize: 16 }}>No analysis found.</div>
          <button
            onClick={() => navigate('/')}
            style={{ ...fontBody, background: `linear-gradient(135deg, ${PRIMARY_DIM}, ${SECONDARY})`, color: '#fff', border: 'none', borderRadius: 999, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            ← Go Back
          </button>
        </div>
      </AppLayout>
    );
  }

  const s = analysis.scores;

  const FACE_ROWS: Array<{ label: string; key: keyof GlamScores; color: string }> = [
    { label: 'Foundation',  key: 'foundation',  color: PRIMARY },
    { label: 'Concealer',   key: 'concealer',   color: PRIMARY },
    { label: 'Powder',      key: 'powder',       color: '#f59e0b' },
    { label: 'Blush',       key: 'blush',        color: SECONDARY },
    { label: 'Highlighter', key: 'highlighter',  color: '#f59e0b' },
  ];
  const EYE_ROWS: Array<{ label: string; key: keyof GlamScores; color: string }> = [
    { label: 'Eyeshadow',     key: 'eyeshadow',    color: PRIMARY },
    { label: 'Eyeliner',      key: 'eyeliner',      color: '#6366f1' },
    { label: 'Mascara',       key: 'mascara',       color: PRIMARY },
    { label: 'Brow Products', key: 'browProducts',  color: '#6366f1' },
  ];
  const LIP_ROWS: Array<{ label: string; key: keyof GlamScores; color: string }> = [
    { label: 'Lipstick',  key: 'lipstick', color: SECONDARY },
    { label: 'Lip Gloss', key: 'gloss',    color: SECONDARY },
    { label: 'Lip Balm',  key: 'balm',     color: '#f59e0b' },
  ];

  return (
    <AppLayout>
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => { setShowPremium(false); refreshPremium(); }}
        />
      )}

      <div style={{ background: colors.bg, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient background glows */}
        <div style={{ position: 'fixed', top: '20%', left: '-5%', width: 400, height: 400, background: `${PRIMARY}0d`, borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '20%', right: '-5%', width: 400, height: 400, background: `${SECONDARY}0d`, borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 80px', position: 'relative', zIndex: 1 }}>

          {/* ── Page header ────────────────────────────────────────────── */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ ...fontBody, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: SECONDARY, marginBottom: 8 }}>
              AI Makeup Diagnosis
            </div>
            <h1 style={{ ...fontHeadline, fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: colors.text, margin: '0 0 8px', lineHeight: 1.1, letterSpacing: '-1px' }}>
              Your Glam <span style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Report</span>
            </h1>
            <p style={{ ...fontBody, fontSize: 16, color: colors.muted, margin: 0 }}>
              {analysis.currentLook} · <span style={{ color: PRIMARY }}>{analysis.makeupStyle} Style</span>
            </p>
          </div>

          {/* ── Dashboard grid: score ring + analysis ──────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: isWide ? 'clamp(260px, 35%, 340px) 1fr' : '1fr', gap: 16, marginBottom: 16, alignItems: 'start' }}>
            {/* Score ring card */}
            <GlassCard colors={colors} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, left: -40, width: 160, height: 160, background: `${PRIMARY_DIM}12`, borderRadius: '50%', filter: 'blur(60px)' }} />
              <div style={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, background: `${SECONDARY}10`, borderRadius: '50%', filter: 'blur(60px)' }} />
              {imageUrl && (
                <img src={imageUrl} alt="Glam selfie" style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, border: `2px solid ${PRIMARY}40`, boxShadow: `0 0 20px ${PRIMARY}30` }} />
              )}
              <GlamRing score={analysis.glamScore} textColor={colors.text} trackColor={colors.cardTop} />
              <p style={{ ...fontBody, fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 16, maxWidth: 200, lineHeight: 1.5 }}>
                Top performer for tonal balance &amp; technique.
              </p>
            </GlassCard>

            {/* Look analysis bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Face */}
              <GlassCard colors={colors} style={{ padding: '22px 24px' }}>
                <SectionHeading>Face Makeup</SectionHeading>
                {FACE_ROWS.map((r, i) => (
                  <ScoreRow key={r.key} label={r.label} score={s[r.key]} color={r.color} delay={i * 80} colors={colors} />
                ))}
              </GlassCard>

              {/* Eyes */}
              <GlassCard colors={colors} style={{ padding: '22px 24px' }}>
                <SectionHeading>Eye Makeup</SectionHeading>
                {EYE_ROWS.map((r, i) => (
                  <ScoreRow key={r.key} label={r.label} score={s[r.key]} color={r.color} delay={100 + i * 80} colors={colors} />
                ))}
              </GlassCard>
            </div>
          </div>

          {/* ── Premium-gated content ──────────────────────────────────── */}
          {!hasFullAccess ? (
            <div className="locked-section">
              {/* Blurred preview of locked content */}
              <div className="locked-blur-preview" aria-hidden="true">
                <GlassCard colors={colors} style={{ padding: '22px 24px' }}>
                  <SectionHeading>Lip Products</SectionHeading>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0 40px' }}>
                    {LIP_ROWS.map((r, i) => (
                      <ScoreRow key={r.key} label={r.label} score={s[r.key]} color={r.color} delay={200 + i * 80} colors={colors} />
                    ))}
                  </div>
                </GlassCard>
                <GlassCard colors={colors} style={{ background: `${PRIMARY}08`, border: `1px solid ${PRIMARY}20` }}>
                  <SectionHeading>AI Diagnosis</SectionHeading>
                  <p style={{ ...fontBody, fontSize: 15, color: colors.text, lineHeight: 1.7, margin: 0 }}>{analysis.report}</p>
                </GlassCard>
                <GlassCard colors={colors} style={{ background: `${PRIMARY}06`, border: `1px solid ${PRIMARY}18` }}>
                  <SectionHeading>{analysis.corrections.length} Things to Improve</SectionHeading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {analysis.corrections.slice(0, 2).map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${PRIMARY}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ ...fontHeadline, fontSize: 11, fontWeight: 900, color: PRIMARY }}>{i + 1}</span>
                        </div>
                        <p style={{ ...fontBody, margin: 0, fontSize: 13, color: colors.text, lineHeight: 1.5 }}>{c}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Lock overlay */}
              <div className="locked-overlay">
                <div className="locked-overlay-inner">
                  <div style={{ fontSize: 44, marginBottom: 12 }}>💄</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                    Unlock Your Full Glam Report
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.6, maxWidth: 300 }}>
                    Get your complete lip breakdown, AI diagnosis, pro corrections, foundation shade matches, product picks, and artist finder.
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
                    {['Lip Analysis', 'AI Diagnosis', 'Pro Corrections', 'Shade Finder', 'Product Picks', 'Artists'].map(f => (
                      <span key={f} style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(236,72,153,0.12)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.25)' }}>{f}</span>
                    ))}
                  </div>
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
            <>
              {/* Lip products — full width */}
              <GlassCard colors={colors} style={{ padding: '22px 24px' }}>
                <SectionHeading>Lip Products</SectionHeading>
                <div style={{ display: 'grid', gridTemplateColumns: isWide ? 'repeat(3, 1fr)' : '1fr', gap: '0 40px' }}>
                  {LIP_ROWS.map((r, i) => (
                    <ScoreRow key={r.key} label={r.label} score={s[r.key]} color={r.color} delay={200 + i * 80} colors={colors} />
                  ))}
                </div>
              </GlassCard>

              {/* AI Diagnosis */}
              <GlassCard colors={colors} style={{ background: `${PRIMARY}08`, border: `1px solid ${PRIMARY}20` }}>
                <SectionHeading>AI Diagnosis</SectionHeading>
                <p style={{ ...fontBody, fontSize: 15, color: colors.text, lineHeight: 1.7, margin: '0 0 12px' }}>{analysis.report}</p>
                <p style={{ ...fontBody, fontSize: 13, color: SECONDARY, fontStyle: 'italic', margin: 0 }}>{analysis.skinToneMatch}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  <span style={{ ...fontBody, fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 999, background: `${PRIMARY}18`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}>{analysis.currentLook}</span>
                  <span style={{ ...fontBody, fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 999, background: `${SECONDARY}18`, color: SECONDARY, border: `1px solid ${SECONDARY}30` }}>{analysis.makeupStyle} Style</span>
                  <span style={{ ...fontBody, fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 999, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>Overall: {s.overall}/100</span>
                </div>
              </GlassCard>

              {/* What's missing */}
              {analysis.missingElements.length > 0 && (
                <GlassCard colors={colors} style={{ background: `${SECONDARY}05`, border: `1px solid ${SECONDARY}25` }}>
                  <SectionHeading>Missing From Your Look</SectionHeading>
                  <p style={{ ...fontBody, fontSize: 14, color: colors.muted, marginBottom: 16, fontStyle: 'italic' }}>
                    "{analysis.missingElements.length > 1 ? 'Suggesting ' : 'Suggesting a '}
                    <span style={{ color: SECONDARY, fontWeight: 700 }}>{analysis.missingElements[0].split(' ').slice(0, 4).join(' ')}</span>
                    {' '}to complete your look."
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {analysis.missingElements.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ ...fontBody, fontSize: 12, fontWeight: 700, color: SECONDARY, background: `${SECONDARY}18`, border: `1px solid ${SECONDARY}30`, borderRadius: 6, padding: '2px 8px', flexShrink: 0, marginTop: 1 }}>✕</span>
                        <p style={{ ...fontBody, margin: 0, fontSize: 14, color: colors.text, lineHeight: 1.6 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Corrections */}
              <GlassCard colors={colors} style={{ background: `${PRIMARY}06`, border: `1px solid ${PRIMARY}18` }}>
                <SectionHeading>{analysis.corrections.length} Things to Improve</SectionHeading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {analysis.corrections.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${PRIMARY}18`, border: `1px solid ${PRIMARY}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ ...fontHeadline, fontSize: 12, fontWeight: 900, color: PRIMARY }}>{i + 1}</span>
                      </div>
                      <p style={{ ...fontBody, margin: 0, fontSize: 14, color: colors.text, lineHeight: 1.6, paddingTop: 4 }}>{c}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Pro tip */}
              <GlassCard colors={colors} style={{ background: `${PRIMARY}08`, border: `1px solid ${PRIMARY}25`, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${PRIMARY}18`, border: `1px solid ${PRIMARY}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>✨</div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...fontBody, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: PRIMARY, marginBottom: 8 }}>Pro Tutorial Tip</div>
                  <p style={{ ...fontBody, margin: '0 0 10px', fontSize: 14, color: colors.text, lineHeight: 1.7 }}>{analysis.tutorialTip}</p>
                  <p style={{ ...fontBody, margin: 0, fontSize: 13, color: SECONDARY, fontStyle: 'italic' }}>💄 Try next: {analysis.lookSuggestion}</p>
                </div>
              </GlassCard>

              {/* Recommended Products */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ ...fontBody, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: SECONDARY, marginBottom: 6 }}>Curation Engine</div>
                  <h2 style={{ ...fontHeadline, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                    Elite <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Recommendations</span>
                  </h2>
                  <p style={{ ...fontBody, fontSize: 14, color: colors.muted, margin: 0 }}>Based on your analysis — curated missing layers for your look.</p>
                </div>
                {analysis.products.map((p, i) => (
                  <GlamProductCard key={i} product={p} colors={colors} />
                ))}
              </div>

              {/* Foundation Shade Finder */}
              <FoundationShadeSection depthScore={analysis.depthScore ?? 5} undertone={(analysis.undertone as Undertone) ?? 'neutral'} colors={colors} />

              {/* Makeup Artists Near You */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ ...fontBody, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: SECONDARY, marginBottom: 6 }}>Artist Network</div>
                  <h2 style={{ ...fontHeadline, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                    Artists <span style={{ color: SECONDARY }}>Near You</span>
                  </h2>
                  <p style={{ ...fontBody, fontSize: 14, color: colors.muted, margin: 0 }}>Discover elite beauty creators in your city, curated by GLAM AI.</p>
                </div>
                <GlassCard colors={colors} style={{ padding: '24px 28px' }}>
                  <MakeupArtistFinder />
                </GlassCard>
              </div>
            </>
          )}

          {/* ── New scan CTA ───────────────────────────────────────────── */}
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <button
              onClick={() => navigate('/scan', { state: { mode: 'glam' } })}
              style={{ ...fontHeadline, background: `linear-gradient(135deg, ${PRIMARY_DIM}, ${SECONDARY})`, color: '#fff', border: 'none', borderRadius: 999, padding: '16px 40px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase', boxShadow: `0 0 30px ${PRIMARY_DIM}40`, transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}
            >
              ✨ New Glam Scan
            </button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
