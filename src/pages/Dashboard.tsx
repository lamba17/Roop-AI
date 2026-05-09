import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext';
import { selfieStore } from '../utils/selfieStore';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

function tok(isDark: boolean) {
  if (isDark) {
    return {
      surface: '#171020',
      surfaceContainerLow: '#201829',
      surfaceContainerHigh: '#2f2738',
      surfaceContainerHighest: '#3a3143',
      outlineVariant: '#4A4455',

      textPrimary: '#ebdef5',
      textMuted: '#ccc3d8',
      textHint: '#958da1',

      primary: '#7C3AED',
      primaryContainer: '#7C3AED',
      onPrimary: '#ffffff',

      secondary: '#FFB1C7',
      secondaryContainer: '#BE0062',

      tertiary: '#FFB95F',

      error: '#FFB4AB',
      errorContainer: '#93000A',

      success: '#22c55e',
      info: '#06b6d4',
      warning: '#f59e0b',
    };
  }
  return {
    surface: '#f5f2fa',
    surfaceContainerLow: '#ede9fe',
    surfaceContainerHigh: '#e9e5fd',
    surfaceContainerHighest: '#ddd6fe',
    outlineVariant: '#d0c5e8',

    textPrimary: '#1a1630',
    textMuted: '#55557a',
    textHint: '#9090b8',

    primary: '#7C3AED',
    primaryContainer: '#7C3AED',
    onPrimary: '#ffffff',

    secondary: '#db2777',
    secondaryContainer: '#db2777',

    tertiary: '#FFB95F',

    error: '#dc2626',
    errorContainer: '#fee2e2',

    success: '#16a34a',
    info: '#0891b2',
    warning: '#d97706',
  };
}

function glowColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function ScoreRing({ score, isDark }: { score: number; isDark: boolean }) {
  const [displayed, setDisplayed] = useState(0);
  const c = tok(isDark);
  const r = 54, size = 160, cx = 80, cy = 80;
  const circumference = 2 * Math.PI * r;
  const dash = (displayed / 100) * circumference;
  const color = glowColor(score);

  useEffect(() => {
    setDisplayed(0);
    const start = Date.now();
    const tick = setInterval(() => {
      const p = Math.min((Date.now() - start) / 1400, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(e * score));
      if (p >= 1) clearInterval(tick);
    }, 16);
    return () => clearInterval(tick);
  }, [score]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20 0%, ${color}08 40%, transparent 70%)`,
        pointerEvents: 'none',
        animation: 'pulse-glow 3s ease-in-out infinite',
      }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'relative', zIndex: 1 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 8px ${color}aa)` }}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" fill={color} fontSize="48" fontWeight="800" fontFamily="system-ui">{displayed}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill={c.textHint} fontSize="10" letterSpacing="1.5" fontFamily="system-ui">GLOW SCORE</text>
      </svg>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function MetricCardColored({ label, value, status, color, isDark }: { label: string; value: string; status: string; color: string; isDark: boolean }) {
  const c = tok(isDark);

  return (
    <div style={{
      background: c.surfaceContainerHigh,
      borderRadius: 16,
      padding: '28px 24px',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${c.outlineVariant}22`,
      boxShadow: '0 20px 40px rgba(13, 12, 28, 0.4)',
    }}>
      <div style={{
        position: 'absolute',
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: c.textHint,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginBottom: 14,
          fontFamily: "'Inter', system-ui",
        }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 2 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color, lineHeight: 1, fontFamily: "'Manrope', system-ui" }}>{value}</div>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontFamily: "'Inter', system-ui",
          }}>{status}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { refresh: refreshPremium } = usePremium(user ?? null);
  const [showPremium, setShowPremium] = useState(false);
  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);

  const isDark = theme === 'dark';
  const c = tok(isDark);
  const latest = history[0];
  const score = latest?.analysis.glowScore ?? null;

  useEffect(() => {
    if (latest?.imageUrl) {
      selfieStore.set(latest.imageUrl);
      localStorage.setItem('roop_lastSelfie', latest.imageUrl);
    }
  }, [latest?.imageUrl]);

  if (!latest) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">🌿</div>
          <h3>Welcome to ROOP AI</h3>
          <p>Run your first Glow Score scan to unlock your personalized dashboard.</p>
          <button onClick={() => navigate('/scan')} className="btn-glow">Start Your First Scan</button>
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

      <style>{`
        @media (max-width: 1024px) {
          .dashboard-container {
            padding: 32px 20px !important;
          }
          .dashboard-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .dashboard-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 28px 16px !important;
          }
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 640px) {
          .dashboard-container {
            padding: 24px 16px !important;
          }
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-metrics-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>

      <div className="dashboard-container" style={{ padding: '40px 24px', maxWidth: 1600, margin: '0 auto', background: c.surface, minHeight: '100vh' }}>
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32 }}>

          {/* Left Column: Glow Score + Today's Routine */}
          <div>
            {/* Daily Glow Score Card */}
            <div style={{
              background: c.surfaceContainerHigh,
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              padding: '48px 40px',
              marginBottom: 32,
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
              border: `1px solid ${isDark ? 'rgba(74,68,85,0.22)' : 'rgba(124,58,237,0.15)'}`,
              boxShadow: isDark ? '0 20px 40px rgba(13, 12, 28, 0.4)' : '0 8px 24px rgba(124, 58, 237, 0.12)',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: isDark ? 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.15), transparent 60%)' : 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.08), transparent 60%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: c.primary,
                  textTransform: 'uppercase',
                  letterSpacing: 2.2,
                  marginBottom: 24,
                  fontFamily: "'Inter', system-ui",
                }}>Daily Glow Score</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                  <ScoreRing score={score} isDark={isDark} />
                </div>
                <div style={{
                  fontSize: 14,
                  color: c.textMuted,
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  fontFamily: "'Manrope', system-ui",
                }}>
                  Your skin barrier is 12% more resilient than last Tuesday. Keep up the hydration routine.
                </div>
              </div>
            </div>

            {/* Today's Routine Card */}
            <div style={{
              background: c.surfaceContainerHigh,
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              padding: '32px 24px',
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${isDark ? 'rgba(74,68,85,0.22)' : 'rgba(124,58,237,0.15)'}`,
              boxShadow: isDark ? '0 8px 16px rgba(13, 12, 28, 0.3)' : '0 4px 12px rgba(124, 58, 237, 0.08)',
            }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                color: c.textPrimary,
                marginBottom: 20,
                margin: '0 0 20px',
                fontFamily: "'Epilogue', system-ui",
              }}>Today's Routine</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {analysis.dailyRoutine.morning.map((step, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    fontSize: 13,
                    color: c.textMuted,
                    fontFamily: "'Manrope', system-ui",
                  }}>
                    <span style={{ fontSize: 16 }}>🌅</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Metrics + Scan History */}
          <div>
            {/* Metrics Grid - 2x3 */}
            <div className="dashboard-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
              <MetricCardColored
                label="Comparison"
                value="+5%"
                status="Stable"
                color={c.success}
                isDark={isDark}
              />
              <MetricCardColored
                label="Hydration Level"
                value="85%"
                status="Optimal"
                color={c.info}
                isDark={isDark}
              />

              <MetricCardColored
                label="Sensitivity"
                value="Low"
                status="Improving"
                color={c.warning}
                isDark={isDark}
              />
              <MetricCardColored
                label="Radiance Index"
                value="92%"
                status="Strong"
                color={c.primary}
                isDark={isDark}
              />

              <MetricCardColored
                label="Barrier Strength"
                value="High"
                status="Strong"
                color={c.success}
                isDark={isDark}
              />
              <MetricCardColored
                label="Acne Control"
                value={String(analysis.scores.acne)}
                status={analysis.scores.acne >= 75 ? 'Clear' : 'In Progress'}
                color={c.success}
                isDark={isDark}
              />
            </div>

            {/* Scan History */}
            <div>
              <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                color: c.textPrimary,
                margin: '0 0 16px',
                fontFamily: "'Epilogue', system-ui",
              }}>Scan History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {history.slice(0, 4).map((entry, idx) => {
                  const date = new Date(entry.date);
                  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                  const status = entry.analysis.glowScore >= 75 ? 'Stable' : entry.analysis.glowScore >= 50 ? 'Dryness' : 'Improving';
                  const statusColor = status === 'Stable' ? c.success : status === 'Improving' ? c.warning : '#ef4444';

                  return (
                    <button
                      key={idx}
                      onClick={() => navigate('/results', { state: { entry } })}
                      style={{
                        background: c.surfaceContainerHigh,
                        backdropFilter: 'blur(20px)',
                        borderRadius: 12,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textAlign: 'left',
                        display: 'flex',
                        gap: 10,
                        alignItems: 'center',
                        border: `1px solid ${isDark ? 'rgba(74,68,85,0.22)' : 'rgba(124,58,237,0.15)'}`,
                        boxShadow: isDark ? '0 4px 12px rgba(13, 12, 28, 0.2)' : '0 2px 8px rgba(124, 58, 237, 0.06)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = c.surfaceContainerHighest;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = c.surfaceContainerHigh;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        color: c.onPrimary,
                      }}>
                        {entry.analysis.glowScore}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: c.textPrimary,
                          marginBottom: 2,
                          fontFamily: "'Manrope', system-ui",
                        }}>Scan #{idx === 0 ? '#0824' : `#${String(idx).padStart(4, '0')}`}</div>
                        <div style={{
                          fontSize: 11,
                          color: c.textMuted,
                          fontFamily: "'Inter', system-ui",
                        }}>{dateStr} · {timeStr}</div>
                      </div>
                      <div style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: statusColor,
                        fontFamily: "'Inter', system-ui",
                      }}>{status}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
