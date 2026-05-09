import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import Logo from '../components/Logo';
import UserMenu from '../components/UserMenu';
import ThemeToggle from '../components/ThemeToggle';
import { fileToBase64 } from '../utils/imageUtils';
import { useSkinAnalysis } from '../hooks/useSkinAnalysis';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth, uploadSelfie } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';
import { useThemeColors } from '../hooks/useTheme';
import { selfieStore } from '../utils/selfieStore';
import type { HistoryEntry } from '../types/analysis';

const FREE_LIMIT = 9999;

const PARTICLES: Array<[number, number, number, number, string]> = [
  [5, 8, 18, 0, '#7c3aed'], [3, 25, 24, 3, '#db2777'],
  [4, 55, 20, 6, '#a855f7'], [6, 72, 28, 1.5, '#db2777'],
  [3, 88, 16, 9, '#7c3aed'], [4, 42, 22, 4.5, '#f59e0b'],
];

export default function Home() {
  const navigate = useNavigate();
  const tc = useThemeColors();

  const [skinFile, setSkinFile] = useState<File | null>(null);
  const [skinPreview, setSkinPreview] = useState<string | undefined>();
  const [showPremium, setShowPremium] = useState(false);

  const { analyze: analyzeGlow, loading: glowLoading, error: glowError } = useSkinAnalysis();
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('roop_history', []);
  const { user } = useAuth();
  const { premium, refresh: refreshPremium } = usePremium(user);

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]
    ?? user?.email?.split('@')[0] ?? null;

  const todayKey = new Date().toISOString().split('T')[0];
  const todayCount = history.filter(h => h.date.startsWith(todayKey)).length;
  const limitReached = !premium && todayCount >= FREE_LIMIT;

  function handleSkinFile(f: File) { setSkinFile(f); setSkinPreview(URL.createObjectURL(f)); }

  async function handleGlowAnalyze() {
    if (!user || !skinFile) return;
    const base64 = await fileToBase64(skinFile);
    const result = await analyzeGlow(base64);
    if (!result) return;
    let imageUrl = '';
    try { imageUrl = await uploadSelfie(user.id, skinFile); } catch { /* use empty */ }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toISOString(), score: result.glowScore, imageUrl, analysis: result };
    setHistory([entry, ...history].slice(0, 10));
    if (skinPreview) selfieStore.set(skinPreview);
    navigate('/results', { state: { entry, localImageUrl: skinPreview } });
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
          <button onClick={() => navigate(-1)} className="btn-outline" style={{ fontSize: 13, padding: '8px 18px', gap: 6 }}>
            <span style={{ fontSize: 15 }}>←</span>Back
          </button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 540, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {firstName && (
              <p style={{ fontSize: 14, color: tc.textSoft, fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500, margin: '0 0 6px', animation: 'fadeIn 0.5s ease both', letterSpacing: 0.2 }}>
                Welcome back,{' '}
                <span style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700 }}>
                  {firstName}!
                </span>
              </p>
            )}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2, letterSpacing: '-0.3px', animation: 'fadeIn 0.4s ease both', color: tc.textPrimary }}>
              Your AI-Powered Skin Coach
            </h1>
            <p style={{ fontSize: 14, color: tc.textBody, lineHeight: 1.6, margin: '0 auto', maxWidth: 380, fontFamily: "'DM Sans', system-ui, sans-serif", animation: 'fadeIn 0.5s ease 0.1s both' }}>
              Upload a bare-face selfie — get your Glow Score, daily routine, product picks, and dermatologist insights.
            </p>
          </div>

          {/* Mode badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, animation: 'fadeInUp 0.6s ease 0.2s both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.35)' }}>
              <span style={{ fontSize: 16 }}>🌿</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#a855f7', letterSpacing: 0.5 }}>GLOW SCORE</span>
              <span style={{ fontSize: 11, color: 'rgba(168,85,247,0.7)' }}>Skin health</span>
            </div>
          </div>

          {/* Upload Card */}
          <div className="glass-card" style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s both' }}>
            {!user ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, padding: '32px 16px' }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔒</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: tc.textPrimary, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Sign in to analyse</div>
                  <div style={{ fontSize: 13, color: tc.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>Create a free account to get your Glow Score and more.</div>
                </div>
                <button onClick={() => navigate('/signin')} className="btn-glow" style={{ fontSize: 15, padding: '13px 32px', justifyContent: 'center' }}>
                  <span style={{ fontSize: 16 }}>🔑</span>Sign In / Create Account
                </button>
              </div>
            ) : (
              <UploadZone onFile={handleSkinFile} preview={skinPreview} />
            )}

            {/* Free limit warning */}
            {user && limitReached && (
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
            {user && glowError && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#f87171', fontFamily: "'DM Sans', sans-serif" }}>{glowError}</p>
              </div>
            )}

            {/* CTA */}
            {user && (
              <button onClick={handleGlowAnalyze} disabled={!skinFile || glowLoading || limitReached} className="btn-glow"
                style={{ width: '100%', marginTop: 18, fontSize: 16, padding: '15px', justifyContent: 'center' }}>
                {glowLoading
                  ? <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />Analysing&hellip;</>
                  : <><span style={{ fontSize: 18 }}>🌿</span>Analyse My Skin</>}
              </button>
            )}

            {/* Feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 16 }}>
              {[['🌿', 'Glow Score'], ['📋', 'Skin Routine'], ['🧴', 'Product Picks'], ['🩺', 'Derm Advice']].map(([icon, label]) => (
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
