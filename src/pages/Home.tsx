import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import Logo from '../components/Logo';
import { fileToBase64 } from '../utils/imageUtils';
import { useSkinAnalysis } from '../hooks/useSkinAnalysis';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry } from '../types/analysis';

const FREE_LIMIT = 10;

export default function Home() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const { analyze, loading, error } = useSkinAnalysis();
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('roop_history', []);
  const premium = localStorage.getItem('roop_premium') === 'true';

  const todayKey = new Date().toISOString().split('T')[0];
  const todayCount = history.filter(h => h.date.startsWith(todayKey)).length;
  const limitReached = !premium && todayCount >= FREE_LIMIT;

  function handleFile(f: File) {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function handleAnalyze() {
    if (!file) return;
    const base64 = await fileToBase64(file);
    const result = await analyze(base64);
    if (!result) return;

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: result.glowScore,
      imageUrl: preview!,
      analysis: result,
    };

    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    navigate('/results', { state: { entry } });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080818', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1e1e3a', background: '#080818',
      }}>
        <Logo size="sm" />
        <button onClick={() => navigate('/progress')} className="btn-outline" style={{ fontSize: 12, padding: '8px 16px' }}>
          📊 Progress
        </button>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: 520, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <Logo size="lg" showTagline />
            </div>
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.6, margin: 0 }}>
              Upload a selfie and get your Glow Score, personalized routine, product picks, and dermatologist insights — in seconds.
            </p>
          </div>

          <div className="card" style={{ marginBottom: 0 }}>
            <UploadZone onFile={handleFile} preview={preview} />

            {limitReached && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#ef4444' }}>
                  Daily free limit reached (3/day). Upgrade to Premium for unlimited analyses.
                </p>
              </div>
            )}

            {error && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#ef4444' }}>{error}</p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!file || loading || limitReached}
              className="btn-primary"
              style={{ width: '100%', marginTop: 16, fontSize: 15, padding: '14px', justifyContent: 'center' }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Analyzing your skin...
                </>
              ) : '✨ Analyze My Skin'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
              {['Glow Score', 'Daily Routine', 'Product Picks', 'Mask Plan'].map(f => (
                <span key={f} style={{ fontSize: 11, color: '#555', letterSpacing: 0.5 }}>✓ {f}</span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
