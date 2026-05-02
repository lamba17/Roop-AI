import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry, GlamHistoryEntry, AppMode } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';

const ADMIN_EMAILS = ['lamba.akash1994@gmail.com', 'varunvlamba@gmail.com'];

const BRAND = 'linear-gradient(135deg, #7c3aed 0%, #be0062 100%)';

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

/* ── Animated Score Ring ──────────────────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const r = 70, size = 200, cx = 100, cy = 100;
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
      {/* Glow behind ring */}
      <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'relative', zIndex: 1 }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
        {/* Arc */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
        {/* Score */}
        <text x={cx} y={cy - 10} textAnchor="middle" fill={color} fontSize="42" fontWeight="800" fontFamily="system-ui">{displayed}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" letterSpacing="2" fontFamily="system-ui">GLOW SCORE</text>
        {/* Label */}
        <text x={cx} y={cy + 36} textAnchor="middle" fill={color} fontSize="13" fontWeight="700" letterSpacing="1.5" fontFamily="system-ui">{glowLabel(score)}</text>
      </svg>
    </div>
  );
}

/* ── Metric Card ──────────────────────────────────────────────────────────── */
function MetricCard({ icon, label, value, status, color, tag }: { icon: string; label: string; value: string; status: string; color: string; tag?: string }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20,
      padding: '20px 22px', position: 'relative', overflow: 'hidden',
      transition: 'transform 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.borderColor = `${color}44`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${color}15`, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 22 }}>{icon}</div>
        {tag && (
          <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}18`, padding: '3px 10px', borderRadius: 20, letterSpacing: 0.5 }}>{tag}</span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, marginBottom: 4, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
        <span style={{ fontSize: 12, color, fontWeight: 600 }}>{status}</span>
      </div>
    </div>
  );
}

/* ── Routine Step ─────────────────────────────────────────────────────────── */
function RoutineStep({ step, index, done }: { step: string; index: number; done: boolean }) {
  const icons = ['🧴', '💧', '☀️', '🌿', '✨'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
        {icons[index % icons.length]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 }}>AM PROTOCOL · STEP {index + 1}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{step}</div>
      </div>
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${done ? '#22c55e' : 'var(--border)'}`, background: done ? '#22c55e22' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
    </div>
  );
}

/* ── Scan History Item ────────────────────────────────────────────────────── */
function ScanItem({ entry, index, navigate }: { entry: HistoryEntry; index: number; navigate: (p: string, o?: any) => void }) {
  const color = glowColor(entry.score);
  return (
    <div onClick={() => navigate('/results', { state: { entry } })}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'opacity 0.15s' }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
    >
      {entry.imageUrl ? (
        <img src={entry.imageUrl} alt="scan" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🤳</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Scan #{String(index + 1).padStart(4, '0')}</div>
        <div style={{ fontSize: 11, color: 'var(--text-hint)' }}>
          {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {entry.analysis.skinType}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{entry.score}</div>
        <div style={{ fontSize: 10, color: 'var(--text-hint)', marginTop: 2 }}>score</div>
      </div>
    </div>
  );
}

/* ── Dashboard Content ────────────────────────────────────────────────────── */
function DashboardContent({ history, latest, score, navigate }: any) {
  const analysis = latest?.analysis;

  const metrics = latest ? [
    {
      icon: '💧', label: 'Hydration Level',
      value: analysis.skinType === 'dry' ? '42%' : analysis.skinType === 'oily' ? '78%' : '65%',
      status: analysis.skinType === 'dry' ? 'Low' : analysis.skinType === 'oily' ? 'High' : 'Normal',
      color: '#06b6d4', tag: analysis.skinType === 'oily' ? 'Optimal' : undefined,
    },
    {
      icon: '🌿', label: 'Sensitivity',
      value: analysis.scores.acne >= 70 ? 'Low' : analysis.scores.acne >= 50 ? 'Moderate' : 'High',
      status: analysis.scores.acne >= 70 ? 'Stable' : 'Monitor',
      color: '#22c55e', tag: analysis.scores.acne >= 70 ? 'Stable' : undefined,
    },
    {
      icon: '✨', label: 'Radiance Index',
      value: `${analysis.scores.skinTone}%`,
      status: analysis.scores.skinTone >= 75 ? 'Optimal' : 'Improving',
      color: '#a855f7', tag: analysis.scores.skinTone >= 75 ? 'Optimal' : undefined,
    },
    {
      icon: '🛡️', label: 'Barrier Strength',
      value: analysis.scores.texture >= 70 ? 'High' : analysis.scores.texture >= 50 ? 'Moderate' : 'Low',
      status: analysis.scores.texture >= 70 ? 'Strong' : 'Moderate',
      color: '#f59e0b', tag: analysis.scores.texture >= 70 ? 'Strong' : undefined,
    },
  ] : null;

  const insightLine = latest
    ? `Your ${analysis.skinType} skin shows ${analysis.concerns[0]?.toLowerCase() ?? 'good overall health'}. Keep up the routine.`
    : 'Start your first scan to unlock personalized insights.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Row 1: Score + Metrics ── */}
      <div className="dash-row-1" style={{ display: 'grid', gap: 16, alignItems: 'start' }}>

        {/* Glow Score Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 10, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 2, alignSelf: 'flex-start', position: 'relative', zIndex: 1 }}>Daily Glow Score</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            {score !== null ? (
              <ScoreRing score={score} />
            ) : (
              <div style={{ width: 200, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--text-hint)' }}>No scan yet</div>
                <button onClick={() => navigate('/scan')} className="btn-glow" style={{ fontSize: 13, padding: '10px 20px' }}>Start Analysis</button>
              </div>
            )}
          </div>
          {latest && (
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 14px' }}>{insightLine}</p>
              <button onClick={() => navigate('/results', { state: { entry: latest } })}
                style={{ background: BRAND, border: 'none', borderRadius: 50, padding: '10px 24px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }}>
                View Full Report →
              </button>
            </div>
          )}
        </div>

        {/* Metrics 2×2 */}
        {metrics ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {metrics.map(m => <MetricCard key={m.label} {...m} />)}
          </div>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '40px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 40 }}>🔬</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>Complete your first analysis to unlock personalised metrics.</p>
            <button onClick={() => navigate('/scan')} className="btn-glow" style={{ fontSize: 13 }}>Analyse My Skin</button>
          </div>
        )}
      </div>

      {/* ── Row 2: Routine + Scan History ── */}
      <div className="dash-row-2" style={{ display: 'grid', gap: 16, alignItems: 'start' }}>

        {/* Today's Routine */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>Today's Routine</div>
            <button onClick={() => navigate('/routine')}
              style={{ background: 'none', border: 'none', color: '#a855f7', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              View Full Protocol
            </button>
          </div>
          {latest ? (
            analysis.dailyRoutine.morning.slice(0, 3).map((step: string, i: number) => (
              <RoutineStep key={i} step={step} index={i} done={i === 0} />
            ))
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-hint)', marginTop: 16 }}>No routine yet. Complete a skin scan first.</p>
          )}
        </div>

        {/* Scan History */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>Scan History</div>
            <button onClick={() => navigate('/progress')}
              style={{ background: 'none', border: 'none', color: '#a855f7', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              View All Records →
            </button>
          </div>
          {history.length > 0 ? (
            history.slice(0, 4).map((entry: HistoryEntry, i: number) => (
              <ScanItem key={entry.id} entry={entry} index={i} navigate={navigate} />
            ))
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-hint)', marginTop: 16 }}>No scans yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}

/* ── Glam Score Ring (dashboard variant) ─────────────────────────────────── */
function GlamScoreRing({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const r = 70, size = 200, cx = 100, cy = 100;
  const circ = 2 * Math.PI * r;
  const dash = (displayed / 100) * circ;

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
      <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(189,157,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'relative', zIndex: 1 }}>
        <defs>
          <linearGradient id="glamDashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bd9dff" />
            <stop offset="100%" stopColor="#ff6a9f" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={12} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="url(#glamDashGrad)" strokeWidth={12} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)', filter: 'drop-shadow(0 0 8px rgba(189,157,255,0.5))' }}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#bd9dff" fontSize="42" fontWeight="800" fontFamily="system-ui">{displayed}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="var(--text-hint)" fontSize="11" letterSpacing="2" fontFamily="system-ui">GLAM SCORE</text>
        <text x={cx} y={cy + 36} textAnchor="middle" fill="#ff6a9f" fontSize="13" fontWeight="700" letterSpacing="1.5" fontFamily="system-ui">
          {score >= 80 ? 'ELITE' : score >= 65 ? 'PRO' : score >= 50 ? 'RISING' : 'DEVELOPING'}
        </text>
      </svg>
    </div>
  );
}

/* ── Glam Dashboard Content ───────────────────────────────────────────────── */
function GlamDashboardContent({ latestGlam, navigate }: { latestGlam: GlamHistoryEntry | undefined; navigate: (p: string, o?: any) => void }) {
  if (!latestGlam) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="dash-row-1" style={{ display: 'grid', gap: 16, alignItems: 'start' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(189,157,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ fontSize: 10, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 2, alignSelf: 'flex-start' }}>Glam Score</div>
            <div style={{ width: 200, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ fontSize: 40 }}>💄</div>
              <div style={{ fontSize: 13, color: 'var(--text-hint)', textAlign: 'center' }}>No glam scan yet</div>
              <button onClick={() => navigate('/scan', { state: { mode: 'glam' } })} className="btn-glow" style={{ fontSize: 13, padding: '10px 20px' }}>
                Start Glam Scan
              </button>
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '40px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 40 }}>✨</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>Upload a makeup selfie to get your Glam Score, look analysis, and expert correction tips.</p>
            <button onClick={() => navigate('/scan', { state: { mode: 'glam' } })} className="btn-glow" style={{ fontSize: 13 }}>Analyse My Makeup</button>
          </div>
        </div>
      </div>
    );
  }

  const a = latestGlam.analysis;
  const glamMetrics = [
    { icon: '👁', label: 'Eye Makeup', value: `${Math.round((a.scores.eyeshadow + a.scores.eyeliner + a.scores.mascara) / 3)}%`, color: '#bd9dff', tag: a.scores.eyeshadow >= 75 ? 'Flawless' : undefined },
    { icon: '✨', label: 'Face Makeup', value: `${Math.round((a.scores.foundation + a.scores.concealer + a.scores.blush) / 3)}%`, color: '#ff6a9f', tag: a.scores.foundation >= 75 ? 'Blended' : undefined },
    { icon: '💋', label: 'Lip Products', value: `${Math.round((a.scores.lipstick + a.scores.gloss) / 2)}%`, color: '#f59e0b', tag: a.scores.lipstick >= 75 ? 'Perfect' : undefined },
    { icon: '🎨', label: 'Overall Finish', value: `${a.scores.overall}%`, color: '#22c55e', tag: a.scores.overall >= 75 ? 'Polished' : undefined },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="dash-row-1" style={{ display: 'grid', gap: 16, alignItems: 'start' }}>
        {/* Glam Score Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(189,157,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 10, color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: 2, alignSelf: 'flex-start', position: 'relative', zIndex: 1 }}>Glam Score</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <GlamScoreRing score={latestGlam.score} />
          </div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 6px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.currentLook}</span> · {a.makeupStyle} style
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 14px' }}>{a.skinToneMatch}</p>
            <button
              onClick={() => navigate('/glam-results', { state: { analysis: a, imageUrl: latestGlam.imageUrl } })}
              style={{ background: 'linear-gradient(135deg,#7c3aed,#be0062)', border: 'none', borderRadius: 50, padding: '10px 24px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 }}>
              View Full Glam Report →
            </button>
          </div>
        </div>

        {/* Glam Metrics 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {glamMetrics.map(m => <MetricCard key={m.label} {...m} status={m.tag ?? 'Check'} />)}
        </div>
      </div>

      {/* Missing elements + history row */}
      <div className="dash-row-2" style={{ display: 'grid', gap: 16, alignItems: 'start' }}>
        {/* Missing elements */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '24px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Missing From Look</div>
          {a.missingElements.length > 0 ? (
            a.missingElements.slice(0, 3).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,106,159,0.12)', border: '1px solid rgba(255,106,159,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#ff6a9f', flexShrink: 0 }}>✕</div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{item}</p>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-hint)', marginTop: 8 }}>Your look is complete! 💄</p>
          )}
        </div>

        {/* Glam scan history */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>Glam History</div>
            <button onClick={() => navigate('/scan', { state: { mode: 'glam' } })} style={{ background: 'none', border: 'none', color: '#a855f7', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}>New Scan →</button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 10px', fontStyle: 'italic' }}>"{a.currentLook}" · {a.makeupStyle} style</p>
          {a.corrections.slice(0, 2).map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(189,157,255,0.15)', border: '1px solid rgba(189,157,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#bd9dff', flexShrink: 0 }}>{i + 1}</div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{c}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Mode Picker (shown on first login before mode is chosen) ─────────────── */
function DashboardModePicker({ firstName, onPick }: { firstName: string; onPick: (m: AppMode) => void }) {
  const [hovered, setHovered] = useState<AppMode | null>(null);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 0' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'system-ui', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
          Welcome{firstName ? `, ` : ''}{firstName
            ? <span style={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{firstName}.</span>
            : '.'}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Choose your analysis mode to get started. This sets up your personalised dashboard.
        </p>
      </div>

      {/* Mode cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Glow Score */}
        <button
          onClick={() => onPick('glow')}
          onMouseEnter={() => setHovered('glow')}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: hovered === 'glow' ? 'rgba(168,85,247,0.08)' : 'var(--bg-card)',
            border: `2px solid ${hovered === 'glow' ? 'rgba(168,85,247,0.55)' : 'rgba(168,85,247,0.2)'}`,
            borderRadius: 24, padding: '32px 24px', cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 16,
            boxShadow: hovered === 'glow' ? '0 8px 32px rgba(168,85,247,0.15)' : 'none',
            transform: hovered === 'glow' ? 'translateY(-3px)' : 'none',
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🌿</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#a855f7', letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>Glow Score</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Skin Health Intelligence</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>Upload a bare-face selfie. Get skin analysis, daily routine, product picks, and dermatologist advice.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {['Acne & texture analysis', 'Personalised daily routine', 'Product recommendations', 'Specialist access'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 4, padding: '10px 0', borderRadius: 50, background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textAlign: 'center' }}>
            Start with Glow Score →
          </div>
        </button>

        {/* Glam Score */}
        <button
          onClick={() => onPick('glam')}
          onMouseEnter={() => setHovered('glam')}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: hovered === 'glam' ? 'rgba(236,72,153,0.08)' : 'var(--bg-card)',
            border: `2px solid ${hovered === 'glam' ? 'rgba(236,72,153,0.55)' : 'rgba(236,72,153,0.2)'}`,
            borderRadius: 24, padding: '32px 24px', cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 16,
            boxShadow: hovered === 'glam' ? '0 8px 32px rgba(236,72,153,0.15)' : 'none',
            transform: hovered === 'glam' ? 'translateY(-3px)' : 'none',
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>💄</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#ec4899', letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>Glam Score</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Makeup AI Coach</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>Upload a makeup selfie. Get scored on eyes, skin, and lips — plus shade match, missing products, and pro tips.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {['Eyes, skin & lips scoring', 'Foundation shade match', 'Missing product detection', 'Artist consultation'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 4, padding: '10px 0', borderRadius: 50, background: 'linear-gradient(135deg, #ec4899, #a855f7)', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textAlign: 'center' }}>
            Start with Glam Score →
          </div>
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-hint)', marginTop: 20 }}>
        You can switch modes anytime from your profile settings.
      </p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user ?? null);
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);
  const [scoreMode, setScoreMode] = useLocalStorage<AppMode | null>('roop_score_mode', null);
  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);
  const [glamHistory] = useLocalStorage<GlamHistoryEntry[]>('roop_glam_history', []);

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? '';

  const latest = history[0];
  const score  = latest?.analysis.glowScore ?? null;
  const latestGlam = glamHistory[0];
  // Use explicitly chosen mode — don't infer from history
  const activeMode: AppMode = scoreMode ?? 'glow';

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

        {/* ── Mode not chosen yet: show picker ── */}
        {!scoreMode ? (
          <DashboardModePicker firstName={firstName} onPick={m => { setScoreMode(m); navigate('/scan'); }} />
        ) : (
          <>
            {/* Welcome Header */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: 'system-ui', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                Welcome back, <span style={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{firstName}.</span>
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                {activeMode === 'glow'
                  ? (latest ? `Your skin journey is progressing. Last analysis: ${new Date(latest.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Start your first skin scan to unlock your Glow Score.')
                  : (latestGlam ? `Your makeup journey is progressing. Last scan: ${new Date(latestGlam.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Start your first glam scan to unlock your Glam Score.')}
              </p>
            </div>

            {/* Active mode badge + switch link */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 50, border: `1px solid ${activeMode === 'glam' ? 'rgba(236,72,153,0.35)' : 'rgba(168,85,247,0.35)'}`, background: activeMode === 'glam' ? 'rgba(236,72,153,0.08)' : 'rgba(168,85,247,0.08)' }}>
                <span>{activeMode === 'glam' ? '💄' : '🌿'}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: activeMode === 'glam' ? '#ec4899' : '#a855f7', letterSpacing: 0.5 }}>
                  {activeMode === 'glam' ? 'GLAM SCORE' : 'GLOW SCORE'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>
                  {activeMode === 'glam' ? '· Makeup analysis active' : '· Skin analysis active'}
                </span>
              </div>
              <button
                onClick={() => setScoreMode(null)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(124,58,237,0.10)', border: '1.5px solid rgba(124,58,237,0.35)',
                  borderRadius: 50, padding: '6px 14px', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, color: '#a855f7', letterSpacing: 0.3,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  transition: 'background 0.18s, border-color 0.18s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.2)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(124,58,237,0.6)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.10)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(124,58,237,0.35)'; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>
                </svg>
                {activeMode === 'glam' ? '🌿 Switch to Glow Mode' : '💄 Switch to Glam Mode'}
              </button>
            </div>

            {!hasFullAccess ? (
              <div className="locked-section" style={{ minHeight: 'calc(100vh - 320px)' }}>
                <div className="locked-blur-preview" aria-hidden="true">
                  {activeMode === 'glow'
                    ? <DashboardContent history={history} latest={latest} score={score} navigate={navigate} />
                    : <GlamDashboardContent latestGlam={latestGlam} navigate={navigate} />}
                </div>
                <div className="locked-overlay">
                  <div className="locked-overlay-inner">
                    <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>Unlock Your Dashboard</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                      View your {activeMode === 'glam' ? 'Glam Score, look analysis, and makeup corrections' : 'Glow Score, skin metrics, daily routine, and full scan history'} — all personalised to you.
                    </p>
                    <button onClick={() => setShowPremium(true)} className="btn-glow" style={{ justifyContent: 'center', fontSize: 14, padding: '12px 28px' }}>
                      🚀 Try Full Access — ₹25 for 7 days
                    </button>
                    <p style={{ fontSize: 11, color: 'var(--text-hint)', marginTop: 10 }}>Then just ₹49/month · Cancel anytime · No surprises</p>
                  </div>
                </div>
              </div>
            ) : activeMode === 'glow' ? (
              <DashboardContent history={history} latest={latest} score={score} navigate={navigate} />
            ) : (
              <GlamDashboardContent latestGlam={latestGlam} navigate={navigate} />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
