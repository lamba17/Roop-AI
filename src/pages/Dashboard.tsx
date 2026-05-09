import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
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
      <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'relative', zIndex: 1 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12} />
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" fill={color} fontSize="42" fontWeight="800" fontFamily="system-ui">{displayed}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" letterSpacing="2" fontFamily="system-ui">GLOW SCORE</text>
        <text x={cx} y={cy + 36} textAnchor="middle" fill={color} fontSize="13" fontWeight="700" letterSpacing="1.5" fontFamily="system-ui">{glowLabel(score)}</text>
      </svg>
    </div>
  );
}

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

function DashboardContent({ latest }: { latest: HistoryEntry | null }) {
  if (!latest) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>No Analysis Yet</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Run your first skin scan to see your dashboard.</p>
      </div>
    );
  }

  const { analysis } = latest;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
      <MetricCard icon="🎯" label="Acne Control" value={String(analysis.scores.acne)} status={analysis.scores.acne >= 75 ? 'Clear' : 'In Progress'} color="#22c55e" />
      <MetricCard icon="✨" label="Skin Tone" value={String(analysis.scores.skinTone)} status={analysis.scores.skinTone >= 75 ? 'Even' : 'Variable'} color="#a855f7" />
      <MetricCard icon="📐" label="Texture" value={String(analysis.scores.texture)} status={analysis.scores.texture >= 75 ? 'Smooth' : 'Rough'} color="#06b6d4" />
      <MetricCard icon="👁️" label="Dark Circles" value={String(analysis.scores.darkCircles)} status={analysis.scores.darkCircles >= 75 ? 'Light' : 'Visible'} color="#f59e0b" />
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
    ?? '';

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
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'system-ui', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Welcome back, <span style={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{firstName}.</span>
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            {latest ? `Your skin journey is progressing. Last analysis: ${new Date(latest.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Start your first skin scan to unlock your Glow Score.'}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 50, border: 'rgba(168,85,247,0.35)', background: 'rgba(168,85,247,0.08)' }}>
            <span>🌿</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#a855f7', letterSpacing: 0.5 }}>GLOW SCORE</span>
            <span style={{ fontSize: 11, color: 'var(--text-hint)' }}>· Skin analysis</span>
          </div>
        </div>

        {score !== null && (
          <div style={{ marginBottom: 32, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '32px', textAlign: 'center' }}>
            <ScoreRing score={score} />
          </div>
        )}

        {!hasFullAccess ? (
          <div className="locked-section" style={{ minHeight: '300px' }}>
            <div className="locked-blur-preview" aria-hidden="true">
              <DashboardContent latest={latest} />
            </div>
            <div className="locked-overlay">
              <div className="locked-overlay-inner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>Unlock Your Dashboard</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                  View your complete Glow Score metrics, daily routine, and full scan history — all personalized to you.
                </p>
                <button onClick={() => setShowPremium(true)} className="btn-glow" style={{ justifyContent: 'center', fontSize: 14, padding: '12px 28px' }}>
                  🚀 Try Full Access — ₹25 for 7 days
                </button>
              </div>
            </div>
          </div>
        ) : (
          <DashboardContent latest={latest} />
        )}
      </div>
    </AppLayout>
  );
}
