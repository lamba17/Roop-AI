import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry, GlamHistoryEntry } from '../types/analysis';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];

type ProgressTab = 'glow' | 'glam';

function glowColor(score: number): string {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function glamColor(score: number): string {
  if (score >= 75) return '#bd9dff';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

// ── Glow (skin) progress ─────────────────────────────────────────────────────

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
        <span className="section-label">Scan History ({history.length})</span>
        {history.map(entry => (
          <div
            key={entry.id}
            onClick={() => navigate('/results', { state: { entry } })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {entry.imageUrl ? (
              <img
                src={entry.imageUrl}
                alt="Scan"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
                onError={e => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: 'rgba(168,85,247,0.12)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                🤳
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 3 }}>
                {new Date(entry.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-hint)' }}>
                {entry.analysis.skinType} · {entry.analysis.concerns[0]}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: glowColor(entry.score) }}>
              {entry.score}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Glam (makeup) progress ───────────────────────────────────────────────────

function GlamProgressContent({
  glamHistory,
  navigate,
}: {
  glamHistory: GlamHistoryEntry[];
  navigate: (path: string, opts?: object) => void;
}) {
  const oldest = glamHistory[glamHistory.length - 1];
  const newest = glamHistory[0];
  const delta = newest.score - oldest.score;

  return (
    <>
      {glamHistory.length >= 2 && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: '22px',
            marginBottom: 16,
          }}
        >
          <span className="section-label">Glam Progress Comparison</span>
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 14,
              flexWrap: 'wrap',
            }}
          >
            {/* Oldest scan */}
            <div
              style={{
                flex: 1,
                minWidth: 140,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {oldest.imageUrl ? (
                <img
                  src={oldest.imageUrl}
                  alt="First glam scan"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    objectFit: 'cover',
                    border: '2px solid rgba(189,157,255,0.3)',
                  }}
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    background: 'rgba(236,72,153,0.1)',
                    border: '2px solid rgba(236,72,153,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  💄
                </div>
              )}
              <div style={{ fontSize: 11, color: 'var(--text-hint)', textAlign: 'center' }}>
                {new Date(oldest.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </div>
              <div
                style={{ fontSize: 28, fontWeight: 800, color: glamColor(oldest.score) }}
              >
                {oldest.score}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-hint)' }}>First Scan</div>
            </div>

            {/* Delta badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 6,
                minWidth: 60,
              }}
            >
              <div style={{ fontSize: 20, color: 'var(--text-hint)' }}>→</div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: delta >= 0 ? '#22c55e' : '#ef4444',
                  background:
                    delta >= 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                  border: `1px solid ${delta >= 0 ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  borderRadius: 20,
                  padding: '4px 10px',
                }}
              >
                {delta >= 0 ? '+' : ''}
                {delta} pts
              </div>
            </div>

            {/* Newest scan */}
            <div
              style={{
                flex: 1,
                minWidth: 140,
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(189,157,255,0.25)',
                borderRadius: 14,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {newest.imageUrl ? (
                <img
                  src={newest.imageUrl}
                  alt="Latest glam scan"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    objectFit: 'cover',
                    border: '2px solid rgba(189,157,255,0.5)',
                  }}
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    background: 'rgba(236,72,153,0.1)',
                    border: '2px solid rgba(189,157,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  💄
                </div>
              )}
              <div style={{ fontSize: 11, color: 'var(--text-hint)', textAlign: 'center' }}>
                {new Date(newest.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </div>
              <div
                style={{ fontSize: 28, fontWeight: 800, color: glamColor(newest.score) }}
              >
                {newest.score}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-hint)' }}>Latest Scan</div>
            </div>
          </div>
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
        <span className="section-label">Glam Scan History ({glamHistory.length})</span>
        {glamHistory.map(entry => (
          <div
            key={entry.id}
            onClick={() =>
              navigate('/glam-results', {
                state: { analysis: entry.analysis, imageUrl: entry.imageUrl },
              })
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 0',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {entry.imageUrl ? (
              <img
                src={entry.imageUrl}
                alt="Glam scan"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '1px solid rgba(189,157,255,0.2)',
                }}
                onError={e => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: 'rgba(236,72,153,0.1)',
                  border: '1px solid rgba(236,72,153,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                💄
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 3 }}>
                {new Date(entry.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-hint)' }}>
                {entry.analysis.makeupStyle} · {entry.analysis.currentLook}
              </div>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: glamColor(entry.score),
              }}
            >
              {entry.score}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user ?? null);
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);

  const [history] = useLocalStorage<HistoryEntry[]>(
    user ? `roop_history_${user.id}` : 'roop_history',
    [],
  );
  const [glamHistory] = useLocalStorage<GlamHistoryEntry[]>(
    'roop_glam_history',
    [],
  );

  const hasGlow = history.length > 0;
  const hasGlam = glamHistory.length > 0;

  const [progressTab, setProgressTab] = useState<ProgressTab>('glow');

  // Auto-switch to glam tab if there's no glow history but there is glam history
  useEffect(() => {
    if (!hasGlow && hasGlam) {
      setProgressTab('glam');
    }
  }, [hasGlow, hasGlam]);

  const subtitleText =
    progressTab === 'glam'
      ? 'Track how your makeup skills evolve over time.'
      : 'Track how your skin evolves over time.';

  const neitherHasHistory = !hasGlow && !hasGlam;

  return (
    <AppLayout>
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => {
            setShowPremium(false);
            refreshPremium();
          }}
        />
      )}

      <div className="page-progress fade-in" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <span className="page-eyebrow">Your Journey</span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700,
              margin: '0 0 6px',
            }}
          >
            Your <span className="gradient-text">Progress</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
            {subtitleText}
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => hasGlow && setProgressTab('glow')}
            disabled={!hasGlow}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '9px 18px',
              borderRadius: 50,
              cursor: hasGlow ? 'pointer' : 'not-allowed',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s',
              opacity: !hasGlow ? 0.4 : 1,
              background:
                progressTab === 'glow'
                  ? 'linear-gradient(135deg, #a855f7, #9333ea)'
                  : 'var(--bg-card)',
              color: progressTab === 'glow' ? '#fff' : 'var(--text-muted)',
              boxShadow:
                progressTab === 'glow'
                  ? '0 2px 12px rgba(168,85,247,0.35)'
                  : 'none',
              border:
                progressTab === 'glow'
                  ? '1px solid transparent'
                  : ('1px solid var(--border)' as string),
            }}
          >
            🌿 Glow Progress
          </button>

          <button
            onClick={() => hasGlam && setProgressTab('glam')}
            disabled={!hasGlam}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '9px 18px',
              borderRadius: 50,
              cursor: hasGlam ? 'pointer' : 'not-allowed',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s',
              opacity: !hasGlam ? 0.4 : 1,
              background:
                progressTab === 'glam'
                  ? 'linear-gradient(135deg, #ec4899, #be185d)'
                  : 'var(--bg-card)',
              color: progressTab === 'glam' ? '#fff' : 'var(--text-muted)',
              boxShadow:
                progressTab === 'glam'
                  ? '0 2px 12px rgba(236,72,153,0.35)'
                  : 'none',
              border:
                progressTab === 'glam'
                  ? '1px solid transparent'
                  : ('1px solid var(--border)' as string),
            }}
          >
            💄 Glam Progress
          </button>
        </div>

        {/* Content */}
        {neitherHasHistory ? (
          // Combined empty state
          <div className="page-empty">
            <div className="page-empty-icon">📊</div>
            <h3>No analyses yet</h3>
            <p>
              Start a Glow or Glam scan to track your progress over time.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => navigate('/scan')} className="btn-glow">
                🌿 Start Glow Scan
              </button>
              <button
                onClick={() => navigate('/glam-scan')}
                className="btn-glow"
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #be185d)',
                  boxShadow: '0 2px 12px rgba(236,72,153,0.3)',
                }}
              >
                💄 Start Glam Scan
              </button>
            </div>
          </div>
        ) : !hasFullAccess ? (
          // Premium lock covers both tabs
          <div className="locked-section" style={{ minHeight: 'calc(100vh - 320px)' }}>
            <div className="locked-blur-preview" aria-hidden="true">
              {progressTab === 'glow' && hasGlow ? (
                <ProgressContent history={history} navigate={navigate} />
              ) : (
                <GlamProgressContent glamHistory={glamHistory} navigate={navigate} />
              )}
            </div>
            <div className="locked-overlay">
              <div className="locked-overlay-inner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    margin: '0 0 8px',
                    color: 'var(--text-primary)',
                  }}
                >
                  Unlock Your Progress
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    margin: '0 0 20px',
                    lineHeight: 1.6,
                    maxWidth: 280,
                  }}
                >
                  Track your skin and glam journey over time with full scan history and
                  before &amp; after comparisons.
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
        ) : progressTab === 'glow' && hasGlow ? (
          <ProgressContent history={history} navigate={navigate} />
        ) : progressTab === 'glam' && hasGlam ? (
          <GlamProgressContent glamHistory={glamHistory} navigate={navigate} />
        ) : null}
      </div>
    </AppLayout>
  );
}
