import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import Logo from '../components/Logo';
import UserMenu from '../components/UserMenu';
import ThemeToggle from '../components/ThemeToggle';
import { fileToBase64 } from '../utils/imageUtils';
import { useSkinAnalysis } from '../hooks/useSkinAnalysis';
import { useGlamAnalysis } from '../hooks/useGlamAnalysis';
import { useGuideAnalysis } from '../hooks/useGuideAnalysis';
import { useBridalPlan } from '../hooks/useBridalPlan';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth, uploadSelfie } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';
import { useThemeColors } from '../hooks/useTheme';
import type { HistoryEntry, GlamHistoryEntry, AppMode } from '../types/analysis';

const FREE_LIMIT = 9999; // unlimited on Testing branch

const MODES: Array<{ id: AppMode; icon: string; label: string; sub: string; dual: boolean; premium?: boolean; heading: string; tagline: string }> = [
  { id: 'glow', icon: '🌿', label: 'GLOW SCORE', sub: 'No makeup · Skin health',     dual: false, heading: 'Your AI-Powered Skin Coach',  tagline: 'Upload a bare-face selfie — get your Glow Score, daily routine, product picks, and dermatologist insights.' },
  { id: 'glam', icon: '💄', label: 'GLAM SCORE', sub: 'Makeup selfie · Makeup coach', dual: false, heading: 'Your AI-Powered Makeup Coach', tagline: "Upload a makeup selfie — get your Glam Score, what's missing from your look, and expert correction tips." },
];

const PARTICLES: Array<[number, number, number, number, string]> = [
  [5, 8, 18, 0, '#7c3aed'], [3, 25, 24, 3, '#db2777'],
  [4, 55, 20, 6, '#a855f7'], [6, 72, 28, 1.5, '#db2777'],
  [3, 88, 16, 9, '#7c3aed'], [4, 42, 22, 4.5, '#f59e0b'],
];

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const tc = useThemeColors();
  const [mode, setMode] = useState<AppMode>((location.state as any)?.mode ?? 'glow');
  const [skinFile, setSkinFile] = useState<File | null>(null);
  const [skinPreview, setSkinPreview] = useState<string | undefined>();
  const [makeupFile, setMakeupFile] = useState<File | null>(null);
  const [makeupPreview, setMakeupPreview] = useState<string | undefined>();
  const [showPremium, setShowPremium] = useState(false);

  const { analyze: analyzeGlow, loading: glowLoading, error: glowError } = useSkinAnalysis();
  const { analyze: analyzeGlam, loading: glamLoading, error: glamError } = useGlamAnalysis();
  // guide/bridal reserved for future release
  const _analyzeGuide = useGuideAnalysis().analyze;
  const _analyzeBridal = useBridalPlan().analyze;
  void _analyzeGuide; void _analyzeBridal;

  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('roop_history', []);
  const [glamHistory, setGlamHistory] = useLocalStorage<GlamHistoryEntry[]>('roop_glam_history', []);
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user);

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]
    ?? user?.email?.split('@')[0] ?? null;

  const todayKey = new Date().toISOString().split('T')[0];
  const todayCount = history.filter(h => h.date.startsWith(todayKey)).length;
  const limitReached = !premium && todayCount >= FREE_LIMIT;

  const selectedMode = MODES.find(m => m.id === mode)!;
  const error = glowError || glamError;

  function handleSkinFile(f: File) {
    setSkinFile(f);
    setSkinPreview(URL.createObjectURL(f));
  }
  function handleMakeupFile(f: File) {
    setMakeupFile(f);
    setMakeupPreview(URL.createObjectURL(f));
  }
  function handleModeSelect(m: AppMode) {
    setMode(m);
    setSkinFile(null); setSkinPreview(undefined);
    setMakeupFile(null); setMakeupPreview(undefined);
  }

  async function handleGlowAnalyze() {
    if (!user || !skinFile) return;
    const base64 = await fileToBase64(skinFile);
    const result = await analyzeGlow(base64);
    if (!result) return;
    let imageUrl = '';
    try { imageUrl = await uploadSelfie(user.id, skinFile); } catch { /* use empty */ }
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: result.glowScore,
      imageUrl,
      analysis: result,
    };
    setHistory([entry, ...history].slice(0, 10));
    navigate('/results', { state: { entry, localImageUrl: skinPreview } });
  }

  async function handleGlamAnalyze() {
    if (!user || !makeupFile) return;
    const base64 = await fileToBase64(makeupFile);
    const analysis = await analyzeGlam(base64);
    if (!analysis) return;
    let imageUrl = '';
    try { imageUrl = await uploadSelfie(user.id, makeupFile); } catch { /* use empty */ }
    const entry: GlamHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: analysis.glamScore,
      imageUrl: imageUrl || makeupPreview || '',
      analysis,
    };
    setGlamHistory([entry, ...glamHistory].slice(0, 10));
    navigate('/glam-results', { state: { analysis, imageUrl: makeupPreview } });
  }

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {PARTICLES.map(([size, left, dur, delay, color], i) => (
        <span key={i} className="particle" style={{ width: size, height: size, left: `${left}%`, bottom: '-10px', background: color, animationDuration: `${dur}s`, animationDelay: `${delay}s`, boxShadow: `0 0 ${size * 3}px ${color}` }} />
      ))}
      <div className="hero-glow" />

      {showPremium && user && (
        <PremiumModal user={user} onClose={() => setShowPremium(false)} onUpgraded={() => { setShowPremium(false); refreshPremium(); }} />
      )}

      <header className="header-glass" style={{ position: 'sticky', top: 0, zIndex: 40, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user && (
            <button onClick={() => navigate('/progress')} className="btn-outline" style={{ fontSize: 13, padding: '8px 18px', gap: 6 }}>
              <span style={{ fontSize: 15 }}>📊</span>Progress
            </button>
          )}
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 540, width: '100%' }}>

          {/* Hero Copy */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {firstName && (
              <p style={{ fontSize: 14, color: tc.textSoft, fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500, margin: '0 0 6px', animation: 'fadeIn 0.5s ease both', letterSpacing: 0.2 }}>
                Welcome back,{' '}
                <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700 }}>
                  {firstName}!
                </span>
              </p>
            )}
            <h1 key={mode} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2, letterSpacing: '-0.3px', animation: 'fadeIn 0.4s ease both', color: tc.textPrimary }}>
              {selectedMode.heading}
            </h1>
            <p key={mode + '-sub'} style={{ fontSize: 14, color: tc.textBody, lineHeight: 1.6, margin: '0 auto', maxWidth: 380, fontFamily: "'DM Sans', system-ui, sans-serif", animation: 'fadeIn 0.5s ease 0.1s both' }}>
              {selectedMode.tagline}
            </p>
          </div>

          {/* Mode Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, animation: 'fadeInUp 0.6s ease 0.2s both' }}>
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => handleModeSelect(m.id)}
                style={{
                  background: mode === m.id ? 'rgba(168,85,247,0.15)' : tc.cardBg,
                  border: `1.5px solid ${mode === m.id ? 'rgba(168,85,247,0.6)' : tc.cardBorder}`,
                  borderRadius: 16, padding: '14px 12px', cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.2s', position: 'relative',
                  boxShadow: mode === m.id ? '0 0 20px rgba(168,85,247,0.15)' : 'none',
                }}
              >
                {m.premium && (
                  <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700, letterSpacing: 0.5, background: 'linear-gradient(135deg,#ec4899,#a855f7)', color: '#fff', padding: '2px 6px', borderRadius: 20 }}>
                    PRO
                  </span>
                )}
                <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: mode === m.id ? '#a855f7' : tc.textPrimary, letterSpacing: 0.5, marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: tc.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{m.sub}</div>
              </button>
            ))}
          </div>

          {/* Upload Card */}
          <div className="glass-card" style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s both' }}>
            {!user ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, padding: '32px 16px' }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔒</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: tc.textPrimary, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Sign in to analyse your skin</div>
                  <div style={{ fontSize: 13, color: tc.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>Create a free account to get your Glow Score, Glam Score, and more.</div>
                </div>
                <button onClick={() => navigate('/signin')} className="btn-glow" style={{ fontSize: 15, padding: '13px 32px', justifyContent: 'center' }}>
                  <span style={{ fontSize: 16 }}>🔑</span>Sign In / Create Account
                </button>
              </div>
            ) : selectedMode.dual ? (
              /* Dual upload zone */
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#a855f7', letterSpacing: 1, marginBottom: 8, textAlign: 'center' }}>🌿 SKIN SELFIE (no makeup)</div>
                    <UploadZone onFile={handleSkinFile} preview={skinPreview} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#ec4899', letterSpacing: 1, marginBottom: 8, textAlign: 'center' }}>💄 GLAM SELFIE (with makeup)</div>
                    <UploadZone onFile={handleMakeupFile} preview={makeupPreview} />
                  </div>
                </div>
              </div>
            ) : mode === 'glam' ? (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ec4899', letterSpacing: 1, marginBottom: 10, textAlign: 'center' }}>💄 Upload your makeup selfie</div>
                <UploadZone onFile={handleMakeupFile} preview={makeupPreview} />
              </div>
            ) : (
              <UploadZone onFile={handleSkinFile} preview={skinPreview} />
            )}

            {/* Free limit warning */}
            {user && mode === 'glow' && limitReached && (
              <div style={{ marginTop: 14, padding: '14px 16px', background: 'rgba(168,85,247,0.07)', borderRadius: 12, border: '1px solid rgba(168,85,247,0.25)' }}>
                <p style={{ margin: '0 0 10px', fontSize: 13, color: tc.textBody, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                  ⚠️ You've used all <strong>3 free analyses</strong> for today.
                </p>
                <button onClick={() => setShowPremium(true)} className="btn-glow" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '11px' }}>
                  ✨ Upgrade for Unlimited Analyses
                </button>
              </div>
            )}

            {/* Error */}
            {user && error && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#f87171', fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
              </div>
            )}

            {/* CTA — Glow */}
            {user && mode === 'glow' && (
              <button
                onClick={handleGlowAnalyze}
                disabled={!skinFile || glowLoading || limitReached}
                className="btn-glow"
                style={{ width: '100%', marginTop: 18, fontSize: 16, padding: '15px', justifyContent: 'center' }}
              >
                {glowLoading ? (
                  <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />Analysing&hellip;</>
                ) : (
                  <><span style={{ fontSize: 18 }}>🌿</span>Analyse My Skin</>
                )}
              </button>
            )}

            {/* CTA — Glam */}
            {user && mode === 'glam' && (
              <button
                onClick={handleGlamAnalyze}
                disabled={!makeupFile || glamLoading}
                className="btn-glow"
                style={{ width: '100%', marginTop: 18, fontSize: 16, padding: '15px', justifyContent: 'center', background: 'linear-gradient(135deg, #db2777, #a855f7, #db2777)', backgroundSize: '200% auto' }}
              >
                {glamLoading ? (
                  <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />Analysing&hellip;</>
                ) : (
                  <><span style={{ fontSize: 18 }}>💄</span>Get My Glam Score</>
                )}
              </button>
            )}

            {/* Feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 16 }}>
              {[['✦','Glow Score'],['💄','Glam Score']].map(([icon, label]) => (
                <span key={label} className="feature-pill">
                  <span style={{ color: '#a855f7', fontSize: 11 }}>{icon}</span>{label}
                </span>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: tc.textHint, marginTop: 20, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif", animation: 'fadeIn 0.8s ease 1s both' }}>
            🔒 &nbsp;Your photos are never stored on our servers
          </p>
        </div>
      </main>
    </div>
  );
}
