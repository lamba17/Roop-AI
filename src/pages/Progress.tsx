import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import AppLayout from '../components/AppLayout';

function glowColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export default function Progress() {
  const navigate = useNavigate();
  const [history] = useLocalStorage<HistoryEntry[]>('roop_history', []);

  return (
    <AppLayout>
      <div className="page-progress fade-in" style={{ maxWidth: 720 }}>
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
            <button onClick={() => navigate('/')} className="btn-glow">
              Start Analysis
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </AppLayout>
  );
}
