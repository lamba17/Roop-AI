import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

function tok() {
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

function glowColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function ScoreRing({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const c = tok();
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

function MetricCardColored({ label, value, status, color }: { label: string; value: string; status: string; color: string }) {
  const c = tok();

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
  useTheme();
  const { refresh: refreshPremium } = usePremium(user ?? null);
  const [showPremium, setShowPremium] = useState(false);
  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);

  const c = tok();
  const latest = history[0];
  const score = latest?.analysis.glowScore ?? null;

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

      <div style={{ padding: '56px 40px', maxWidth: 1400, margin: '0 auto', background: c.surface, minHeight: '100vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 48 }}>

          {/* Main Content */}
          <div>
            {/* Daily Glow Score Card */}
            <div style={{
              background: c.surfaceContainerHigh,
              backdropFilter: 'blur(20px)',
              borderRadius: 28,
              padding: '64px 56px',
              marginBottom: 48,
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
              border: `1px solid ${c.outlineVariant}22`,
              boxShadow: '0 20px 40px rgba(13, 12, 28, 0.4)',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.15), transparent 60%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.primary,
                  textTransform: 'uppercase',
                  letterSpacing: 2.4,
                  marginBottom: 32,
                  fontFamily: "'Inter', system-ui",
                }}>Daily Glow Score</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                  <ScoreRing score={score} />
                </div>
                <div style={{
                  fontSize: 16,
                  color: c.textMuted,
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  maxWidth: 540,
                  margin: '0 auto',
                  fontFamily: "'Manrope', system-ui",
                }}>
                  Your skin barrier is 12% more resilient than last Tuesday. Keep up the hydration routine.
                </div>
              </div>
            </div>

            {/* Metrics Grid - 2x3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 28 }}>
              <MetricCardColored
                label="Comparison"
                value="+5%"
                status="Stable"
                color={c.success}
              />
              <MetricCardColored
                label="Hydration Level"
                value="85%"
                status="Optimal"
                color={c.info}
              />

              <MetricCardColored
                label="Sensitivity"
                value="Low"
                status="Improving"
                color={c.warning}
              />
              <MetricCardColored
                label="Radiance Index"
                value="92%"
                status="Strong"
                color={c.primary}
              />

              <MetricCardColored
                label="Barrier Strength"
                value="High"
                status="Strong"
                color={c.success}
              />
              <MetricCardColored
                label="Acne Control"
                value={String(analysis.scores.acne)}
                status={analysis.scores.acne >= 75 ? 'Clear' : 'In Progress'}
                color={c.success}
              />
            </div>
          </div>

          {/* Scan History Sidebar */}
          <div>
            <h3 style={{
              fontSize: 18,
              fontWeight: 700,
              color: c.textPrimary,
              margin: '0 0 24px',
              fontFamily: "'Epilogue', system-ui",
            }}>Scan History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.slice(0, 5).map((entry, idx) => {
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
                      borderRadius: 14,
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: 'left',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      border: `1px solid ${c.outlineVariant}22`,
                      boxShadow: '0 8px 16px rgba(13, 12, 28, 0.3)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = c.surfaceContainerHighest;
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(13, 12, 28, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = c.surfaceContainerHigh;
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(13, 12, 28, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: c.onPrimary,
                      boxShadow: `0 8px 16px ${c.primary}40`,
                    }}>
                      {entry.analysis.glowScore}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: c.textPrimary,
                        marginBottom: 4,
                        fontFamily: "'Manrope', system-ui",
                      }}>Scan #{idx === 0 ? '#1' : `#${idx + 1}`}</div>
                      <div style={{
                        fontSize: 12,
                        color: c.textMuted,
                        marginBottom: 4,
                        fontFamily: "'Inter', system-ui",
                      }}>{dateStr} · {timeStr}</div>
                      <div style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: statusColor,
                        fontFamily: "'Inter', system-ui",
                      }}>{status}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
