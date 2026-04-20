import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import GlowRing from '../components/GlowRing';
import ScoreBar from '../components/ScoreBar';
import RoutineChecklist from '../components/RoutineChecklist';
import MaskPlan from '../components/MaskPlan';
import ProductCard from '../components/ProductCard';
import DermatologistFinder from '../components/DermatologistFinder';
import GlowChallenge from '../components/GlowChallenge';
import FeedbackForm from '../components/FeedbackForm';
import PremiumModal from '../components/PremiumModal';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';
import { useAuth, saveAnalysis } from '../lib/supabase';
import { selfieStore } from '../utils/selfieStore';
import { usePremium } from '../hooks/usePremium';

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
  const { lang } = useLanguage();
  const t = T[lang];
  const entry = location.state?.entry as HistoryEntry | undefined;
  const localImageUrl = selfieStore.get() ?? (entry?.imageUrl || undefined);
  const { premium, refresh: refreshPremium } = usePremium(user ?? null);
  const isAdmin = !!user?.email && ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'].includes(user.email);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    if (!entry || !user) return;
    const { analysis } = entry;
    saveAnalysis({
      user_id: user.id,
      glow_score: analysis.glowScore,
      skin_type: analysis.skinType,
      concerns: analysis.concerns,
    }).catch(() => {});
  }, [entry, user]);

  if (!entry) {
    return (
      <AppLayout>
        <div className="results-empty">
          <p>No analysis found.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
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
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => { setShowPremium(false); refreshPremium(); }}
        />
      )}

      <div className="page-results fade-in">
        <div className="results-content">

          {/* ── Hero Score Card ─────────────────────────────────────── */}
          <div className="results-hero-card card-in card-in-1">
            {/* Selfie avatar */}
            <div className="results-selfie-wrap">
              <img
                src={localImageUrl || entry.imageUrl}
                alt="Selfie"
                className="results-selfie"
              />
            </div>

            {/* Glow Ring */}
            <GlowRing score={analysis.glowScore} size={168} />

            {/* Skin type badges */}
            <div className="results-badges">
              <span className="skin-badge skin-badge-purple">{skinTypeLabel} {t.skin}</span>
              <span className="skin-badge skin-badge-cyan">{oilinessLabel} {t.oiliness}</span>
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

          {/* ── PREMIUM GATE ───────────────────────────────────────── */}
          {!hasFullAccess ? (
            <div className="locked-section">
              {/* Blurred preview content */}
              <div className="locked-blur-preview" aria-hidden="true">
                <div className="results-card">
                  <SectionHeading label={t.skinScores} />
                  <ScoreBar label={t.acneControl}  score={s.acne}        delay={0}   />
                  <ScoreBar label={t.skinTone}     score={s.skinTone}    delay={100} />
                  <ScoreBar label={t.texture}      score={s.texture}     delay={200} />
                </div>
                <div className="results-card">
                  <SectionHeading label={t.dailyRoutine}>
                    <h3 className="card-heading">{t.yourRegimen}</h3>
                  </SectionHeading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {analysis.dailyRoutine.morning.map((step, i) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text-primary)' }}>
                        🌅 {step}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="results-card">
                  <SectionHeading label={t.products}>
                    <h3 className="card-heading">{t.curatedFor}</h3>
                  </SectionHeading>
                  {analysis.products.slice(0, 2).map((p, i) => (
                    <ProductCard key={i} product={p} />
                  ))}
                </div>
              </div>

              {/* Lock overlay */}
              <div className="locked-overlay">
                <div className="locked-overlay-inner">
                  <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                    Unlock Your Full Skin Report
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                    Get detailed score breakdown, daily routine, product picks with Nykaa links, dermatologist finder &amp; more.
                  </p>
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
              {/* ── Skin Scores ────────────────────────────────────────── */}
              <div className="results-card card-in card-in-2">
                <SectionHeading label={t.skinScores} />
                <ScoreBar label={t.acneControl}  score={s.acne}        delay={0}   />
                <ScoreBar label={t.skinTone}     score={s.skinTone}    delay={100} />
                <ScoreBar label={t.texture}      score={s.texture}     delay={200} />
                <ScoreBar label={t.darkCircles}  score={s.darkCircles} delay={300} />
                <ScoreBar label={t.hairHealth}   score={s.hair}        delay={400} />
              </div>

              {/* ── Key Concerns ───────────────────────────────────────── */}
              <div className="results-card card-in card-in-3">
                <SectionHeading label={t.skinConcerns} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {analysis.concerns.map((c, i) => (
                    <span key={i} className="concern-tag">
                      <span>⚠</span> {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Daily Routine ──────────────────────────────────────── */}
              <div className="results-card card-in card-in-4">
                <SectionHeading label={t.dailyRoutine}>
                  <h3 className="card-heading">{t.yourRegimen}</h3>
                </SectionHeading>
                <RoutineChecklist morning={analysis.dailyRoutine.morning} evening={analysis.dailyRoutine.evening} />
              </div>

              {/* ── Mask Plan ──────────────────────────────────────────── */}
              <div className="results-card card-in card-in-5">
                <SectionHeading label={t.weeklyMask}>
                  <h3 className="card-heading">{t.maskSchedule}</h3>
                </SectionHeading>
                <MaskPlan maskType={analysis.maskType} />
              </div>

              {/* ── Products ───────────────────────────────────────────── */}
              <div className="results-card card-in card-in-6">
                <SectionHeading label={t.products}>
                  <h3 className="card-heading">{t.curatedFor}</h3>
                </SectionHeading>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 14 }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>⚕️</span>
                  <p style={{ margin: 0, fontSize: 12, color: '#a38c50', lineHeight: 1.6, fontFamily: 'var(--font-body, sans-serif)' }}>
                    <strong style={{ color: '#f59e0b' }}>Medical Disclaimer:</strong> These are AI-generated suggestions for informational purposes only and are not a substitute for professional medical advice. Please consult a dermatologist before starting any new skincare product, especially if you have sensitive skin, allergies, or an existing skin condition.
                  </p>
                </div>
                {analysis.products.map((p, i) => (
                  <ProductCard key={i} product={p} />
                ))}
              </div>

              {/* ── Grooming Tip ───────────────────────────────────────── */}
              <div className="results-card results-card-purple card-in card-in-7">
                <div className="results-icon-card">
                  <div className="results-icon-bubble results-icon-bubble-purple">💈</div>
                  <div>
                    <span className="section-label">{t.groomingTip}</span>
                    <p className="results-text">{analysis.groomingTip}</p>
                    <a
                      href={`https://www.amazon.in/s?k=${encodeURIComponent(
                        analysis.groomingTip.match(/(?:using\s+(?:a\s+)?|try\s+(?:a\s+)?)([a-zA-Z0-9 &+%-]+?)(?:\s+to|\s+for|\s+with|,|\.)/i)?.[1]?.trim() ?? 'grooming products'
                      )}&tag=roopai03-21`}
                      target="_blank" rel="noreferrer noopener"
                      className="results-shop-link"
                    >
                      🛒 Shop on Amazon
                    </a>
                  </div>
                </div>
              </div>

              {/* ── Doctor Advice ──────────────────────────────────────── */}
              <div className="results-card results-card-cyan card-in card-in-8">
                <div className="results-icon-card">
                  <div className="results-icon-bubble results-icon-bubble-cyan">🩺</div>
                  <div>
                    <span className="section-label">{t.doctorAdvice}</span>
                    <p className="results-text">{analysis.doctorAdvice}</p>
                  </div>
                </div>
              </div>

              {/* ── Dermatologist Finder ───────────────────────────────── */}
              <div className="results-card card-in card-in-9">
                <SectionHeading label={t.findDermat}>
                  <h3 className="card-heading">{t.specialistsNear}</h3>
                </SectionHeading>
                <DermatologistFinder />
              </div>

              {/* ── 7-Day Challenge ────────────────────────────────────── */}
              <div className="results-card results-card-gold card-in card-in-9">
                <SectionHeading label={t.glowChallenge}>
                  <h3 className="card-heading">{t.buildStreak}</h3>
                </SectionHeading>
                <GlowChallenge />
              </div>

              {/* ── Feedback ───────────────────────────────────────────── */}
              <div className="results-card card-in card-in-9">
                <FeedbackForm
                  entryId={entry.id}
                  glowScore={analysis.glowScore}
                  skinType={analysis.skinType}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* WhatsApp float */}
      <a href={whatsappUrl} target="_blank" rel="noreferrer noopener" className="whatsapp-float" title="Share your Glow Score">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </AppLayout>
  );
}
