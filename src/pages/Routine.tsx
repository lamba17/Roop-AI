import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry, GlamHistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';
import { useAuth } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];
const MORNING_ICONS = ['🧴', '🌊', '💆', '☀️', '🛡️'];
const EVENING_ICONS = ['💫', '🌙', '✨', '💎', '🌿'];

/* Step emoji per correction category */
function correctionIcon(step: string, index: number): string {
  const s = step.toLowerCase();
  if (s.includes('eye') || s.includes('liner') || s.includes('lash') || s.includes('mascara')) return '👁️';
  if (s.includes('lip') || s.includes('gloss') || s.includes('balm')) return '💋';
  if (s.includes('highlight') || s.includes('glow') || s.includes('shimmer')) return '✨';
  if (s.includes('foundation') || s.includes('base') || s.includes('concealer') || s.includes('contour')) return '🎨';
  if (s.includes('blush') || s.includes('cheek')) return '🌸';
  if (s.includes('brow') || s.includes('eyebrow')) return '🖊️';
  if (s.includes('powder') || s.includes('setting')) return '🪄';
  const fallback = ['💄', '🎨', '✨', '👁️', '💋', '🌸', '🖊️'];
  return fallback[index % fallback.length];
}

function ProgressBar({ value, color = '#a855f7' }: { value: number; color?: string }) {
  return (
    <div className="routine-progress-track">
      <div className="routine-progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/* ── Skin (Glow) Routine Content ─────────────────────────────────────── */
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

/* ── Glam Routine Content ─────────────────────────────────────────────── */
function GlamRoutineContent({ latest, navigate }: { latest: GlamHistoryEntry; navigate: ReturnType<typeof useNavigate> }) {
  const { analysis } = latest;
  const { glamScore, makeupStyle, currentLook, corrections, tutorialTip, lookSuggestion, missingElements } = analysis;

  /* Build step list: corrections first, then tutorialTip as the final step */
  const steps: string[] = corrections.length > 0
    ? [...corrections, tutorialTip]
    : [tutorialTip];

  const glamDesc =
    glamScore >= 75 ? 'Your makeup technique is advanced — focus on precision and longevity.' :
    glamScore >= 50 ? 'Solid foundation. A few targeted improvements will elevate your look.' :
    'Great starting point! Follow these steps to build a flawless routine.';

  return (
    <div className="routine-grid">
      {/* Left: Makeup Application Steps */}
      <div className="routine-left">
        <div className="routine-ritual-card">
          <div className="ritual-header">
            <div className="ritual-icon-wrap ritual-morning" style={{ background: 'rgba(236,72,153,0.15)' }}>
              <span>💄</span>
            </div>
            <div>
              <div className="ritual-title">Makeup Application Ritual</div>
              <div className="ritual-desc">{steps.length} steps · ~20 min · Morning</div>
            </div>
          </div>
          <div className="ritual-steps">
            {steps.map((step, i) => (
              <div key={i} className="ritual-step">
                <div className="ritual-step-num" style={{ background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>{i + 1}</div>
                <div className="ritual-step-icon">{correctionIcon(step, i)}</div>
                <div className="ritual-step-text">{step}</div>
              </div>
            ))}
          </div>

          {/* Look suggestion */}
          {lookSuggestion && (
            <div style={{
              marginTop: 20, padding: '14px 16px',
              background: 'rgba(236,72,153,0.07)',
              borderRadius: 12, borderLeft: '3px solid #ec4899',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                ✦ Look Suggestion
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{lookSuggestion}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Glam Score + Profile + Gaps */}
      <div className="routine-right">
        {/* Glam Score card (mirrors luminosity card) */}
        <div className="luminosity-card">
          <div className="luminosity-header">
            <span className="page-eyebrow" style={{ color: '#ec4899' }}>Overall Glam Score</span>
            <div className="luminosity-score">
              <span className="luminosity-num" style={{
                background: 'linear-gradient(135deg,#ec4899,#a855f7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{glamScore}</span>
              <span className="luminosity-denom">/100</span>
            </div>
            <p className="luminosity-desc">{glamDesc}</p>
          </div>
          <ProgressBar value={glamScore} color="linear-gradient(90deg, #ec4899, #a855f7)" />
        </div>

        {/* Glam profile */}
        <div className="skin-profile-card">
          <div className="section-label">Your Glam Profile</div>
          <div className="skin-profile-row">
            <span>Makeup Style</span>
            <span className="skin-badge skin-badge-purple">{makeupStyle}</span>
          </div>
          <div className="skin-profile-row">
            <span>Current Look</span>
            <span className="skin-badge skin-badge-cyan">{currentLook}</span>
          </div>
          <div className="skin-profile-row">
            <span>Glam Score</span>
            <span className="skin-badge skin-badge-gold">{glamScore}/100</span>
          </div>
        </div>

        {/* Missing elements (areas to improve) */}
        {missingElements && missingElements.length > 0 && (
          <div className="routine-concerns-card">
            <div className="section-label">Areas to Improve</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {missingElements.map((el, i) => (
                <span key={i} className="concern-tag" style={{ borderColor: 'rgba(236,72,153,0.3)', color: '#ec4899', background: 'rgba(236,72,153,0.08)' }}>
                  💄 {el}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/glam-results', { state: { entry: latest } })}
          className="btn-outline"
          style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(236,72,153,0.4)', color: '#ec4899' }}
        >
          View Full Glam Report →
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────── */
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
  const [glamHistory] = useLocalStorage<GlamHistoryEntry[]>('roop_glam_history', []);
  const [scoreMode] = useLocalStorage<'glow' | 'glam' | null>('roop_score_mode', null);

  const latestSkin = history[0];
  const latestGlam = glamHistory[0];

  const hasGlowHistory = !!latestSkin;
  const hasGlamHistory = !!latestGlam;
  const hasAnything = hasGlowHistory || hasGlamHistory;

  /* Lock tab to user's chosen score mode; fall back to data-driven default */
  const [routineTab, setRoutineTab] = useState<'skin' | 'glam'>(() =>
    scoreMode === 'glam' ? 'glam' :
    scoreMode === 'glow' ? 'skin' :
    !hasGlowHistory && hasGlamHistory ? 'glam' : 'skin'
  );

  /* Resolve effective tab (guard against switching to a tab with no data) */
  const effectiveTab: 'skin' | 'glam' =
    routineTab === 'skin' && !hasGlowHistory && hasGlamHistory ? 'glam' :
    routineTab === 'glam' && !hasGlamHistory && hasGlowHistory ? 'skin' :
    routineTab;

  const isGlam = effectiveTab === 'glam';

  if (!hasAnything) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">📋</div>
          <h3>{t.noRoutineYet}</h3>
          <p>{t.noRoutineDesc}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            <button onClick={() => navigate('/scan')} className="btn-glow">{t.startAnalysis}</button>
            <button
              onClick={() => navigate('/scan')}
              className="btn-outline"
              style={{ justifyContent: 'center' }}
            >
              💄 Start Glam Scan
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  /* Dynamic header text */
  const eyebrow = isGlam ? 'Makeup Coach' : t.personalisedCare;
  const titleWord = isGlam ? 'Glam' : t.dailyHeading;
  const subtitle = isGlam
    ? `Your ${latestGlam?.analysis.makeupStyle ?? ''} look application guide`
    : `${t.curatedSkinType} ${t[latestSkin?.analysis.skinType as keyof typeof t] ?? latestSkin?.analysis.skinType ?? ''} ${t.skinTypeLabel}`;

  function renderContent() {
    if (effectiveTab === 'skin' && latestSkin) {
      return <RoutineContent analysis={latestSkin.analysis} latest={latestSkin} navigate={navigate} t={t} />;
    }
    if (effectiveTab === 'glam' && latestGlam) {
      return <GlamRoutineContent latest={latestGlam} navigate={navigate} />;
    }
    return null;
  }

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
          <span className="page-eyebrow">{eyebrow}</span>
          <h1 className="routine-title">
            {titleWord} <span className="gradient-text">{t.routineDot}</span>
          </h1>
          <p className="routine-subtitle">{subtitle}</p>
        </div>

        {/* Tab switcher — only shown when no mode is locked */}
        {!scoreMode && <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button
            onClick={() => hasGlowHistory && setRoutineTab('skin')}
            disabled={!hasGlowHistory}
            style={{
              padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700,
              border: `1.5px solid ${effectiveTab === 'skin' ? '#a855f7' : 'var(--border)'}`,
              background: effectiveTab === 'skin' ? 'rgba(168,85,247,0.12)' : 'transparent',
              color: effectiveTab === 'skin' ? '#a855f7' : 'var(--text-muted)',
              cursor: hasGlowHistory ? 'pointer' : 'not-allowed',
              opacity: hasGlowHistory ? 1 : 0.4,
              transition: 'all 0.2s',
            }}
          >
            🌿 Skin Routine
          </button>
          <button
            onClick={() => hasGlamHistory && setRoutineTab('glam')}
            disabled={!hasGlamHistory}
            style={{
              padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700,
              border: `1.5px solid ${effectiveTab === 'glam' ? '#ec4899' : 'var(--border)'}`,
              background: effectiveTab === 'glam' ? 'rgba(236,72,153,0.12)' : 'transparent',
              color: effectiveTab === 'glam' ? '#ec4899' : 'var(--text-muted)',
              cursor: hasGlamHistory ? 'pointer' : 'not-allowed',
              opacity: hasGlamHistory ? 1 : 0.4,
              transition: 'all 0.2s',
            }}
          >
            💄 Glam Routine
          </button>
        </div>}

        {/* No-data-for-this-tab state */}
        {effectiveTab === 'skin' && !latestSkin && (
          <div className="page-empty" style={{ marginTop: 20 }}>
            <div className="page-empty-icon">🌿</div>
            <h3>No Skin Analysis Yet</h3>
            <p>Run a Glow Score scan to see your personalised skincare routine.</p>
            <button onClick={() => navigate('/scan')} className="btn-glow">Start Glow Scan</button>
          </div>
        )}

        {effectiveTab === 'glam' && !latestGlam && (
          <div className="page-empty" style={{ marginTop: 20 }}>
            <div className="page-empty-icon">💄</div>
            <h3>No Glam Analysis Yet</h3>
            <p>Run a Glam Score scan to see your personalised makeup application routine.</p>
            <button onClick={() => navigate('/scan')} className="btn-glow">Start Glam Scan</button>
          </div>
        )}

        {/* Main content — locked or unlocked */}
        {((effectiveTab === 'skin' && latestSkin) || (effectiveTab === 'glam' && latestGlam)) && (
          !hasFullAccess ? (
            <div className="locked-section">
              {/* Blurred preview */}
              <div className="locked-blur-preview" aria-hidden="true">
                {renderContent()}
              </div>

              {/* Lock overlay */}
              <div className="locked-overlay">
                <div className="locked-overlay-inner">
                  <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                    {isGlam ? 'Unlock Your Glam Routine' : 'Unlock Your Daily Routine'}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                    {isGlam
                      ? 'Get your step-by-step makeup application ritual, glam score breakdown, and missing elements — tailored to your look.'
                      : 'Get your personalised morning & night ritual, skin metrics, and concerns — all tailored to your skin.'}
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
            renderContent()
          )
        )}
      </div>
    </AppLayout>
  );
}
