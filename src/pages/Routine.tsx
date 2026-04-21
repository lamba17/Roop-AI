import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';
import { useAuth } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];
const MORNING_ICONS = ['🧴', '🌊', '💆', '☀️', '🛡️'];
const EVENING_ICONS = ['💫', '🌙', '✨', '💎', '🌿'];

function ProgressBar({ value, color = '#a855f7' }: { value: number; color?: string }) {
  return (
    <div className="routine-progress-track">
      <div className="routine-progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function RoutineContent({ analysis, latest, navigate, t }: any) {
  const luminosity = analysis.scores.skinTone;
  const luminosityDesc =
    luminosity >= 75 ? t.luminosityHigh :
    luminosity >= 55 ? t.luminosityMid :
    t.luminosityLow;

  return (
    <div className="routine-grid">
      {/* Left: Morning + Night Rituals */}
      <div className="routine-left">
        <div className="routine-ritual-card">
          <div className="ritual-header">
            <div className="ritual-icon-wrap ritual-morning"><span>☀️</span></div>
            <div>
              <div className="ritual-title">{t.morningRitual}</div>
              <div className="ritual-desc">{analysis.dailyRoutine.morning.length} {t.stepsLabel} · ~10 {t.minLabel}</div>
            </div>
          </div>
          <div className="ritual-steps">
            {analysis.dailyRoutine.morning.map((step: string, i: number) => (
              <div key={i} className="ritual-step">
                <div className="ritual-step-num">{i + 1}</div>
                <div className="ritual-step-icon">{MORNING_ICONS[i] ?? '✦'}</div>
                <div className="ritual-step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="routine-ritual-card">
          <div className="ritual-header">
            <div className="ritual-icon-wrap ritual-night"><span>🌙</span></div>
            <div>
              <div className="ritual-title">{t.nightRitual}</div>
              <div className="ritual-desc">{analysis.dailyRoutine.evening.length} {t.stepsLabel} · ~15 {t.minLabel}</div>
            </div>
          </div>
          <div className="ritual-steps">
            {analysis.dailyRoutine.evening.map((step: string, i: number) => (
              <div key={i} className="ritual-step">
                <div className="ritual-step-num">{i + 1}</div>
                <div className="ritual-step-icon">{EVENING_ICONS[i] ?? '✦'}</div>
                <div className="ritual-step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Luminosity + Metrics + Concerns */}
      <div className="routine-right">
        <div className="luminosity-card">
          <div className="luminosity-header">
            <span className="page-eyebrow">{t.currentLuminosity}</span>
            <div className="luminosity-score">
              <span className="luminosity-num">{luminosity}</span>
              <span className="luminosity-denom">/100</span>
            </div>
            <p className="luminosity-desc">{luminosityDesc}</p>
          </div>
          <ProgressBar value={luminosity} color="linear-gradient(90deg, #a855f7, #ec4899)" />
        </div>

        <div className="routine-scores-card">
          <div className="section-label">{t.skinMetrics}</div>
          {[
            { label: t.acneControl,  value: analysis.scores.acne,        color: '#22c55e' },
            { label: t.skinTone,     value: analysis.scores.skinTone,    color: '#a855f7' },
            { label: t.texture,      value: analysis.scores.texture,     color: '#06b6d4' },
            { label: t.darkCircles,  value: analysis.scores.darkCircles, color: '#f59e0b' },
            { label: t.hairHealth,   value: analysis.scores.hair,        color: '#ec4899' },
          ].map(m => (
            <div key={m.label} className="routine-metric-row">
              <div className="routine-metric-label">{m.label}</div>
              <div className="routine-metric-bar-wrap">
                <div className="routine-metric-track">
                  <div className="routine-metric-fill" style={{ width: `${m.value}%`, background: m.color }} />
                </div>
                <div className="routine-metric-val" style={{ color: m.color }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="routine-concerns-card">
          <div className="section-label">{t.skinConcerns}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {analysis.concerns.map((c: string, i: number) => (
              <span key={i} className="concern-tag">⚠ {c}</span>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/results', { state: { entry: latest } })}
          className="btn-outline"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {t.viewFullReport}
        </button>
      </div>
    </div>
  );
}

export default function Routine() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = T[lang];
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user ?? null);
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);
  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);
  const latest = history[0];

  if (!latest) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">📋</div>
          <h3>{t.noRoutineYet}</h3>
          <p>{t.noRoutineDesc}</p>
          <button onClick={() => navigate('/scan')} className="btn-glow">{t.startAnalysis}</button>
        </div>
      </AppLayout>
    );
  }

  const { analysis } = latest;

  return (
    <AppLayout>
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => { setShowPremium(false); refreshPremium(); }}
        />
      )}

      <div className="page-routine fade-in">
        {/* Header */}
        <div className="routine-header">
          <span className="page-eyebrow">{t.personalisedCare}</span>
          <h1 className="routine-title">
            {t.dailyHeading} <span className="gradient-text">{t.routineDot}</span>
          </h1>
          <p className="routine-subtitle">
            {t.curatedSkinType} {t[analysis.skinType as keyof typeof t] ?? analysis.skinType} {t.skinTypeLabel}
          </p>
        </div>

        {!hasFullAccess ? (
          <div className="locked-section">
            {/* Blurred preview */}
            <div className="locked-blur-preview" aria-hidden="true">
              <RoutineContent analysis={analysis} latest={latest} navigate={navigate} t={t} />
            </div>

            {/* Lock overlay */}
            <div className="locked-overlay">
              <div className="locked-overlay-inner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                  Unlock Your Daily Routine
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                  Get your personalised morning &amp; night ritual, skin metrics, and concerns — all tailored to your skin.
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
          <RoutineContent analysis={analysis} latest={latest} navigate={navigate} t={t} />
        )}
      </div>
    </AppLayout>
  );
}
