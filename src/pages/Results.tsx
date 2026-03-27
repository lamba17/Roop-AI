import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { HistoryEntry } from '../types/analysis';
import Logo from '../components/Logo';
import GlowRing from '../components/GlowRing';
import ScoreBar from '../components/ScoreBar';
import RoutineChecklist from '../components/RoutineChecklist';
import MaskPlan from '../components/MaskPlan';
import ProductCard from '../components/ProductCard';
import DermatologistFinder from '../components/DermatologistFinder';
import GlowChallenge from '../components/GlowChallenge';
import FeedbackForm from '../components/FeedbackForm';
import { useAuth, saveAnalysis } from '../lib/supabase';

/* WhatsApp SVG icon */
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* Section heading with Playfair Display */
function SectionHeading({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <span className="section-label">{label}</span>
      {children}
    </div>
  );
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const entry = location.state?.entry as HistoryEntry | undefined;

  // Persist analysis to Supabase if signed in
  useEffect(() => {
    if (!entry || !user) return;
    const { analysis } = entry;
    saveAnalysis({
      user_id: user.id,
      glow_score: analysis.glowScore,
      skin_type: analysis.skinType,
      concerns: analysis.concerns,
    }).catch(() => {
      // Silently fail — local history is the primary store
    });
  }, [entry, user]);

  if (!entry) {
    return (
      <div
        className="mesh-bg"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <p style={{ color: 'rgba(248,248,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}>
          No analysis found.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  const { analysis } = entry;
  const s = analysis.scores;
  const skinTypeLabel = analysis.skinType.charAt(0).toUpperCase() + analysis.skinType.slice(1);
  const oilinessLabel = analysis.oiliness.charAt(0).toUpperCase() + analysis.oiliness.slice(1);

  const whatsappMessage = encodeURIComponent(
    `I just got my Glow Score of ${analysis.glowScore}/100 on ROOP AI! 🌟 Get your free skin analysis at roopai.co.in`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  return (
    <div
      className="mesh-bg fade-in"
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle ambient glow */}
      <div className="hero-glow" style={{ opacity: 0.6 }} />

      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <header
        className="header-glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '0 20px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/progress')}
            className="btn-outline"
            style={{ fontSize: 12, padding: '7px 14px', gap: 5 }}
          >
            <span>📊</span> History
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
            style={{ fontSize: 12, padding: '7px 14px' }}
          >
            New Scan
          </button>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '28px 16px 80px',
          position: 'relative',
          zIndex: 1,
        }}
      >

        {/* ── Hero Score Card ────────────────────────────────────────── */}
        <div
          className="glass-card card-in card-in-1"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 16,
            padding: '32px 24px',
          }}
        >
          {/* Selfie avatar */}
          <div style={{ position: 'relative' }}>
            <img
              src={entry.imageUrl}
              alt="Selfie"
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid transparent',
                background: 'linear-gradient(#0d0d1f, #0d0d1f) padding-box, linear-gradient(135deg, #7c3aed, #db2777) border-box',
                boxShadow: '0 0 24px rgba(124,58,237,0.3)',
              }}
            />
          </div>

          {/* Glow Ring */}
          <GlowRing score={analysis.glowScore} size={168} />

          {/* Skin type badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="skin-badge skin-badge-purple">{skinTypeLabel} Skin</span>
            <span className="skin-badge skin-badge-cyan">{oilinessLabel} Oiliness</span>
          </div>

          {/* Report */}
          <p
            style={{
              fontSize: 14,
              color: 'rgba(248,248,255,0.6)',
              lineHeight: 1.7,
              maxWidth: 460,
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {analysis.report}
          </p>
        </div>

        {/* ── Skin Scores ───────────────────────────────────────────── */}
        <div className="glass-card card-in card-in-2">
          <SectionHeading label="Skin Scores" />
          <ScoreBar label="Acne Control"    score={s.acne}        delay={0}   />
          <ScoreBar label="Skin Tone"       score={s.skinTone}    delay={100} />
          <ScoreBar label="Texture"         score={s.texture}     delay={200} />
          <ScoreBar label="Dark Circles"    score={s.darkCircles} delay={300} />
          <ScoreBar label="Hair & Grooming" score={s.hair}        delay={400} />
        </div>

        {/* ── Key Concerns ──────────────────────────────────────────── */}
        <div className="glass-card card-in card-in-3">
          <SectionHeading label="Key Concerns" />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {analysis.concerns.map((c, i) => (
              <span key={i} className="concern-tag">
                <span>⚠</span> {c}
              </span>
            ))}
          </div>
        </div>

        {/* ── Daily Routine ─────────────────────────────────────────── */}
        <div className="glass-card card-in card-in-4">
          <SectionHeading label="Daily Routine">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                margin: '2px 0 0',
                color: '#f8f8ff',
              }}
            >
              Your Personalised Regimen
            </h3>
          </SectionHeading>
          <RoutineChecklist morning={analysis.dailyRoutine.morning} evening={analysis.dailyRoutine.evening} />
        </div>

        {/* ── Mask Plan ─────────────────────────────────────────────── */}
        <div className="glass-card card-in card-in-5">
          <SectionHeading label="Weekly Mask Plan">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                margin: '2px 0 0',
                color: '#f8f8ff',
              }}
            >
              Targeted Treatment Schedule
            </h3>
          </SectionHeading>
          <MaskPlan maskType={analysis.maskType} />
        </div>

        {/* ── Products ──────────────────────────────────────────────── */}
        <div className="glass-card card-in card-in-6">
          <SectionHeading label="Recommended Products">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                margin: '2px 0 0',
                color: '#f8f8ff',
              }}
            >
              Curated For Your Skin
            </h3>
          </SectionHeading>
          {analysis.products.map((p, i) => (
            <ProductCard key={i} product={p} />
          ))}
        </div>

        {/* ── Grooming Tip ──────────────────────────────────────────── */}
        <div
          className="glass-card card-in card-in-7"
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            background: 'rgba(124,58,237,0.07)',
            borderColor: 'rgba(168,85,247,0.25)',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(168,85,247,0.15)',
              border: '1px solid rgba(168,85,247,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            💈
          </div>
          <div>
            <span className="section-label" style={{ marginBottom: 6 }}>Grooming Tip</span>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: 'rgba(248,248,255,0.8)',
                lineHeight: 1.7,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {analysis.groomingTip}
            </p>
          </div>
        </div>

        {/* ── Doctor Advice ─────────────────────────────────────────── */}
        <div
          className="glass-card card-in card-in-8"
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            background: 'rgba(6,182,212,0.05)',
            borderColor: 'rgba(6,182,212,0.22)',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(6,182,212,0.12)',
              border: '1px solid rgba(6,182,212,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🩺
          </div>
          <div>
            <span className="section-label" style={{ marginBottom: 6 }}>Dermatologist Advice</span>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: 'rgba(248,248,255,0.8)',
                lineHeight: 1.7,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {analysis.doctorAdvice}
            </p>
          </div>
        </div>

        {/* ── Dermatologist Finder ──────────────────────────────────── */}
        <div className="glass-card card-in card-in-9">
          <SectionHeading label="Find a Dermatologist">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                margin: '2px 0 0',
                color: '#f8f8ff',
              }}
            >
              Specialists Near You
            </h3>
          </SectionHeading>
          <DermatologistFinder />
        </div>

        {/* ── 7-Day Challenge ───────────────────────────────────────── */}
        <div
          className="glass-card card-in card-in-9"
          style={{
            borderColor: 'rgba(245,158,11,0.25)',
            background: 'rgba(245,158,11,0.04)',
          }}
        >
          <SectionHeading label="7-Day Glow Challenge">
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                margin: '2px 0 0',
                color: '#f8f8ff',
              }}
            >
              Build Your Glow Streak
            </h3>
          </SectionHeading>
          <GlowChallenge />
        </div>

        {/* ── Feedback ──────────────────────────────────────────────── */}
        <div className="glass-card card-in card-in-9">
          <FeedbackForm
            entryId={entry.id}
            glowScore={analysis.glowScore}
            skinType={analysis.skinType}
          />
        </div>
      </div>

      {/* ── Floating WhatsApp Share Button ────────────────────────────── */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="whatsapp-float"
        title="Share your Glow Score"
      >
        <WhatsAppIcon size={26} />
      </a>
    </div>
  );
}
