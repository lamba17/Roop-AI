import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import Logo from '../components/Logo';
import UserMenu from '../components/UserMenu';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { fileToBase64 } from '../utils/imageUtils';
import { useSkinAnalysis } from '../hooks/useSkinAnalysis';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth, uploadSelfie } from '../lib/supabase';
import { usePremium } from '../hooks/usePremium';
import PremiumModal from '../components/PremiumModal';
import type { HistoryEntry } from '../types/analysis';

const FREE_LIMIT = 3;

const FEATURE_PILLS = [
  { icon: '✦', label: 'Glow Score' },
  { icon: '☽', label: 'Daily Routine' },
  { icon: '◈', label: 'Product Picks' },
  { icon: '◎', label: 'Mask Plan' },
  { icon: '⚕', label: 'Derm Advice' },
];

/* Particles config: [size, left%, animDuration, animDelay, color] */
const PARTICLES: Array<[number, number, number, number, string]> = [
  [5,  8,  18, 0,   '#7c3aed'],
  [3,  25, 24, 3,   '#db2777'],
  [4,  55, 20, 6,   '#a855f7'],
  [6,  72, 28, 1.5, '#db2777'],
  [3,  88, 16, 9,   '#7c3aed'],
  [4,  42, 22, 4.5, '#f59e0b'],
];

const TAGLINE = 'Your AI-Powered Skin Coach';

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

  // Extract first name from Google profile or email
  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? null;

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

    // Upload selfie to Supabase Storage
    // Only use the URL if it's a permanent Supabase URL (not a blob URL)
    let imageUrl = '';
    try {
      imageUrl = await uploadSelfie(user.id, file);
    } catch {
      // Storage upload failed — store empty string, show placeholder in history
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
    <div
      className="mesh-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Particles */}
      {PARTICLES.map(([size, left, dur, delay, color], i) => (
        <span
          key={i}
          className="particle"
          style={{
            width: size,
            height: size,
            left: `${left}%`,
            bottom: '-10px',
            background: color,
            animationDuration: `${dur}s`,
            animationDelay: `${delay}s`,
            boxShadow: `0 0 ${size * 3}px ${color}`,
          }}
        />
      ))}

      {/* Hero ambient glow */}
      <div className="hero-glow" />

      {/* Premium modal */}
      {showPremium && user && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremium(false)}
          onUpgraded={() => { setShowPremium(false); refreshPremium(); }}
        />
      )}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        className="header-glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user && (
            <button
              onClick={() => navigate('/progress')}
              className="btn-outline"
              style={{ fontSize: 13, padding: '8px 18px', gap: 6 }}
            >
              <span style={{ fontSize: 15 }}>📊</span>
              Progress
            </button>
          )}
          <LanguageToggle />
          <UserMenu />
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 20px 60px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: 520, width: '100%' }}>

          {/* ── Hero Copy ─────────────────────────────────────────────── */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>

            {/* Logo with pulse ring */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 28,
              }}
            >
              <div className="pulse-ring">
                <Logo size="lg" />
              </div>
            </div>

            {/* Welcome greeting for signed-in users */}
            {firstName && (
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(248,248,255,0.55)',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 500,
                  margin: '0 0 6px',
                  animation: 'fadeIn 0.5s ease both',
                  letterSpacing: 0.2,
                }}
              >
                Welcome back,{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 700,
                  }}
                >
                  {firstName}!
                </span>
              </p>
            )}

            {/* Animated tagline — letter by letter */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
                fontWeight: 700,
                margin: '0 0 14px',
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
              }}
            >
              {TAGLINE.split('').map((ch, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    animation: 'letter-reveal 0.5s ease both',
                    animationDelay: `${i * 0.03}s`,
                    whiteSpace: ch === ' ' ? 'pre' : undefined,
                  }}
                  className={i > 14 ? 'gradient-text' : undefined}
                >
                  {ch}
                </span>
              ))}
            </h1>

            <p
              style={{
                fontSize: 15,
                color: 'rgba(248,248,255,0.55)',
                lineHeight: 1.7,
                margin: '0 auto',
                maxWidth: 380,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400,
                animation: 'fadeIn 0.8s ease 0.6s both',
              }}
            >
              Upload a selfie — get your Glow Score, personalised routine,
              product picks, mask schedule, and dermatologist insights in seconds.
            </p>
          </div>

          {/* ── Glass Upload Card ──────────────────────────────────────── */}
          <div
            className="glass-card"
            style={{
              animation: 'fadeInUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.4s both',
            }}
          >
            {!user ? (
              /* Sign-in gate */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 16,
                  padding: '32px 16px',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(168,85,247,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  🔒
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#f8f8ff',
                      marginBottom: 6,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Sign in to analyse your skin
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'rgba(248,248,255,0.45)',
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    Create a free account to get your Glow Score, personalised routine, and more.
                  </div>
                </div>
                <button
                  onClick={() => navigate('/signin')}
                  className="btn-glow"
                  style={{ fontSize: 15, padding: '13px 32px', justifyContent: 'center' }}
                >
                  <span style={{ fontSize: 16 }}>🔑</span>
                  Sign In / Create Account
                </button>
              </div>
            ) : (
              <UploadZone onFile={handleFile} preview={preview} />
            )}

            {/* Limit warning */}
            {user && limitReached && (
              <div
                style={{
                  marginTop: 14, padding: '14px 16px',
                  background: 'rgba(168,85,247,0.07)', borderRadius: 12,
                  border: '1px solid rgba(168,85,247,0.25)',
                }}
              >
                <p style={{ margin: '0 0 10px', fontSize: 13, color: 'rgba(248,248,255,0.75)', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                  ⚠️ You've used all <strong>3 free analyses</strong> for today.
                </p>
                <button
                  onClick={() => setShowPremium(true)}
                  className="btn-glow"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '11px' }}
                >
                  ✨ Upgrade for Unlimited Analyses
                </button>
              </div>
            )}

            {/* API Error */}
            {user && error && (
              <div
                style={{
                  marginTop: 14,
                  padding: '12px 16px',
                  background: 'rgba(239,68,68,0.08)',
                  borderRadius: 12,
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                <p style={{ margin: 0, fontSize: 13, color: '#f87171', fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
              </div>
            )}

            {/* CTA Button */}
            {user && <button
              onClick={handleAnalyze}
              disabled={!file || loading || limitReached}
              className="btn-glow"
              style={{ width: '100%', marginTop: 18, fontSize: 16, padding: '15px', justifyContent: 'center' }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  Analysing your skin&hellip;
                </>
              ) : (
                <>
                  <span style={{ fontSize: 18 }}>✨</span>
                  Analyse My Skin
                </>
              )}
            </button>}

            {/* Feature pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 8,
                marginTop: 18,
              }}
            >
              {FEATURE_PILLS.map((p) => (
                <span key={p.label} className="feature-pill">
                  <span style={{ color: '#a855f7', fontSize: 11 }}>{p.icon}</span>
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Trust line ────────────────────────────────────────────── */}
          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'rgba(248,248,255,0.25)',
              marginTop: 20,
              letterSpacing: 0.5,
              fontFamily: "'DM Sans', sans-serif",
              animation: 'fadeIn 0.8s ease 1s both',
            }}
          >
            🔒 &nbsp;Your photo is never stored on our servers
          </p>
        </div>
      </main>
    </div>
  );
}
