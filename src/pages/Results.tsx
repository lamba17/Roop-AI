import { useLocation, useNavigate } from 'react-router-dom';
import type { HistoryEntry } from '../types/analysis';
import GlowRing from '../components/GlowRing';
import ScoreBar from '../components/ScoreBar';
import RoutineChecklist from '../components/RoutineChecklist';
import MaskPlan from '../components/MaskPlan';
import ProductCard from '../components/ProductCard';
import DermatologistFinder from '../components/DermatologistFinder';
import GlowChallenge from '../components/GlowChallenge';

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

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }} className="fade-in">
      {/* Header */}
      <header style={{
        padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1e1e3a', background: '#080818', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>✨</span>
          <span style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ROOP AI</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
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

      </div>
    </div>
  );
}
