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
      <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'relative', zIndex: 1 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" fill={color} fontSize="48" fontWeight="800" fontFamily="system-ui">{displayed}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill="rgba(0,0,0,0.4)" fontSize="10" letterSpacing="1.5" fontFamily="system-ui">GLOW SCORE</text>
      </svg>
    </div>
  );
}

function MetricCardColored({ label, value, status, color, bgColor }: { label: string; value: string; status: string; color: string; bgColor: string }) {
  return (
    <div style={{
      background: bgColor, border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16,
      padding: '28px 24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `${color}08`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{status}</div>
        </div>
      </div>
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

      <div style={{ padding: '40px', maxWidth: 1400, margin: '0 auto', background: '#f5f2fa', minHeight: '100vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>

          {/* Main Content */}
          <div>
            {/* Daily Glow Score Card */}
            <div style={{
              background: '#ffffff', border: '1px solid #e5dff2', borderRadius: 28,
              padding: '56px 48px', marginBottom: 28, position: 'relative', overflow: 'hidden',
              textAlign: 'center', boxShadow: '0 4px 16px rgba(124,58,237,0.08)'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.06), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#a885d1', textTransform: 'uppercase', letterSpacing: 2.2, marginBottom: 28 }}>Daily Glow Score</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                  <ScoreRing score={score} />
                </div>
                <div style={{ fontSize: 15, color: '#666666', fontStyle: 'italic', lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>
                  Your skin barrier is 12% more resilient than last Tuesday. Keep up the hydration routine.
                </div>
              </div>
            </div>

            {/* Metrics Grid - 2x3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, marginBottom: 28 }}>
              <MetricCardColored
                label="Comparison"
                value="+5%"
                status="Stable"
                color="#22c55e"
                bgColor="#f0fdf4"
              />
              <MetricCardColored
                label="Hydration Level"
                value="85%"
                status="Optimal"
                color="#06b6d4"
                bgColor="#f0f9fc"
              />

              <MetricCardColored
                label="Sensitivity"
                value="Low"
                status="Improving"
                color="#f59e0b"
                bgColor="#fffbf0"
              />
              <MetricCardColored
                label="Radiance Index"
                value="92%"
                status="Strong"
                color="#a855f7"
                bgColor="#faf5ff"
              />

              <MetricCardColored
                label="Barrier Strength"
                value="High"
                status="Strong"
                color="#22c55e"
                bgColor="#f0fdf4"
              />
              <MetricCardColored
                label="Acne Control"
                value={String(analysis.scores.acne)}
                status={analysis.scores.acne >= 75 ? 'Clear' : 'In Progress'}
                color="#22c55e"
                bgColor="#f0fdf4"
              />
            </div>
          </div>

          {/* Scan History Sidebar */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 20px' }}>Scan History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.slice(0, 5).map((entry, idx) => {
                const date = new Date(entry.date);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                const status = entry.analysis.glowScore >= 75 ? 'Stable' : entry.analysis.glowScore >= 50 ? 'Dryness' : 'Improving';
                const statusColor = status === 'Stable' ? '#22c55e' : status === 'Improving' ? '#f59e0b' : '#ef4444';

                return (
                  <button
                    key={idx}
                    onClick={() => navigate('/results', { state: { entry } })}
                    style={{
                      background: '#ffffff', border: '1px solid #e5dff2', borderRadius: 14,
                      padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
                      textAlign: 'left', display: 'flex', gap: 12, alignItems: 'center',
                      boxShadow: '0 2px 6px rgba(124,58,237,0.05)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#d5cce6';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e5dff2';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(124,58,237,0.05)';
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, #a855f7, #ec4899)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      fontSize: 18, fontWeight: 700, color: 'white'
                    }}>
                      {entry.analysis.glowScore}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 3 }}>Scan #{idx === 0 ? '#1' : `#${idx + 1}`}</div>
                      <div style={{ fontSize: 12, color: '#888888', marginBottom: 4 }}>{dateStr} · {timeStr}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: statusColor }}>{status}</div>
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
