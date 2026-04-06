import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

function glowColor(score: number) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export default function Progress() {
  const navigate = useNavigate();
  const [history] = useLocalStorage<HistoryEntry[]>('roop_history', []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="fade-in">
      <header className="header-glass" style={{
        padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size="sm" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <button onClick={() => navigate('/')} className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
            + New Scan
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 60px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 24px', color: 'var(--text-primary)' }}>
          Your <span style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Progress</span>
        </h2>

        {history.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <p style={{ color: '#888', fontSize: 15, marginBottom: 20 }}>No analyses yet. Start your skin journey!</p>
            <button onClick={() => navigate('/')} className="btn-primary">Analyze Now</button>
          </div>
        ) : (
          <>
            {/* Before/After Slider */}
            {history.length >= 2 && (
              <div className="card" style={{ marginBottom: 20 }}>
                <span className="section-label">Progress Comparison</span>
                <BeforeAfterSlider entries={[...history].reverse()} />
              </div>
            )}

            {/* History list */}
            <div className="card">
              <span className="section-label">Scan History ({history.length})</span>
              {history.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => navigate('/results', { state: { entry } })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                    borderBottom: '1px solid #1e1e3a', cursor: 'pointer',
                    transition: 'background 0.2s',
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
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 3 }}>
                      {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: 13, color: '#555' }}>
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
    </div>
  );
}
