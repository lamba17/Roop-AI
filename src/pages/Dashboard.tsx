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

      <div style={{ padding: '40px', maxWidth: 1400, margin: '0 auto', background: '#f8f6fc', minHeight: '100vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>

          {/* Main Content */}
          <div>
            {/* Daily Glow Score Card */}
            <div style={{
              background: '#ffffff', border: '1px solid #e8e2f0', borderRadius: 24,
              padding: '48px 40px', marginBottom: 32, position: 'relative', overflow: 'hidden',
              textAlign: 'center', boxShadow: '0 4px 12px rgba(124,58,237,0.08)'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.08), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#a885d1', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24 }}>Daily Glow Score</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                  <ScoreRing score={score} />
                </div>
                <div style={{ fontSize: 14, color: '#666666', fontStyle: 'italic', lineHeight: 1.6 }}>
                  Your skin barrier is 12% more resilient than last Tuesday. Keep up the hydration routine.
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
              {/* Comparison Card */}
              <div style={{
                background: '#ffffff', border: '1px solid #e8e2f0', borderRadius: 16,
                padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(124,58,237,0.06)'
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Stable</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e' }}>+5%</div>
                    <div style={{ fontSize: 13, color: '#888888' }}>vs last scan</div>
                  </div>
                </div>
              </div>

              {/* Hydration Card */}
              <div style={{
                background: '#ffffff', border: '1px solid #e8e2f0', borderRadius: 16,
                padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(124,58,237,0.06)'
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(6,182,212,0.1)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#999999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Hydration Level</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#06b6d4' }}>85%</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: 0.5 }}>Optimal</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
              {/* Sensitivity Card */}
              <div style={{
                background: '#ffffff', border: '1px solid #e8e2f0', borderRadius: 16,
                padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(124,58,237,0.06)'
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(249,158,11,0.1)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#999999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Sensitivity</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b' }}>Low</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Improving</div>
                  </div>
                </div>
              </div>

              {/* Radiance Card */}
              <div style={{
                background: '#ffffff', border: '1px solid #e8e2f0', borderRadius: 16,
                padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(124,58,237,0.06)'
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(168,85,247,0.1)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#999999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Radiance Index</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#a855f7' }}>92%</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#a855f7', textTransform: 'uppercase', letterSpacing: 0.5 }}>Strong</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Barrier Strength & Acne Control */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {/* Barrier Card */}
              <div style={{
                background: '#ffffff', border: '1px solid #e8e2f0', borderRadius: 16,
                padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(124,58,237,0.06)'
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#999999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Barrier Strength</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#22c55e' }}>High</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 0.5 }}>Strong</div>
                  </div>
                </div>
              </div>

              {/* Acne Card */}
              <div style={{
                background: '#ffffff', border: '1px solid #e8e2f0', borderRadius: 16,
                padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(124,58,237,0.06)'
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#999999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Acne Control</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#22c55e' }}>{analysis.scores.acne}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 0.5 }}>Clear</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scan History Sidebar */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 24px' }}>Scan History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.slice(0, 5).map((entry, idx) => {
                const date = new Date(entry.date);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                const status = entry.analysis.glowScore >= 75 ? 'Stable' : entry.analysis.glowScore >= 50 ? 'Dryness' : 'Improving';

                return (
                  <button
                    key={idx}
                    onClick={() => navigate('/results', { state: { entry } })}
                    style={{
                      background: '#ffffff', border: '1px solid #e8e2f0', borderRadius: 12,
                      padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
                      textAlign: 'left', display: 'flex', gap: 12, alignItems: 'center',
                      boxShadow: '0 2px 6px rgba(124,58,237,0.05)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#d8cce8';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e8e2f0';
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
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>Scan #{idx === 0 ? '#1' : `#${idx + 1}`}</div>
                      <div style={{ fontSize: 12, color: '#888888', marginBottom: 4 }}>{dateStr} · {timeStr}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: status === 'Stable' ? '#22c55e' : status === 'Improving' ? '#f59e0b' : '#ef4444' }}>{status}</div>
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
