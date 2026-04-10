import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import { useLanguage } from '../context/LanguageContext';
import { fileToBase64 } from '../utils/imageUtils';
import { useSkinAnalysis } from '../hooks/useSkinAnalysis';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth, uploadSelfie } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';
import AppLayout from '../components/AppLayout';
import type { HistoryEntry } from '../types/analysis';

const FREE_LIMIT = 3;

const ANALYSIS_TIPS = [
  { icon: '☀️', title: 'Natural Lighting', desc: 'Stand near a window in soft daylight for best results.' },
  { icon: '🧼', title: 'Clean Face', desc: 'Remove makeup and cleanse before scanning.' },
  { icon: '📐', title: 'Neutral Angle', desc: 'Look straight into the camera at eye level.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const { analyze, loading, error } = useSkinAnalysis();
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('roop_history', []);
  const [showPremium, setShowPremium] = useState(false);
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user);

  const todayKey = new Date().toISOString().split('T')[0];
  const todayCount = history.filter(h => h.date.startsWith(todayKey)).length;
  const limitReached = !premium && todayCount >= FREE_LIMIT;

  function handleFile(f: File) {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function handleAnalyze() {
    if (!file || !user) return;
    const base64 = await fileToBase64(file);
    const result = await analyze(base64, lang);
    if (!result) return;

    let imageUrl = '';
    try {
      imageUrl = await uploadSelfie(user.id, file);
    } catch {
      // Storage upload failed — store empty string
    }

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: result.glowScore,
      imageUrl,
      analysis: result,
    };

    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    navigate('/results', { state: { entry, localImageUrl: preview } });
  }

  return (
    <AppLayout>
      {/* Premium modal */}
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => { setShowPremium(false); refreshPremium(); }}
        />
      )}

      <div className="page-analysis">
        {/* Left: Upload area */}
        <div className="analysis-main">
          <div className="analysis-header">
            <span className="page-eyebrow">AI-Powered Analysis</span>
            <h1 className="analysis-title">Upload Skin <span className="gradient-text">Profile</span></h1>
            <p className="analysis-subtitle">
              Upload a clear selfie to receive your personalised Glow Score, skin report, routine, and product recommendations.
            </p>
          </div>

          {!user ? (
            /* Sign-in gate */
            <div className="analysis-signin-gate">
              <div className="signin-gate-icon">🔒</div>
              <h3 className="signin-gate-title">Sign in to analyse your skin</h3>
              <p className="signin-gate-desc">
                Create a free account to get your Glow Score, personalised routine, and more.
              </p>
              <button
                onClick={() => navigate('/signin')}
                className="btn-glow"
                style={{ justifyContent: 'center' }}
              >
                <span>🔑</span> Sign In / Create Account
              </button>
            </div>
          ) : (
            <>
              {/* Upload zone */}
              <div className="analysis-upload-wrap">
                <UploadZone onFile={handleFile} preview={preview} />
              </div>

              {/* Limit warning */}
              {limitReached && (
                <div className="analysis-limit-banner">
                  <p>⚠️ You've used all <strong>3 free analyses</strong> for today.</p>
                  <button
                    onClick={() => setShowPremium(true)}
                    className="btn-glow"
                    style={{ justifyContent: 'center', fontSize: 13, padding: '10px 20px' }}
                  >
                    ✨ Upgrade for Unlimited
                  </button>
                </div>
              )}

              {/* API Error */}
              {error && (
                <div className="analysis-error-banner">
                  <p>{error}</p>
                </div>
              )}

              {/* Analyse button */}
              <button
                onClick={handleAnalyze}
                disabled={!file || loading || limitReached}
                className="btn-glow analysis-cta"
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                    Analysing your skin…
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 18 }}>✨</span>
                    Analyse My Skin
                  </>
                )}
              </button>
            </>
          )}

          <p className="analysis-privacy">
            🔒 &nbsp;Your photo is never stored on our servers without your consent
          </p>
        </div>

        {/* Right: Tips + Previous Analysis */}
        <div className="analysis-sidebar">
          {/* Tips panel */}
          <div className="analysis-tips-panel">
            <div className="tips-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>Analysis Tips</span>
            </div>
            <div className="tips-list">
              {ANALYSIS_TIPS.map(tip => (
                <div key={tip.title} className="tip-item">
                  <div className="tip-icon">{tip.icon}</div>
                  <div>
                    <div className="tip-title">{tip.title}</div>
                    <div className="tip-desc">{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous analysis */}
          {history.length > 0 && (
            <div className="analysis-prev-panel">
              <div className="prev-header">Previous Analysis</div>
              {history.slice(0, 2).map(entry => (
                <div
                  key={entry.id}
                  className="prev-item"
                  onClick={() => navigate('/results', { state: { entry } })}
                >
                  {entry.imageUrl ? (
                    <img src={entry.imageUrl} alt="prev" className="prev-thumb"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="prev-thumb prev-thumb-placeholder">🤳</div>
                  )}
                  <div className="prev-info">
                    <div className="prev-date">
                      {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="prev-type">{entry.analysis.skinType} skin</div>
                  </div>
                  <div className="prev-score">{entry.score}</div>
                </div>
              ))}
            </div>
          )}

          {/* Premium upgrade */}
          {user && !premium && (
            <div className="analysis-upgrade-panel">
              <div className="upgrade-icon">⭐</div>
              <div className="upgrade-title">Go Premium</div>
              <div className="upgrade-desc">Unlimited analyses, PDF reports, advanced insights</div>
              <button onClick={() => setShowPremium(true)} className="btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
