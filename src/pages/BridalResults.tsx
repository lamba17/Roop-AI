import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BridalPlan } from '../types/analysis';
import Logo from '../components/Logo';
import GlowRing from '../components/GlowRing';
import MakeupProductCard from '../components/MakeupProductCard';

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#ec4899', marginBottom: 12 }}>
      {children}
    </div>
  );
}

const PHASE_COLORS = ['#a855f7', '#ec4899', '#f59e0b'];

export default function BridalResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, skinImageUrl, makeupImageUrl } = (location.state ?? {}) as {
    plan: BridalPlan;
    skinImageUrl?: string;
    makeupImageUrl?: string;
  };
  const [openPhase, setOpenPhase] = useState<number>(0);

  if (!plan) {
    return (
      <div className="mesh-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
        <p style={{ color: 'rgba(248,248,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}>No bridal plan found.</p>
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

          <div style={{ fontSize: 32, marginBottom: 8 }}>👰</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.3rem,4vw,1.8rem)', fontWeight: 700, margin: '0 0 6px', background: 'linear-gradient(135deg,#ec4899,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Your 90-Day Bridal Plan
          </h2>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: 'rgba(248,248,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>
            Recommended Look: <strong style={{ color: '#ec4899' }}>{plan.weddingLook}</strong>
          </p>

          {/* Two score rings */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <GlowRing score={plan.skinReadinessScore} size={130} label="SKIN READY" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <GlowRing score={plan.makeupCompatibilityScore} size={130} label="GLAM READY" color="#ec4899" />
            </div>
          </div>
        </div>

        {/* Urgent Concerns */}
        {plan.urgentConcerns.length > 0 && (
          <div className="glass-card card-in card-in-2" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)' }}>
            <SectionLabel>⚠ Address These First</SectionLabel>
            {plan.urgentConcerns.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < plan.urgentConcerns.length - 1 ? 10 : 0 }}>
                <span style={{ color: '#ef4444', flexShrink: 0 }}>⚠</span>
                <p style={{ margin: 0, fontSize: 14, color: 'rgba(248,248,255,0.8)', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{c}</p>
              </div>
            ))}
          </div>
        )}

        {/* 90-Day Phases */}
        <div className="glass-card card-in card-in-3">
          <SectionLabel>Your 90-Day Journey</SectionLabel>
          {plan.phases.map((phase, i) => (
            <div key={i} style={{ marginBottom: 10, borderRadius: 12, border: `1px solid ${PHASE_COLORS[i]}33`, overflow: 'hidden' }}>
              <div
                onClick={() => setOpenPhase(openPhase === i ? -1 : i)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', background: openPhase === i ? `${PHASE_COLORS[i]}0f` : '#12122a' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${PHASE_COLORS[i]}22`, border: `1px solid ${PHASE_COLORS[i]}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {i === 0 ? '🌱' : i === 1 ? '✨' : '👑'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: PHASE_COLORS[i], fontWeight: 700, letterSpacing: 0.5 }}>{phase.weekRange}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#e8e8f0' }}>{phase.phase}</div>
                </div>
                <span style={{ fontSize: 12, color: '#555' }}>{openPhase === i ? '▲' : '▼'}</span>
              </div>

              {openPhase === i && (
                <div style={{ padding: '4px 16px 16px', background: `${PHASE_COLORS[i]}08` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div style={{ background: '#12122a', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: '#a855f7', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>SKIN GOAL</div>
                      <p style={{ margin: 0, fontSize: 12, color: 'rgba(248,248,255,0.7)', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{phase.skinGoal}</p>
                    </div>
                    <div style={{ background: '#12122a', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: '#ec4899', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>MAKEUP FOCUS</div>
                      <p style={{ margin: 0, fontSize: 12, color: 'rgba(248,248,255,0.7)', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{phase.makeupFocus}</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginBottom: 6 }}>TREATMENTS</div>
                    {phase.treatments.map((t, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                        <span style={{ color: PHASE_COLORS[i], flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: 13, color: 'rgba(248,248,255,0.7)', fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginBottom: 6 }}>KEY PRODUCTS</div>
                    {phase.keyProducts.map((p, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                        <span style={{ color: PHASE_COLORS[i], flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: 13, color: 'rgba(248,248,255,0.7)', fontFamily: "'DM Sans', sans-serif" }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pre-Wedding Routine */}
        <div className="glass-card card-in card-in-4" style={{ background: 'rgba(236,72,153,0.05)', borderColor: 'rgba(236,72,153,0.2)' }}>
          <SectionLabel>Wedding Morning Routine</SectionLabel>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(248,248,255,0.8)', lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>{plan.preWeddingRoutine}</p>
        </div>

        {/* Skin Treatments */}
        <div className="glass-card card-in card-in-5">
          <SectionLabel>Recommended Skin Treatments</SectionLabel>
          {plan.skinTreatments.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < plan.skinTreatments.length - 1 ? 12 : 0 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>💆</span>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(248,248,255,0.8)', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{t}</p>
            </div>
          ))}
        </div>

        {/* Wedding Day Tips */}
        <div className="glass-card card-in card-in-6" style={{ background: 'rgba(245,158,11,0.04)', borderColor: 'rgba(245,158,11,0.2)' }}>
          <SectionLabel>Wedding Day Tips</SectionLabel>
          {plan.weddingDayTips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < plan.weddingDayTips.length - 1 ? 12 : 0 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>💍</span>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(248,248,255,0.8)', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* Bridal Products */}
        <div className="glass-card card-in card-in-7">
          <SectionLabel>Bridal Makeup Products</SectionLabel>
          {plan.bridalProducts.map((p, i) => <MakeupProductCard key={i} product={p} />)}
        </div>
      </div>
    </div>
  );
}
