import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

function glowColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}


function ScoreRing({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
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
      <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'relative', zIndex: 1 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" fill={color} fontSize="48" fontWeight="800" fontFamily="system-ui">{displayed}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" letterSpacing="1.5" fontFamily="system-ui">GLOW SCORE</text>
      </svg>
    </div>
  );
}

function MetricCard({ icon, label, value, status, color }: { icon: string; label: string; value: string; status: string; color: string }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16,
      padding: '18px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: `${color}12`, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 18 }}>{icon}</div>
        <span style={{ fontSize: 9, fontWeight: 700, color, background: `${color}18`, padding: '2px 8px', borderRadius: 12, letterSpacing: 0.5 }}>{status}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1, marginBottom: 4, letterSpacing: '-0.01em' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refresh: refreshPremium } = usePremium(user ?? null);
  const [showPremium, setShowPremium] = useState(false);
  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);

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

      <div className="page-dashboard" style={{ padding: '32px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>

          {/* Main Content */}
          <div>
            {/* Daily Glow Score Card */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24,
              padding: 40, marginBottom: 32, position: 'relative', overflow: 'hidden',
              textAlign: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.12), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Daily Glow Score</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                  <ScoreRing score={score} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Your skin barrier is 12% more resilient than last Tuesday. Keep up the hydration routine.
                </div>
              </div>
            </div>

            {/* Comparison & Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16,
                padding: '20px', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: -12, right: -12, width: 50, height: 50, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>+5%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>vs last scan</div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 0.5 }}>Stable</div>
              </div>

              <MetricCard icon="💧" label="Hydration Level" value="85%" status="Optimal" color="#06b6d4" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
              <MetricCard icon="😊" label="Sensitivity" value="Low" status="Improving" color="#f59e0b" />
              <MetricCard icon="✨" label="Radiance Index" value="92%" status="Strong" color="#a855f7" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 40 }}>
              <MetricCard icon="🛡️" label="Barrier Strength" value="High" status="Strong" color="#22c55e" />
              <MetricCard icon="🎯" label="Acne Control" value={String(analysis.scores.acne)} status={analysis.scores.acne >= 75 ? 'Clear' : 'In Progress'} color="#22c55e" />
            </div>

            {/* Today's Routine */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Today's Routine</h3>
                <button
                  onClick={() => navigate('/results', { state: { entry: latest } })}
                  style={{
                    background: 'none', border: 'none', color: '#a855f7', fontSize: 13,
                    fontWeight: 600, cursor: 'pointer', textDecoration: 'none'
                  }}
                >
                  View Full Protocol →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {analysis.dailyRoutine.morning.slice(0, 3).map((step, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
                    padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, background: 'rgba(168,85,247,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      fontSize: 16, fontWeight: 700, color: '#a855f7'
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>AM PROTOCOL · STEP {i + 1}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step}</div>
                    </div>
                    <input type="checkbox" style={{ width: 20, height: 20, cursor: 'pointer', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scan History Sidebar */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px' }}>Scan History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.slice(0, 5).map((entry, idx) => {
                const date = new Date(entry.date);
                const dateStr = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${date.getFullYear().toString().slice(2)}`;
                const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const status = entry.analysis.glowScore >= 75 ? 'Stable' : entry.analysis.glowScore >= 50 ? 'Dryness' : 'Improving';
                const statusColor = entry.analysis.glowScore >= 75 ? '#22c55e' : entry.analysis.glowScore >= 50 ? '#ef4444' : '#f59e0b';

                return (
                  <button
                    key={idx}
                    onClick={() => navigate('/results', { state: { entry } })}
                    style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
                      padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.2s',
                      textAlign: 'left', display: 'flex', gap: 12, alignItems: 'center'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, #a855f7, #ec4899)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      fontSize: 18, fontWeight: 700, color: 'white'
                    }}>
                      {entry.analysis.glowScore}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Scan #{idx + 1}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-hint)' }}>{dateStr} · {timeStr}</div>
                      <div style={{ fontSize: 10, color: statusColor, fontWeight: 600, marginTop: 4 }}>{status}</div>
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
