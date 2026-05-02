import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const FREE_LIMIT = 9999;

const PARTICLES: Array<[number, number, number, number, string]> = [
  [5, 8, 18, 0, '#7c3aed'], [3, 25, 24, 3, '#db2777'],
  [4, 55, 20, 6, '#a855f7'], [6, 72, 28, 1.5, '#db2777'],
  [3, 88, 16, 9, '#7c3aed'], [4, 42, 22, 4.5, '#f59e0b'],
];

/* ── Mode Picker ──────────────────────────────────────────────────────────── */
function ModePicker({ onPick }: { onPick: (m: AppMode) => void }) {
  const [hovered, setHovered] = useState<AppMode | null>(null);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease both' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
          Choose Your Score
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 auto', maxWidth: 340, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Pick the score that's right for you. This will be your permanent analysis mode.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Glow Score card */}
        <button
          onClick={() => onPick('glow')}
          onMouseEnter={() => setHovered('glow')}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: hovered === 'glow' ? 'rgba(168,85,247,0.12)' : 'var(--bg-card)',
            border: `2px solid ${hovered === 'glow' ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.25)'}`,
            borderRadius: 20, padding: '28px 20px', cursor: 'pointer', textAlign: 'center',
            transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            boxShadow: hovered === 'glow' ? '0 8px 32px rgba(168,85,247,0.2)' : 'none',
            transform: hovered === 'glow' ? 'translateY(-3px)' : 'none',
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🌿</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#a855f7', letterSpacing: 0.5, marginBottom: 4 }}>GLOW SCORE</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>Bare-face selfie · Skin health</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            {['Skin Analysis', 'Daily Routine', 'Product Picks', 'Derm Advice'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 4, padding: '8px 20px', borderRadius: 50, background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
            Choose Glow →
          </div>
        </button>

        {/* Glam Score card */}
        <button
          onClick={() => onPick('glam')}
          onMouseEnter={() => setHovered('glam')}
          onMouseLeave={() => setHovered(null)}
          style={{
            background: hovered === 'glam' ? 'rgba(236,72,153,0.12)' : 'var(--bg-card)',
            border: `2px solid ${hovered === 'glam' ? 'rgba(236,72,153,0.6)' : 'rgba(236,72,153,0.25)'}`,
            borderRadius: 20, padding: '28px 20px', cursor: 'pointer', textAlign: 'center',
            transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            boxShadow: hovered === 'glam' ? '0 8px 32px rgba(236,72,153,0.2)' : 'none',
            transform: hovered === 'glam' ? 'translateY(-3px)' : 'none',
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>💄</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#ec4899', letterSpacing: 0.5, marginBottom: 4 }}>GLAM SCORE</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>Makeup selfie · AI Coach</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            {['Glam Score', 'Shade Match', 'Look Analysis', 'Pro Tips'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ec4899', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 4, padding: '8px 20px', borderRadius: 50, background: 'linear-gradient(135deg, #ec4899, #a855f7)', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
            Choose Glam →
          </div>
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-hint)', marginTop: 20, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
        You can change this later from your profile settings
      </p>
    </div>
  );
}

/* ── Scan Upload UI ───────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const tc = useThemeColors();

  const [scoreMode, setScoreMode] = useLocalStorage<AppMode | null>('roop_score_mode', null);
  const [skinFile, setSkinFile] = useState<File | null>(null);
  const [skinPreview, setSkinPreview] = useState<string | undefined>();
  const [makeupFile, setMakeupFile] = useState<File | null>(null);
  const [makeupPreview, setMakeupPreview] = useState<string | undefined>();
  const [showPremium, setShowPremium] = useState(false);

  const { analyze: analyzeGlow, loading: glowLoading, error: glowError } = useSkinAnalysis();
  const { analyze: analyzeGlam, loading: glamLoading, error: glamError } = useGlamAnalysis();
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
  const error = glowError || glamError;

  const isGlam = scoreMode === 'glam';
  const accentColor = isGlam ? '#ec4899' : '#a855f7';
  const heading = isGlam ? 'Your AI-Powered Makeup Coach' : 'Your AI-Powered Skin Coach';
  const tagline = isGlam
    ? 'Upload a makeup selfie — get your Glam Score, foundation shade match, missing product picks, and expert correction tips.'
    : 'Upload a bare-face selfie — get your Glow Score, daily routine, product picks, and dermatologist insights.';

  function handleSkinFile(f: File) { setSkinFile(f); setSkinPreview(URL.createObjectURL(f)); }
  function handleMakeupFile(f: File) { setMakeupFile(f); setMakeupPreview(URL.createObjectURL(f)); }

  async function handleGlowAnalyze() {
    if (!user || !skinFile) return;
    const base64 = await fileToBase64(skinFile);
    const result = await analyzeGlow(base64);
    if (!result) return;
    let imageUrl = '';
    try { imageUrl = await uploadSelfie(user.id, skinFile); } catch { /* use empty */ }
    const entry: HistoryEntry = { id: Date.now().toString(), date: new Date().toISOString(), score: result.glowScore, imageUrl, analysis: result };
    setHistory([entry, ...history].slice(0, 10));
    setGlamHistory([]);
    navigate('/results', { state: { entry, localImageUrl: skinPreview } });
  }

  async function handleGlamAnalyze() {
    if (!user || !makeupFile) return;
    const base64 = await fileToBase64(makeupFile);
    const analysis = await analyzeGlam(base64);
    if (!analysis) return;
    let imageUrl = '';
    try { imageUrl = await uploadSelfie(user.id, makeupFile); } catch { /* use empty */ }
    const entry: GlamHistoryEntry = { id: Date.now().toString(), date: new Date().toISOString(), score: analysis.glamScore, imageUrl: imageUrl || makeupPreview || '', analysis };
    setGlamHistory([entry, ...glamHistory].slice(0, 10));
    setHistory([]);
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
          {scoreMode && (
            <button
              onClick={() => setScoreMode(null)}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, padding: '6px 12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            >
              Change Mode
            </button>
          )}
          <button onClick={() => navigate(-1)} className="btn-outline" style={{ fontSize: 13, padding: '8px 18px', gap: 6 }}>
            <span style={{ fontSize: 15 }}>←</span>Back
          </button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: scoreMode ? 540 : 600, width: '100%' }}>

          {/* No mode selected yet — show picker */}
          {!scoreMode ? (
            <ModePicker onPick={m => setScoreMode(m)} />
          ) : (
            <>
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
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.2, letterSpacing: '-0.3px', animation: 'fadeIn 0.4s ease both', color: tc.textPrimary }}>
                  {heading}
                </h1>
                <p style={{ fontSize: 14, color: tc.textBody, lineHeight: 1.6, margin: '0 auto', maxWidth: 380, fontFamily: "'DM Sans', system-ui, sans-serif", animation: 'fadeIn 0.5s ease 0.1s both' }}>
                  {tagline}
                </p>
              </div>

              {/* Mode badge */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, animation: 'fadeInUp 0.6s ease 0.2s both' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, background: `rgba(${isGlam ? '236,72,153' : '168,85,247'},0.12)`, border: `1px solid rgba(${isGlam ? '236,72,153' : '168,85,247'},0.35)` }}>
                  <span style={{ fontSize: 16 }}>{isGlam ? '💄' : '🌿'}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: accentColor, letterSpacing: 0.5 }}>{isGlam ? 'GLAM SCORE' : 'GLOW SCORE'}</span>
                  <span style={{ fontSize: 11, color: `rgba(${isGlam ? '236,72,153' : '168,85,247'},0.7)` }}>{isGlam ? 'Makeup selfie · AI Coach' : 'No makeup · Skin health'}</span>
                </div>
              </div>

              {/* Upload Card */}
              <div className="glass-card" style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s both' }}>
                {!user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, padding: '32px 16px' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔒</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: tc.textPrimary, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Sign in to analyse</div>
                      <div style={{ fontSize: 13, color: tc.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>Create a free account to get your {isGlam ? 'Glam' : 'Glow'} Score and more.</div>
                    </div>
                    <button onClick={() => navigate('/signin')} className="btn-glow" style={{ fontSize: 15, padding: '13px 32px', justifyContent: 'center' }}>
                      <span style={{ fontSize: 16 }}>🔑</span>Sign In / Create Account
                    </button>
                  </div>
                ) : isGlam ? (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#ec4899', letterSpacing: 1, marginBottom: 10, textAlign: 'center' }}>💄 Upload your makeup selfie</div>
                    <UploadZone onFile={handleMakeupFile} preview={makeupPreview} />
                  </div>
                ) : (
                  <UploadZone onFile={handleSkinFile} preview={skinPreview} />
                )}

                {/* Free limit warning */}
                {user && !isGlam && limitReached && (
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

                {/* CTA */}
                {user && !isGlam && (
                  <button onClick={handleGlowAnalyze} disabled={!skinFile || glowLoading || limitReached} className="btn-glow"
                    style={{ width: '100%', marginTop: 18, fontSize: 16, padding: '15px', justifyContent: 'center' }}>
                    {glowLoading
                      ? <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />Analysing&hellip;</>
                      : <><span style={{ fontSize: 18 }}>🌿</span>Analyse My Skin</>}
                  </button>
                )}
                {user && isGlam && (
                  <button onClick={handleGlamAnalyze} disabled={!makeupFile || glamLoading} className="btn-glow"
                    style={{ width: '100%', marginTop: 18, fontSize: 16, padding: '15px', justifyContent: 'center', background: 'linear-gradient(135deg, #ec4899, #a855f7)', boxShadow: '0 4px 20px rgba(236,72,153,0.35)' }}>
                    {glamLoading
                      ? <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />Analysing&hellip;</>
                      : <><span style={{ fontSize: 18 }}>💄</span>Get My Glam Score</>}
                  </button>
                )}

                {/* Feature pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                  {(isGlam
                    ? [['💄', 'Glam Score'], ['✨', 'Shade Match'], ['🎨', 'Look Analysis'], ['💅', 'Pro Tips']]
                    : [['🌿', 'Glow Score'], ['📋', 'Skin Routine'], ['🧴', 'Product Picks'], ['🩺', 'Derm Advice']]
                  ).map(([icon, label]) => (
                    <span key={label} className="feature-pill">
                      <span style={{ color: accentColor, fontSize: 11 }}>{icon}</span>{label}
                    </span>
                  ))}
                </div>
              </div>

              <p style={{ textAlign: 'center', fontSize: 12, color: tc.textHint, marginTop: 20, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif", animation: 'fadeIn 0.8s ease 1s both' }}>
                🔒 &nbsp;Your photos are never stored on our servers
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
