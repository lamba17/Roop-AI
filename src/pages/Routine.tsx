import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';

const MORNING_ICONS = ['🧴', '🌊', '💆', '☀️', '🛡️'];
const EVENING_ICONS = ['💫', '🌙', '✨', '💎', '🌿'];

function ProgressBar({ value, color = '#a855f7' }: { value: number; color?: string }) {
  return (
    <div className="routine-progress-track">
      <div
        className="routine-progress-fill"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

export default function Routine() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = T[lang];
  const [history] = useLocalStorage<HistoryEntry[]>('roop_history', []);
  const latest = history[0];

  if (!latest) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">📋</div>
          <h3>{t.noRoutineYet}</h3>
          <p>{t.noRoutineDesc}</p>
          <button onClick={() => navigate('/')} className="btn-glow">
            {t.startAnalysis}
          </button>
        </div>
      </AppLayout>
    );
  }

  const { analysis } = latest;
  const luminosity = analysis.scores.skinTone;

  const luminosityDesc =
    luminosity >= 75 ? t.luminosityHigh :
    luminosity >= 55 ? t.luminosityMid :
    t.luminosityLow;

  return (
    <AppLayout>
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

        <div className="routine-grid">
          {/* Left: Morning + Night Rituals */}
          <div className="routine-left">
            {/* Morning Ritual */}
            <div className="routine-ritual-card">
              <div className="ritual-header">
                <div className="ritual-icon-wrap ritual-morning">
                  <span>☀️</span>
                </div>
                <div>
                  <div className="ritual-title">{t.morningRitual}</div>
                  <div className="ritual-desc">
                    {analysis.dailyRoutine.morning.length} {t.stepsLabel} · ~10 {t.minLabel}
                  </div>
                </div>
              </div>
              <div className="ritual-steps">
                {analysis.dailyRoutine.morning.map((step, i) => (
                  <div key={i} className="ritual-step">
                    <div className="ritual-step-num">{i + 1}</div>
                    <div className="ritual-step-icon">{MORNING_ICONS[i] ?? '✦'}</div>
                    <div className="ritual-step-text">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Night Ritual */}
            <div className="routine-ritual-card">
              <div className="ritual-header">
                <div className="ritual-icon-wrap ritual-night">
                  <span>🌙</span>
                </div>
                <div>
                  <div className="ritual-title">{t.nightRitual}</div>
                  <div className="ritual-desc">
                    {analysis.dailyRoutine.evening.length} {t.stepsLabel} · ~15 {t.minLabel}
                  </div>
                </div>
              </div>
              <div className="ritual-steps">
                {analysis.dailyRoutine.evening.map((step, i) => (
                  <div key={i} className="ritual-step">
                    <div className="ritual-step-num">{i + 1}</div>
                    <div className="ritual-step-icon">{EVENING_ICONS[i] ?? '✦'}</div>
                    <div className="ritual-step-text">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Luminosity Score + Progress Chart */}
          <div className="routine-right">
            {/* Luminosity Score */}
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

            {/* Score bars */}
            <div className="routine-scores-card">
              <div className="section-label">{t.skinMetrics}</div>
              {[
                { label: t.acneControl, value: analysis.scores.acne, color: '#22c55e' },
                { label: t.skinTone, value: analysis.scores.skinTone, color: '#a855f7' },
                { label: t.texture, value: analysis.scores.texture, color: '#06b6d4' },
                { label: t.darkCircles, value: analysis.scores.darkCircles, color: '#f59e0b' },
                { label: t.hairHealth, value: analysis.scores.hair, color: '#ec4899' },
              ].map(m => (
                <div key={m.label} className="routine-metric-row">
                  <div className="routine-metric-label">{m.label}</div>
                  <div className="routine-metric-bar-wrap">
                    <div className="routine-metric-track">
                      <div
                        className="routine-metric-fill"
                        style={{ width: `${m.value}%`, background: m.color }}
                      />
                    </div>
                    <div className="routine-metric-val" style={{ color: m.color }}>{m.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Concerns */}
            <div className="routine-concerns-card">
              <div className="section-label">{t.skinConcerns}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {analysis.concerns.map((c, i) => (
                  <span key={i} className="concern-tag">⚠ {c}</span>
                ))}
              </div>
            </div>

            {/* View full results */}
            <button
              onClick={() => navigate('/results', { state: { entry: latest } })}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {t.viewFullReport}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
