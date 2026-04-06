import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { GuideAnalysis } from '../types/analysis';
import Logo from '../components/Logo';
import MakeupProductCard from '../components/MakeupProductCard';

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#a855f7', marginBottom: 12 }}>
      {children}
    </div>
  );
}

export default function GuideResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, skinImageUrl, makeupImageUrl } = (location.state ?? {}) as {
    analysis: GuideAnalysis;
    skinImageUrl?: string;
    makeupImageUrl?: string;
  };
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  if (!analysis) {
    return (
      <div className="mesh-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
        <p style={{ color: 'rgba(248,248,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}>No guide found.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    );
  }

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

        {/* Hero */}
        <div className="glass-card card-in card-in-1" style={{ textAlign: 'center', padding: '32px 24px' }}>
          {/* Two selfie thumbnails */}
          {(skinImageUrl || makeupImageUrl) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
              {skinImageUrl && (
                <div style={{ textAlign: 'center' }}>
                  <img src={skinImageUrl} alt="Skin" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(168,85,247,0.4)' }} />
                  <div style={{ fontSize: 10, color: '#888', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>SKIN</div>
                </div>
              )}
              {makeupImageUrl && (
                <div style={{ textAlign: 'center' }}>
                  <img src={makeupImageUrl} alt="Makeup" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(236,72,153,0.4)' }} />
                  <div style={{ fontSize: 10, color: '#888', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>GLAM</div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="skin-badge skin-badge-purple">{analysis.lookCategory}</span>
            <span className="skin-badge skin-badge-cyan">⏱ {analysis.totalTime}</span>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.3rem,4vw,1.8rem)', fontWeight: 700, margin: '0 0 12px', background: 'linear-gradient(135deg,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {analysis.title}
          </h2>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 10, padding: '10px 14px', maxWidth: 200, textAlign: 'left' }}>
              <div style={{ fontSize: 10, color: '#a855f7', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>YOUR SKIN</div>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(248,248,255,0.6)', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{analysis.skinFoundationSummary}</p>
            </div>
            <div style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 10, padding: '10px 14px', maxWidth: 200, textAlign: 'left' }}>
              <div style={{ fontSize: 10, color: '#ec4899', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>YOUR STYLE</div>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(248,248,255,0.6)', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{analysis.makeupBaseSummary}</p>
            </div>
          </div>
        </div>

        {/* Step-by-step tutorial */}
        <div className="glass-card card-in card-in-2">
          <SectionLabel>Your Personalized Tutorial</SectionLabel>
          {analysis.steps.map((step) => (
            <div
              key={step.step}
              onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
              style={{ marginBottom: 10, borderRadius: 12, border: '1px solid #1e1e3a', overflow: 'hidden', cursor: 'pointer', background: expandedStep === step.step ? 'rgba(168,85,247,0.06)' : '#12122a', transition: 'background 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {step.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f0' }}>{step.title}</div>
                  {step.product && <div style={{ fontSize: 11, color: '#a855f7', marginTop: 1 }}>{step.product}</div>}
                </div>
                {step.duration && <span style={{ fontSize: 11, color: '#555', background: '#1e1e3a', padding: '2px 8px', borderRadius: 20 }}>{step.duration}</span>}
                <span style={{ fontSize: 12, color: '#555' }}>{expandedStep === step.step ? '▲' : '▼'}</span>
              </div>
              {expandedStep === step.step && (
                <div style={{ padding: '0 16px 14px 56px', fontSize: 13, color: 'rgba(248,248,255,0.7)', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                  {step.instruction}
                </div>
              )}
            </div>
          ))}
          <p style={{ margin: '8px 0 0', fontSize: 11, color: '#555', fontFamily: "'DM Sans', sans-serif" }}>Tap each step to expand instructions</p>
        </div>

        {/* Pro Tips */}
        <div className="glass-card card-in card-in-3" style={{ background: 'rgba(168,85,247,0.05)', borderColor: 'rgba(168,85,247,0.2)' }}>
          <SectionLabel>Pro Tips For Your Face</SectionLabel>
          {analysis.proTips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < analysis.proTips.length - 1 ? 12 : 0 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>✨</span>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(248,248,255,0.8)', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* Avoid List */}
        <div className="glass-card card-in card-in-4" style={{ background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.18)' }}>
          <SectionLabel>What To Avoid</SectionLabel>
          {analysis.avoidList.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < analysis.avoidList.length - 1 ? 12 : 0 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>🚫</span>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(248,248,255,0.8)', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{item}</p>
            </div>
          ))}
        </div>

        {/* Products */}
        <div className="glass-card card-in card-in-5">
          <SectionLabel>Products For This Tutorial</SectionLabel>
          {analysis.products.map((p, i) => <MakeupProductCard key={i} product={p} />)}
        </div>

        {/* Bridal CTA */}
        <div className="glass-card card-in card-in-6" style={{ textAlign: 'center', padding: '28px 24px', background: 'rgba(236,72,153,0.04)', borderColor: 'rgba(236,72,153,0.2)' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>👰</div>
          <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#f8f8ff', fontFamily: "'DM Sans', sans-serif" }}>Planning a wedding?</p>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(248,248,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>Get your full 90-day bridal beauty plan</p>
          <button onClick={() => navigate('/', { state: { mode: 'bridal' } })} className="btn-glow" style={{ fontSize: 14, padding: '12px 28px', justifyContent: 'center' }}>
            👰 Start My Bridal Plan
          </button>
        </div>
      </div>
    </div>
  );
}
