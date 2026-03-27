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

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const entry = location.state?.entry as HistoryEntry | undefined;

  if (!entry) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: '#888' }}>No analysis found.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </div>
    );
  }

  const { analysis } = entry;
  const s = analysis.scores;
  const skinTypeLabel = analysis.skinType.charAt(0).toUpperCase() + analysis.skinType.slice(1);

  const whatsappMessage = encodeURIComponent(
    `I just got my Glow Score of ${analysis.glowScore}/100 on ROOP AI! 🌟 Get your free skin analysis at roopai.co.in`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }} className="fade-in">
      {/* Header */}
      <header style={{
        padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1e1e3a', background: '#080818', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              padding: '7px 14px',
              background: '#25D366',
              color: '#fff',
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'opacity 0.2s, transform 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Share Score
          </a>
          <button onClick={() => navigate('/progress')} className="btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}>📊 History</button>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>New Scan</button>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Hero score card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12, padding: 28 }}>
          <img src={entry.imageUrl} alt="Selfie" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #a855f7' }} />
          <GlowRing score={analysis.glowScore} size={160} />
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(168,85,247,0.15)', color: '#a855f7', fontSize: 13, fontWeight: 600 }}>
              {skinTypeLabel} Skin
            </span>
            <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(6,182,212,0.15)', color: '#06b6d4', fontSize: 13, fontWeight: 600 }}>
              {analysis.oiliness.charAt(0).toUpperCase() + analysis.oiliness.slice(1)} Oiliness
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, maxWidth: 440, margin: 0 }}>{analysis.report}</p>
        </div>

        {/* Skin Scores */}
        <div className="card">
          <span className="section-label">Skin Scores</span>
          <ScoreBar label="Acne Control" score={s.acne} delay={0} />
          <ScoreBar label="Skin Tone" score={s.skinTone} delay={100} />
          <ScoreBar label="Texture" score={s.texture} delay={200} />
          <ScoreBar label="Dark Circles" score={s.darkCircles} delay={300} />
          <ScoreBar label="Hair & Grooming" score={s.hair} delay={400} />
        </div>

        {/* Key Concerns */}
        <div className="card">
          <span className="section-label">Key Concerns</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {analysis.concerns.map((c, i) => (
              <span key={i} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
                ⚠️ {c}
              </span>
            ))}
          </div>
        </div>

        {/* Daily Routine */}
        <div className="card">
          <span className="section-label">Daily Routine</span>
          <RoutineChecklist morning={analysis.dailyRoutine.morning} evening={analysis.dailyRoutine.evening} />
        </div>

        {/* Mask Plan */}
        <div className="card">
          <span className="section-label">Weekly Mask Plan</span>
          <MaskPlan maskType={analysis.maskType} />
        </div>

        {/* Products */}
        <div className="card">
          <span className="section-label">Recommended Products</span>
          {analysis.products.map((p, i) => <ProductCard key={i} product={p} />)}
        </div>

        {/* Grooming Tip */}
        <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 28 }}>💈</span>
          <div>
            <span className="section-label" style={{ marginBottom: 4 }}>Grooming Tip</span>
            <p style={{ margin: 0, fontSize: 14, color: '#e8e8f0', lineHeight: 1.6 }}>{analysis.groomingTip}</p>
          </div>
        </div>

        {/* Doctor Advice */}
        <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', border: '1px solid rgba(6,182,212,0.25)' }}>
          <span style={{ fontSize: 28 }}>🩺</span>
          <div>
            <span className="section-label" style={{ marginBottom: 4 }}>Dermatologist Advice</span>
            <p style={{ margin: 0, fontSize: 14, color: '#e8e8f0', lineHeight: 1.6 }}>{analysis.doctorAdvice}</p>
          </div>
        </div>

        {/* Dermatologist Finder */}
        <div className="card">
          <span className="section-label">Find a Dermatologist</span>
          <DermatologistFinder />
        </div>

        {/* 7-Day Challenge */}
        <div className="card" style={{ border: '1px solid rgba(245,158,11,0.25)' }}>
          <span className="section-label">7-Day Glow Challenge</span>
          <GlowChallenge />
        </div>

        {/* Feedback Form */}
        <FeedbackForm
          entryId={entry.id}
          glowScore={analysis.glowScore}
          skinType={analysis.skinType}
        />

      </div>
    </div>
  );
}
