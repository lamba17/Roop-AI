import { useLocation, useNavigate } from 'react-router-dom';
import type { GlamAnalysis, GlamScores } from '../types/analysis';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeColors } from '../hooks/useTheme';
import GlowRing from '../components/GlowRing';
import MakeupProductCard from '../components/MakeupProductCard';
import MakeupArtistFinder from '../components/MakeupArtistFinder';
import { useEffect, useState } from 'react';

/* ── helpers ─────────────────────────────────────────────────────────── */
function barColor(score: number) {
  if (score === 0)  return '#44445a';
  if (score >= 75)  return '#22c55e';
  if (score >= 50)  return '#f59e0b';
  return '#ef4444';
}

function StatusPill({ score }: { score: number }) {
  const applied = score > 0;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
      padding: '2px 7px', borderRadius: 20,
      background: applied ? 'rgba(34,197,94,0.12)' : 'rgba(68,68,90,0.3)',
      color: applied ? '#22c55e' : '#44445a',
      border: `1px solid ${applied ? 'rgba(34,197,94,0.25)' : 'rgba(68,68,90,0.4)'}`,
      flexShrink: 0,
    }}>
      {applied ? '✓ Applied' : '✕ Not applied'}
    </span>
  );
}

function AnimatedBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay + 200);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div style={{ height: 6, background: 'var(--bar-track)', borderRadius: 999, overflow: 'hidden', flex: 1 }}>
      <div style={{
        height: '100%', width: `${width}%`,
        background: barColor(score), borderRadius: 999,
        transition: `width 1.1s cubic-bezier(.4,0,.2,1) ${delay}ms`,
      }} />
    </div>
  );
}

function ScoreRow({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
        <StatusPill score={score} />
        <span style={{ fontSize: 13, fontWeight: 700, color: barColor(score), minWidth: 28, textAlign: 'right' }}>
          {score}
        </span>
      </div>
      <AnimatedBar score={score} delay={delay} />
    </div>
  );
}

function ScoreSection({
  title, emoji, accentColor, rows, scores, delayBase, animClass,
}: {
  title: string; emoji: string; accentColor: string;
  rows: Array<{ label: string; key: keyof GlamScores }>;
  scores: GlamScores; delayBase: number; animClass: string;
}) {
  return (
    <div className={`glass-card card-in ${animClass}`} style={{ borderColor: `${accentColor}33` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, fontSize: 18,
          background: `${accentColor}18`, border: `1px solid ${accentColor}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{emoji}</div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: accentColor }}>
          {title}
        </span>
      </div>
      {rows.map(({ label, key }, i) => (
        <ScoreRow key={key} label={label} score={scores[key]} delay={delayBase + i * 80} />
      ))}
    </div>
  );
}

function SectionLabel({ children, color = '#ec4899' }: { children: string; color?: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color, marginBottom: 12 }}>
      {children}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────── */
export default function GlamResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const tc = useThemeColors();
  const { analysis, imageUrl } = (location.state ?? {}) as { analysis: GlamAnalysis; imageUrl?: string };

  if (!analysis) {
    return (
      <div className="mesh-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>No analysis found.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    );
  }

  const s = analysis.scores;

  const FACE_ROWS: Array<{ label: string; key: keyof GlamScores }> = [
    { label: 'Foundation',  key: 'foundation' },
    { label: 'Concealer',   key: 'concealer'  },
    { label: 'Powder',      key: 'powder'     },
    { label: 'Blush',       key: 'blush'      },
    { label: 'Highlighter', key: 'highlighter'},
  ];
  const EYE_ROWS: Array<{ label: string; key: keyof GlamScores }> = [
    { label: 'Eyeshadow',     key: 'eyeshadow'   },
    { label: 'Eyeliner',      key: 'eyeliner'    },
    { label: 'Mascara',       key: 'mascara'     },
    { label: 'Brow Products', key: 'browProducts'},
  ];
  const LIP_ROWS: Array<{ label: string; key: keyof GlamScores }> = [
    { label: 'Lipstick',  key: 'lipstick'},
    { label: 'Lip Gloss', key: 'gloss'   },
    { label: 'Lip Balm',  key: 'balm'    },
  ];

  return (
    <div className="mesh-bg fade-in" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="hero-glow" style={{ opacity: 0.6 }} />

      <header className="header-glass" style={{ position: 'sticky', top: 0, zIndex: 40, padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => navigate('/')} className="btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}>← Back</button>
          <ThemeToggle />
          <button onClick={() => navigate('/')} className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>New Scan</button>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 16px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Hero Score Card ─────────────────────────────────────────── */}
        <div className="glass-card card-in card-in-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, padding: '32px 24px' }}>
          {imageUrl && (
            <img src={imageUrl} alt="Makeup selfie" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid transparent', background: 'linear-gradient(#0d0d1f,#0d0d1f) padding-box, linear-gradient(135deg,#ec4899,#a855f7) border-box', boxShadow: '0 0 24px rgba(236,72,153,0.3)' }} />
          )}

          <GlowRing score={analysis.glamScore} size={168} label="GLAM SCORE" color="#ec4899" />

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="skin-badge skin-badge-purple">{analysis.currentLook}</span>
            <span className="skin-badge skin-badge-cyan" style={{ textTransform: 'capitalize' }}>{analysis.makeupStyle} Style</span>
          </div>

          <p style={{ fontSize: 14, color: tc.textBody, lineHeight: 1.7, maxWidth: 460, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            {analysis.report}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(236,72,153,0.8)', margin: 0, fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>
            {analysis.skinToneMatch}
          </p>

          {/* Overall score pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 100, background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.25)' }}>
            <span style={{ fontSize: 13, color: tc.textBody, fontFamily: "'DM Sans', sans-serif" }}>Overall Finish</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: barColor(s.overall) }}>{s.overall}</span>
            <span style={{ fontSize: 12, color: tc.textHint }}>/100</span>
          </div>
        </div>

        {/* ── Face Makeup Scores ───────────────────────────────────────── */}
        <ScoreSection
          title="Face Makeup"
          emoji="✨"
          accentColor="#f59e0b"
          rows={FACE_ROWS}
          scores={s}
          delayBase={0}
          animClass="card-in-2"
        />

        {/* ── Eye Makeup Scores ────────────────────────────────────────── */}
        <ScoreSection
          title="Eye Makeup"
          emoji="👁"
          accentColor="#6366f1"
          rows={EYE_ROWS}
          scores={s}
          delayBase={100}
          animClass="card-in-3"
        />

        {/* ── Lip Products Scores ──────────────────────────────────────── */}
        <ScoreSection
          title="Lip Products"
          emoji="💋"
          accentColor="#ec4899"
          rows={LIP_ROWS}
          scores={s}
          delayBase={200}
          animClass="card-in-4"
        />

        {/* ── What's Missing ───────────────────────────────────────────── */}
        {analysis.missingElements.length > 0 && (
          <div className="glass-card card-in card-in-5" style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.04)' }}>
            <SectionLabel color="#f59e0b">What's Missing From Your Look</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {analysis.missingElements.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 6, padding: '2px 8px', flexShrink: 0, marginTop: 1 }}>✕</span>
                  <p style={{ margin: 0, fontSize: 14, color: tc.textBody, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3 Corrections ───────────────────────────────────────────── */}
        <div className="glass-card card-in card-in-6" style={{ borderColor: 'rgba(236,72,153,0.2)', background: 'rgba(236,72,153,0.04)' }}>
          <SectionLabel>3 Things to Improve</SectionLabel>
          {analysis.corrections.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < analysis.corrections.length - 1 ? 12 : 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#ec4899', flexShrink: 0 }}>
                {i + 1}
              </div>
              <p style={{ margin: 0, fontSize: 14, color: tc.textBody, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{c}</p>
            </div>
          ))}
        </div>

        {/* ── Pro Tip ──────────────────────────────────────────────────── */}
        <div className="glass-card card-in card-in-7" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: 'rgba(168,85,247,0.07)', borderColor: 'rgba(168,85,247,0.25)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>✨</div>
          <div>
            <SectionLabel color="#a855f7">Pro Tutorial Tip</SectionLabel>
            <p style={{ margin: '0 0 8px', fontSize: 14, color: tc.textBody, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{analysis.tutorialTip}</p>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(236,72,153,0.8)', fontStyle: 'italic', fontFamily: "'DM Sans', sans-serif" }}>💄 Try next: {analysis.lookSuggestion}</p>
          </div>
        </div>

        {/* ── Recommended Products ─────────────────────────────────────── */}
        <div className="glass-card card-in card-in-8">
          <SectionLabel>Recommended Makeup Products</SectionLabel>
          <p style={{ fontSize: 12, color: tc.textHint, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>
            Picks suited to your look · Shop on Amazon &amp; Nykaa
          </p>
          {analysis.products.map((p, i) => <MakeupProductCard key={i} product={p} />)}
        </div>

        {/* ── Makeup Artists Near You ──────────────────────────────────── */}
        <div className="glass-card card-in card-in-9" style={{ borderColor: 'rgba(236,72,153,0.2)', background: 'rgba(236,72,153,0.03)' }}>
          <SectionLabel>Makeup Artists Near You</SectionLabel>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: tc.textPrimary }}>
            Book a Pro in Your City
          </h3>
          <MakeupArtistFinder />
        </div>

      </div>
    </div>
  );
}
