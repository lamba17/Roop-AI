import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const MORNING_ICONS = ['🧴', '🌊', '💆', '☀️', '🛡️'];
const EVENING_ICONS = ['💫', '🌙', '✨', '💎', '🌿'];

function ProgressBar({ value, color = '#a855f7' }: { value: number; color?: string }) {
  return (
    <div className="routine-progress-track">
      <div className="routine-progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function RoutineContent({ analysis, latest, navigate }: any) {
  const luminosity = analysis.scores.skinTone;
  const luminosityDesc =
    luminosity >= 75 ? 'Excellent' :
    luminosity >= 55 ? 'Good' :
    'Needs improvement';

  return (
    <div className="routine-grid">
      <div className="routine-left">
        <div className="routine-ritual-card">
          <div className="ritual-header">
            <div className="ritual-icon-wrap ritual-morning"><span>☀️</span></div>
            <div>
              <div className="ritual-title">Morning Ritual</div>
              <div className="ritual-desc">{analysis.dailyRoutine.morning.length} steps · ~10 min</div>
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
              <div className="ritual-title">Evening Ritual</div>
              <div className="ritual-desc">{analysis.dailyRoutine.evening.length} steps · ~15 min</div>
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

      <div className="routine-right">
        <div className="luminosity-card">
          <div className="luminosity-header">
            <span className="page-eyebrow">Skin Luminosity</span>
            <div className="luminosity-score">
              <span className="luminosity-num">{luminosity}</span>
              <span className="luminosity-denom">/100</span>
            </div>
            <p className="luminosity-desc">{luminosityDesc}</p>
          </div>
          <ProgressBar value={luminosity} color="linear-gradient(90deg, #a855f7, #ec4899)" />
        </div>

        <div className="routine-scores-card">
          <div className="section-label">Skin Metrics</div>
          {[
            { label: 'Acne Control', value: analysis.scores.acne, color: '#22c55e' },
            { label: 'Skin Tone', value: analysis.scores.skinTone, color: '#a855f7' },
            { label: 'Texture', value: analysis.scores.texture, color: '#06b6d4' },
            { label: 'Dark Circles', value: analysis.scores.darkCircles, color: '#f59e0b' },
            { label: 'Hair Health', value: analysis.scores.hair, color: '#ec4899' },
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
          <div className="section-label">Skin Concerns</div>
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
          View Full Report
        </button>
      </div>
    </div>
  );
}

export default function Routine() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { premium } = usePremium(user ?? null);
  const hasFullAccess = premium;
  const [showPremium, setShowPremium] = useState(false);

  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);
  const latest = history[0];

  if (!latest) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">📋</div>
          <h3>No Scan Yet</h3>
          <p>Run a Glow Score scan to see your personalized skincare routine.</p>
          <button onClick={() => navigate('/scan')} className="btn-glow">Start Glow Scan</button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => setShowPremium(false)}
        />
      )}

      <div className="page-routine fade-in">
        <div className="routine-header">
          <span className="page-eyebrow">Personalized Care</span>
          <h1 className="routine-title">
            Your Daily <span className="gradient-text">Routine</span>
          </h1>
          <p className="routine-subtitle">Curated skincare ritual based on your Glow Score</p>
        </div>

        {!hasFullAccess ? (
          <div className="locked-section">
            <div className="locked-blur-preview" aria-hidden="true">
              <RoutineContent analysis={latest.analysis} latest={latest} navigate={navigate} />
            </div>
            <div className="locked-overlay">
              <div className="locked-overlay-inner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                  Unlock Your Daily Routine
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                  View your complete morning and evening skincare routine — all personalized to your Glow Score.
                </p>
                <button onClick={() => setShowPremium(true)} className="btn-glow" style={{ justifyContent: 'center', fontSize: 14, padding: '12px 28px' }}>
                  🚀 Try Full Access — ₹25 for 7 days
                </button>
              </div>
            </div>
          </div>
        ) : (
          <RoutineContent analysis={latest.analysis} latest={latest} navigate={navigate} />
        )}
      </div>
    </AppLayout>
  );
}
