import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import GlowRing from '../components/GlowRing';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];

function glowColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function glowLabel(score: number) {
  if (score >= 80) return 'EXCELLENT';
  if (score >= 65) return 'GOOD';
  if (score >= 50) return 'FAIR';
  return 'NEEDS CARE';
}

function DashboardContent({ history, latest, score, metrics, navigate }: any) {
  return (
    <div className="dashboard-grid">
      {/* Left Column */}
      <div className="dashboard-left">
        {/* Glow Score Card */}
        <div className="dash-card glow-score-card">
          <div className="dash-card-label">Daily Glow Score</div>
          {score !== null ? (
            <div className="glow-score-body">
              <GlowRing score={score} size={160} />
              <div className="glow-score-meta">
                <div className="glow-score-label-badge" style={{ color: glowColor(score) }}>
                  {glowLabel(score)}
                </div>
                <p className="glow-score-report">
                  {latest?.analysis.report?.split('.')[0]}.
                </p>
                <button
                  onClick={() => navigate('/results', { state: { entry: latest } })}
                  className="btn-view-details"
                >
                  View Full Report →
                </button>
              </div>
            </div>
          ) : (
            <div className="no-score-state">
              <div className="no-score-ring">
                <svg width="160" height="160" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#1a1a30" strokeWidth="10"/>
                  <text x="70" y="65" textAnchor="middle" fill="#555566" fontSize="14" fontFamily="DM Sans">No scan</text>
                  <text x="70" y="82" textAnchor="middle" fill="#555566" fontSize="11" fontFamily="DM Sans">yet</text>
                </svg>
              </div>
              <button onClick={() => navigate('/')} className="btn-glow" style={{ marginTop: 16 }}>
                Start Analysis
              </button>
            </div>
          )}
        </div>

        {/* Today's Routine Card */}
        {latest && (
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-label">Today's Routine</div>
              <button onClick={() => navigate('/routine')} className="dash-card-link">View All</button>
            </div>
            <div className="routine-preview-list">
              {latest.analysis.dailyRoutine.morning.slice(0, 3).map((step: string, i: number) => (
                <div key={i} className="routine-preview-item">
                  <div className="routine-step-dot" />
                  <span className="routine-step-text">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="dashboard-right">
        {/* Metric Cards */}
        {metrics ? (
          <div className="metrics-grid">
            {metrics.map((m: any) => (
              <div key={m.label} className="metric-card">
                <div className="metric-icon">{m.icon}</div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
                <div className="metric-status" style={{ color: m.color }}>
                  <span className="metric-status-dot" style={{ background: m.color }} />
                  {m.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dash-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔬</div>
            <p style={{ color: 'rgba(232,232,240,0.5)', fontSize: 14, marginBottom: 16 }}>
              Complete your first skin analysis to unlock your personalized metrics.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Analyse My Skin
            </button>
          </div>
        )}

        {/* Scan History */}
        {history.length > 0 && (
          <div className="dash-card">
            <div className="dash-card-header">
              <div className="dash-card-label">Scan History</div>
              <button onClick={() => navigate('/progress')} className="dash-card-link">View All</button>
            </div>
            <div className="history-list">
              {history.slice(0, 4).map((entry: HistoryEntry) => (
                <div
                  key={entry.id}
                  className="history-item"
                  onClick={() => navigate('/results', { state: { entry } })}
                >
                  <div className="history-item-left">
                    {entry.imageUrl ? (
                      <img
                        src={entry.imageUrl}
                        alt="scan"
                        className="history-thumb"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="history-thumb history-thumb-placeholder">🤳</div>
                    )}
                    <div>
                      <div className="history-date">
                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="history-type">
                        {entry.analysis.skinType} skin
                      </div>
                    </div>
                  </div>
                  <div className="history-score" style={{ color: glowColor(entry.score) }}>
                    {entry.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user ?? null);
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);
  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? 'there';

  const latest = history[0];
  const score = latest?.analysis.glowScore ?? null;

  const metrics = latest ? [
    {
      label: 'Hydration Level',
      value: latest.analysis.skinType === 'dry' ? '42%' : latest.analysis.skinType === 'oily' ? '78%' : '65%',
      status: latest.analysis.skinType === 'dry' ? 'Low' : latest.analysis.skinType === 'oily' ? 'High' : 'Normal',
      color: '#06b6d4',
      icon: '💧',
    },
    {
      label: 'Sensitivity',
      value: latest.analysis.scores.acne >= 70 ? 'Low' : latest.analysis.scores.acne >= 50 ? 'Moderate' : 'High',
      status: latest.analysis.scores.acne >= 70 ? 'Low' : 'Moderate',
      color: '#22c55e',
      icon: '🌿',
    },
    {
      label: 'Radiance Index',
      value: `${latest.analysis.scores.skinTone}%`,
      status: latest.analysis.scores.skinTone >= 75 ? 'High' : 'Moderate',
      color: '#a855f7',
      icon: '✨',
    },
    {
      label: 'Barrier Strength',
      value: latest.analysis.scores.texture >= 70 ? 'High' : latest.analysis.scores.texture >= 50 ? 'Moderate' : 'Low',
      status: latest.analysis.scores.texture >= 70 ? 'High' : 'Low',
      color: '#f59e0b',
      icon: '🛡️',
    },
  ] : null;

  return (
    <AppLayout>
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => { setShowPremium(false); refreshPremium(); }}
        />
      )}

      <div className="page-dashboard">
        {/* Welcome Header — always visible */}
        <div className="dashboard-welcome">
          <h1 className="dashboard-greeting">
            Welcome back, <span className="gradient-text">{firstName}.</span>
          </h1>
          <p className="dashboard-subtitle">
            {latest
              ? `Last analysis: ${new Date(latest.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : 'Start your skin analysis journey today.'}
          </p>
        </div>

        {!hasFullAccess ? (
          <div className="locked-section">
            <div className="locked-blur-preview" aria-hidden="true">
              <DashboardContent history={history} latest={latest} score={score} metrics={metrics} navigate={navigate} />
            </div>
            <div className="locked-overlay">
              <div className="locked-overlay-inner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                  Unlock Your Dashboard
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                  View your Glow Score, skin metrics, daily routine, and full scan history — all personalised to your skin.
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
          <DashboardContent history={history} latest={latest} score={score} metrics={metrics} navigate={navigate} />
        )}
      </div>
    </AppLayout>
  );
}
