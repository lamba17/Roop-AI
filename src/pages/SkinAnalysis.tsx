import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import GlowRing from '../components/GlowRing';
import ScoreBar from '../components/ScoreBar';
import RoutineChecklist from '../components/RoutineChecklist';
import MaskPlan from '../components/MaskPlan';
import ProductCard from '../components/ProductCard';
import DermatologistFinder from '../components/DermatologistFinder';

function SectionHeading({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <span className="section-label">{label}</span>
      {children}
    </div>
  );
}

export default function SkinAnalysis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);

  const entry = history[0];

  if (!entry) {
    return (
      <AppLayout>
        <div className="results-empty">
          <div className="page-empty-icon">🔍</div>
          <h3>No Analysis Found</h3>
          <p>Start a new skin scan to get your analysis report.</p>
          <button onClick={() => navigate('/scan')} className="btn-primary">Start Skin Scan</button>
        </div>
      </AppLayout>
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
    <AppLayout>
      <div className="page-results fade-in">
        <div className="results-content">

          {/* ── Hero Score Card ─────────────────────────────────────── */}
          <div className="results-hero-card card-in card-in-1">
            {/* Selfie avatar */}
            <div className="results-selfie-wrap">
              <img
                src={entry.imageUrl}
                alt="Selfie"
                className="results-selfie"
              />
            </div>

            {/* Glow Ring */}
            <GlowRing score={analysis.glowScore} size={168} />

            {/* Skin type badges */}
            <div className="results-badges">
              <span className="skin-badge skin-badge-purple">{skinTypeLabel} Skin</span>
              <span className="skin-badge skin-badge-cyan">{oilinessLabel} Oiliness</span>
            </div>

            {/* Report */}
            <p className="results-report">{analysis.report}</p>

            {/* Share */}
            <a href={whatsappUrl} target="_blank" rel="noreferrer noopener" className="results-share-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share on WhatsApp
            </a>
          </div>

          {/* ── MAIN CONTENT GRID ───────────────────────────────────– */}
          <div className="results-grid">

            {/* Column 1: Skin Scores & Routine */}
            <div>
              <div className="results-card">
                <SectionHeading label="SKIN SCORES" />
                <ScoreBar label="Acne Control" score={s.acne} delay={0} />
                <ScoreBar label="Skin Tone" score={s.skinTone} delay={100} />
                <ScoreBar label="Texture" score={s.texture} delay={200} />
                <ScoreBar label="Dark Circles" score={s.darkCircles} delay={300} />
                <ScoreBar label="Hair & Beard" score={s.hair} delay={400} />
              </div>

              <div className="results-card">
                <SectionHeading label="DAILY ROUTINE">
                  <h3 className="card-heading">Your Regimen</h3>
                </SectionHeading>
                <RoutineChecklist morning={analysis.dailyRoutine.morning} evening={analysis.dailyRoutine.evening} />
              </div>
            </div>

            {/* Column 2: Products & Mask Plan */}
            <div>
              <div className="results-card">
                <SectionHeading label="PRODUCTS">
                  <h3 className="card-heading">Curated For You</h3>
                </SectionHeading>
                {analysis.products.map((p, i) => (
                  <ProductCard key={i} product={p} />
                ))}
              </div>

              <div className="results-card">
                <SectionHeading label="WEEKLY MASK PLAN" />
                <MaskPlan maskType={analysis.maskType} />
              </div>
            </div>

            {/* Column 3: Specialists & Grooming */}
            <div>
              <div className="results-card">
                <SectionHeading label="SPECIALISTS">
                  <h3 className="card-heading">Find Dermatologists</h3>
                </SectionHeading>
                <DermatologistFinder />
              </div>

              <div className="results-card">
                <SectionHeading label="GROOMING TIP" />
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: 14 }}>
                  {analysis.groomingTip}
                </p>
              </div>

              <div className="results-card">
                <SectionHeading label="DERMATOLOGIST ADVICE" />
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6, fontSize: 14 }}>
                  {analysis.doctorAdvice}
                </p>
              </div>
            </div>

          </div>

          {/* ── CTA ────────────────────────────────────────────────── */}
          <div style={{ textAlign: 'center', marginTop: 48, paddingBottom: 32 }}>
            <button
              onClick={() => navigate('/scan')}
              className="btn-primary"
              style={{ fontSize: 16, padding: '12px 32px' }}
            >
              Start Another Scan
            </button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
