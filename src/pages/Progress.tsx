import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];

function glowColor(score: number): string {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function ProgressContent({
  history,
  navigate,
}: {
  history: HistoryEntry[];
  navigate: (path: string, opts?: object) => void;
}) {
  return (
    <>
      {history.length >= 2 && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: '22px',
            marginBottom: 16,
          }}
        >
          <span className="section-label">Progress Comparison</span>
          <BeforeAfterSlider entries={[...history].reverse()} />
        </div>
      )}

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: '22px',
        }}
      >
        <span className="section-label">Glow Scan History ({history.length})</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {history.map((entry, index) => (
            <div
              key={entry.id}
              onClick={() => navigate('/results', { state: { entry } })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px',
                borderRadius: 12,
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: 'rgba(168,85,247,0.05)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(168,85,247,0.12)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,85,247,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(168,85,247,0.05)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
              }}
            >
              {entry.imageUrl ? (
                <img
                  src={entry.imageUrl}
                  alt="scan"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: 'rgba(168,85,247,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  🤳
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                  Scan #{String(index + 1).padStart(4, '0')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {new Date(entry.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                  })}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 800, color: glowColor(entry.score) }}>
                  {entry.score}
                </div>
                <div style={{ fontSize: 10, color: glowColor(entry.score), fontWeight: 700 }}>
                  {entry.score >= 75
                    ? 'EXCELLENT'
                    : entry.score >= 65
                    ? 'GOOD'
                    : entry.score >= 50
                    ? 'FAIR'
                    : 'NEEDS CARE'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const { premium } = usePremium(user ?? null);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);

  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);
  const neitherHasHistory = history.length === 0;

  if (neitherHasHistory) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">📈</div>
          <h3>No Scans Yet</h3>
          <p>Run Glow Score scans to track your progress over time.</p>
          <button onClick={() => navigate('/scan')} className="btn-glow">
            Start Your First Scan
          </button>
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

      <div className="page-progress fade-in">
        <div className="progress-header">
          <span className="page-eyebrow">Your Journey</span>
          <h1 className="progress-title">
            Track Your <span className="gradient-text">Progress</span>
          </h1>
          <p className="progress-subtitle">Watch your Glow Score improve over time</p>
        </div>

        {!hasFullAccess ? (
          <div className="locked-section">
            <div className="locked-blur-preview" aria-hidden="true">
              <ProgressContent history={history} navigate={navigate} />
            </div>
            <div className="locked-overlay">
              <div className="locked-overlay-inner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                  Unlock Your Progress Tracker
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                  View your complete scan history and before/after comparisons — all your progress in one place.
                </p>
                <button onClick={() => setShowPremium(true)} className="btn-glow" style={{ justifyContent: 'center', fontSize: 14, padding: '12px 28px' }}>
                  🚀 Try Full Access — ₹25 for 7 days
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ProgressContent history={history} navigate={navigate} />
        )}
      </div>
    </AppLayout>
  );
}
