import { useLocation, useNavigate } from 'react-router-dom';
import type { GlamAnalysis } from '../types/analysis';
import Logo from '../components/Logo';
import GlowRing from '../components/GlowRing';
import ScoreBar from '../components/ScoreBar';
import MakeupProductCard from '../components/MakeupProductCard';

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#ec4899', marginBottom: 12 }}>
      {children}
    </div>
  );
}

export default function GlamResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, imageUrl } = (location.state ?? {}) as { analysis: GlamAnalysis; imageUrl?: string };

  if (!analysis) {
    return (
      <div className="mesh-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
        <p style={{ color: 'rgba(248,248,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}>No analysis found.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    );
  }

  const s = analysis.scores;
  const glamColor = '#ec4899';

  return (
    <div className="mesh-bg fade-in" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="hero-glow" style={{ opacity: 0.6 }} />

      <header className="header-glass" style={{ position: 'sticky', top: 0, zIndex: 40, padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/')} className="btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}>← Back</button>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>New Scan</button>
        </div>
      </header>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 16px 80px', position: 'relative', zIndex: 1 }}>

        {/* Hero Score Card */}
        <div className="glass-card card-in card-in-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, padding: '32px 24px' }}>
          {imageUrl && (
            <img src={imageUrl} alt="Makeup selfie" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid transparent', background: 'linear-gradient(#0d0d1f,#0d0d1f) padding-box, linear-gradient(135deg,#ec4899,#a855f7) border-box', boxShadow: '0 0 24px rgba(236,72,153,0.3)' }} />
          )}

          <GlowRing score={analysis.glamScore} size={168} label="GLAM SCORE" color={glamColor} />

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="skin-badge skin-badge-purple">{analysis.currentLook}</span>
            <span className="skin-badge skin-badge-cyan" style={{ textTransform: 'capitalize' }}>{analysis.makeupStyle} Style</span>
          </div>

          <p style={{ fontSize: 14, color: 'rgba(248,248,255,0.6)', lineHeight: 1.7, maxWidth: 460, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            {analysis.report}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(236,72,153,0.8)', margin: 0, fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>
            {analysis.skinToneMatch}
          </p>
        </div>

        {/* Glam Scores */}
        <div className="glass-card card-in card-in-2">
          <SectionLabel>Makeup Scores</SectionLabel>
          <ScoreBar label="Foundation Match" score={s.foundationMatch} delay={0} />
          <ScoreBar label="Eye Makeup"        score={s.eyeMakeup}       delay={100} />
          <ScoreBar label="Lip Color"         score={s.lipColor}        delay={200} />
          <ScoreBar label="Blush & Contour"   score={s.blushContour}    delay={300} />
          <ScoreBar label="Overall Finish"    score={s.overall}         delay={400} />
        </div>

        {/* Corrections */}
        <div className="glass-card card-in card-in-3" style={{ borderColor: 'rgba(236,72,153,0.2)', background: 'rgba(236,72,153,0.04)' }}>
          <SectionLabel>3 Things to Improve</SectionLabel>
          {analysis.corrections.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < analysis.corrections.length - 1 ? 12 : 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#ec4899', flexShrink: 0 }}>
                {i + 1}
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(248,248,255,0.8)', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{c}</p>
            </div>
          ))}
        </div>

        {/* Tutorial Tip */}
        <div className="glass-card card-in card-in-4" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: 'rgba(168,85,247,0.07)', borderColor: 'rgba(168,85,247,0.25)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            ✨
          </div>
          <div>
            <SectionLabel>Pro Tutorial Tip</SectionLabel>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(248,248,255,0.8)', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{analysis.tutorialTip}</p>
          </div>
        </div>

        {/* Look Suggestion */}
        <div className="glass-card card-in card-in-5" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: 'rgba(236,72,153,0.06)', borderColor: 'rgba(236,72,153,0.22)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            💄
          </div>
          <div>
            <SectionLabel>Try This Look Next</SectionLabel>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(248,248,255,0.8)', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{analysis.lookSuggestion}</p>
          </div>
        </div>

        {/* Makeup Products */}
        <div className="glass-card card-in card-in-6">
          <SectionLabel>Recommended Makeup Products</SectionLabel>
          {analysis.products.map((p, i) => <MakeupProductCard key={i} product={p} />)}
        </div>

        {/* CTA */}
        <div className="glass-card card-in card-in-7" style={{ textAlign: 'center', padding: '28px 24px' }}>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: 'rgba(248,248,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>
            Want a full personalized tutorial using your skin + makeup selfies?
          </p>
          <button onClick={() => navigate('/', { state: { mode: 'guide' } })} className="btn-glow" style={{ fontSize: 14, padding: '12px 28px', justifyContent: 'center' }}>
            📖 Get My Personalized Guide
          </button>
        </div>
      </div>
    </div>
  );
}
