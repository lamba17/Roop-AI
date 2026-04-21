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

function glowColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function ProgressContent({ history, navigate }: { history: HistoryEntry[]; navigate: (path: string, opts?: any) => void }) {
  return (
    <>
      {history.length >= 2 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '22px', marginBottom: 16 }}>
          <span className="section-label">Progress Comparison</span>
          <BeforeAfterSlider entries={[...history].reverse()} />
        </div>
      )}

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '22px' }}>
        <span className="section-label">Scan History ({history.length})</span>
        {history.map(entry => (
          <div
            key={entry.id}
            onClick={() => navigate('/results', { state: { entry } })}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
              borderBottom: '1px solid var(--border)', cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {entry.imageUrl ? (
              <img
                src={entry.imageUrl}
                alt="Scan"
                style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0, background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                🤳
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 3 }}>
                {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user ?? null);
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const hasFullAccess = isAdmin || premium;
  const [showPremium, setShowPremium] = useState(false);
  const [history] = useLocalStorage<HistoryEntry[]>(user ? `roop_history_${user.id}` : 'roop_history', []);

  return (
    <AppLayout>
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => { setShowPremium(false); refreshPremium(); }}
        />
      )}

      <div className="page-progress fade-in" style={{ maxWidth: 720 }}>
        {/* Header — always visible */}
        <div style={{ marginBottom: 28 }}>
          <span className="page-eyebrow">Your Journey</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, margin: '0 0 6px' }}>
            Your <span className="gradient-text">Progress</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
            Track how your skin evolves over time.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="page-empty">
            <div className="page-empty-icon">📊</div>
            <h3>No analyses yet</h3>
            <p>Start your skin journey to track progress over time.</p>
            <button onClick={() => navigate('/scan')} className="btn-glow">
              Start Analysis
            </button>
          </div>
        ) : !hasFullAccess ? (
          <div className="locked-section" style={{ minHeight: 420 }}>
            <div className="locked-blur-preview" aria-hidden="true">
              <ProgressContent history={history} navigate={navigate} />
            </div>
            <div className="locked-overlay">
              <div className="locked-overlay-inner">
                <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
                  Unlock Your Progress
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: 280 }}>
                  Track your skin journey over time with full scan history and before &amp; after comparisons.
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
          <ProgressContent history={history} navigate={navigate} />
        )}
      </div>
    </AppLayout>
  );
}
