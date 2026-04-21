import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, supabase } from '../lib/supabase';

type Theme = 'light' | 'dark';

function getC(t: Theme) {
  const d = t === 'dark';
  return {
    pageBg:       d ? '#08080f'                          : '#faf8ff',
    navBg:        d ? 'rgba(8,8,15,0.85)'                : 'rgba(255,255,255,0.88)',
    navBorder:    d ? 'rgba(168,85,247,0.15)'            : 'rgba(168,85,247,0.12)',
    navText:      d ? '#f8f8ff'                          : '#1a1a2e',
    navMuted:     d ? 'rgba(248,248,255,0.5)'            : '#6b7280',
    h1:           d ? '#f8f8ff'                          : '#0f0f1a',
    body:         d ? 'rgba(248,248,255,0.6)'            : '#4b5563',
    muted:        d ? 'rgba(248,248,255,0.35)'           : '#9ca3af',
    cardBg:       d ? '#12122a'                          : '#ffffff',
    cardBorder:   d ? 'rgba(168,85,247,0.2)'             : 'rgba(168,85,247,0.1)',
    cardShadow:   d ? '0 20px 60px rgba(0,0,0,0.55)'    : '0 20px 60px rgba(168,85,247,0.1)',
    sectionBg:    d ? '#0d0d1e'                          : '#f4f0ff',
    altSectionBg: d ? '#080812'                          : '#ffffff',
    inputBg:      d ? 'rgba(20,20,45,0.9)'               : '#f4f0ff',
    inputBorder:  d ? 'rgba(124,58,237,0.35)'            : 'rgba(168,85,247,0.25)',
    inputColor:   d ? '#f8f8ff'                          : '#1a1a2e',
    divLine:      d ? 'rgba(124,58,237,0.2)'             : 'rgba(168,85,247,0.15)',
    divText:      d ? 'rgba(248,248,255,0.3)'            : '#9ca3af',
    badgeBg:      d ? 'rgba(168,85,247,0.1)'             : 'rgba(168,85,247,0.08)',
    badgeBorder:  d ? 'rgba(168,85,247,0.22)'            : 'rgba(168,85,247,0.18)',
    badgeText:    d ? 'rgba(248,248,255,0.5)'            : '#6b7280',
    heroBg:       d
      ? 'radial-gradient(ellipse at 30% 50%, rgba(120,40,220,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.15) 0%, transparent 50%), #08080f'
      : 'radial-gradient(ellipse at 30% 50%, rgba(168,85,247,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.08) 0%, transparent 50%), #faf8ff',
    scienceBg:    d
      ? 'linear-gradient(135deg, #0d0d1e 0%, #12082a 100%)'
      : 'linear-gradient(135deg, #f4f0ff 0%, #fdf4ff 100%)',
    accent: '#a855f7',
    accentHover: '#9333ea',
    pink: '#ec4899',
    gold: '#f59e0b',
    green: '#22c55e',
    toggleBg:     d ? 'rgba(255,255,255,0.07)' : 'rgba(168,85,247,0.08)',
    toggleBorder: d ? 'rgba(168,85,247,0.2)'   : 'rgba(168,85,247,0.18)',
    toggleColor:  d ? 'rgba(248,248,255,0.55)' : '#6b7280',
    modalOverlay: 'rgba(0,0,0,0.65)',
    modalBg:      d ? '#12122a' : '#ffffff',
    modalBorder:  d ? 'rgba(168,85,247,0.25)' : 'rgba(168,85,247,0.15)',
  };
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function Spinner({ size = 20 }: { size?: number }) {
  return <span className="spinner" style={{ width: size, height: size, borderWidth: 2, flexShrink: 0 }} />;
}

// ── Sign-in Modal ────────────────────────────────────────────────────────────
function SignInModal({ c, onClose }: { c: ReturnType<typeof getC>; onClose: () => void }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicEmail, setMagicEmail] = useState('');
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null); setGoogleLoading(true);
    try { await signInWithGoogle(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Google sign-in failed.'); setGoogleLoading(false); }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!magicEmail.trim()) return;
    setError(null); setMagicLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: magicEmail.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (otpError) throw new Error(otpError.message);
      setMagicSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link.');
    } finally { setMagicLoading(false); }
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: c.modalOverlay, backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 420, background: c.modalBg, border: `1px solid ${c.modalBorder}`, borderRadius: 24, padding: '36px 32px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)', animation: 'fadeInUp 0.35s ease both', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: c.muted, cursor: 'pointer', lineHeight: 1, padding: '2px 8px', borderRadius: 8 }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 16px' }}>✨</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, margin: '0 0 6px', color: c.h1 }}>
            Begin Your Analysis
          </h2>
          <p style={{ fontSize: 13, color: c.body, margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
            Sign in to unlock your full skin profile & personalised routine.
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#f87171', fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
          </div>
        )}

        <button onClick={handleGoogle} disabled={googleLoading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px 20px', background: '#ffffff', color: '#1f1f1f', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: googleLoading ? 'not-allowed' : 'pointer', opacity: googleLoading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', marginBottom: 6 }}>
          {googleLoading ? <Spinner size={20} /> : <GoogleIcon />}
          {googleLoading ? 'Connecting…' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: c.divLine }} />
          <span style={{ fontSize: 12, color: c.divText, fontFamily: "'DM Sans', sans-serif" }}>or email</span>
          <div style={{ flex: 1, height: 1, background: c.divLine }} />
        </div>

        {magicSent ? (
          <div style={{ padding: '16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14, marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#4ade80', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
              ✅ Magic link sent to <strong>{magicEmail}</strong>. Check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink}>
            <input type="email" value={magicEmail} onChange={e => setMagicEmail(e.target.value)} placeholder="your@email.com" required
              style={{ width: '100%', padding: '13px 16px', background: c.inputBg, border: `1px solid ${c.inputBorder}`, borderRadius: 12, color: c.inputColor, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', marginBottom: 10, boxSizing: 'border-box' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = c.inputBorder; }}
            />
            <button type="submit" disabled={magicLoading || !magicEmail.trim()} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '13px 20px' }}>
              {magicLoading ? <><Spinner size={18} /> Sending…</> : '✉️ Send Magic Link'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: 11, color: c.muted, marginTop: 16, marginBottom: 0, fontFamily: "'DM Sans', sans-serif" }}>
          🔒 Encrypted · Free to start · No card needed
        </p>
      </div>
    </div>
  );
}

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function SignIn() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>('dark');
  const [showModal, setShowModal] = useState(false);
  const c = getC(theme);

  const FEATURES = [
    { icon: '✨', title: 'Glow Score', desc: 'AI-powered skin scoring from a single selfie — no dermatologist visit needed.' },
    { icon: '🧴', title: 'Daily Ritual', desc: 'Personalised morning & evening routines crafted to your exact skin type.' },
    { icon: '🛍️', title: 'Product Picks', desc: 'Curated recommendations with direct Nykaa & Amazon purchase links.' },
    { icon: '📈', title: 'Progress Tracking', desc: 'Before & after comparisons that show your real skin evolution over time.' },
    { icon: '🩺', title: 'Specialist Finder', desc: 'Verified dermatologists near you, bookable in one tap.' },
    { icon: '🌙', title: 'Mask Schedule', desc: 'Weekly mask calendar tuned to your skin concerns and goals.' },
  ];

  const DOCTORS = [
    { initial: 'S', name: 'Dr. Sana Iyer', specialty: 'Cosmetic Dermatology', rating: 4.9, city: 'Mumbai' },
    { initial: 'M', name: 'Dr. Marcus Chen', specialty: 'Clinical Dermatology', rating: 4.8, city: 'Delhi' },
    { initial: 'J', name: 'Dr. Sarah Julian', specialty: 'Laser & Pigmentation', rating: 4.9, city: 'Bangalore' },
  ];

  const STEPS = [
    { num: '01', title: 'Upload a Selfie', desc: 'Take a clear, well-lit selfie and upload it in seconds.' },
    { num: '02', title: 'Get Your Glow Score', desc: 'AI analyses your skin across 5 dimensions in real time.' },
    { num: '03', title: 'Follow Your Ritual', desc: 'Get a personalised routine, products, and expert advice.' },
  ];

  const navLinks = ['How it Works', 'Features', 'Specialists'];

  return (
    <div style={{ background: c.pageBg, minHeight: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'background 0.3s ease' }}>

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: c.navBg, borderBottom: `1px solid ${c.navBorder}`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: c.h1, letterSpacing: '-0.02em' }}>ROOP AI</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
                style={{ fontSize: 13, fontWeight: 500, color: c.navMuted, textDecoration: 'none', display: 'none' }}
                className="nav-link-desktop">
                {l}
              </a>
            ))}
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: c.toggleBg, border: `1px solid ${c.toggleBorder}`, borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: c.toggleColor, transition: 'all 0.2s' }}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button onClick={() => setShowModal(true)} className="btn-glow" style={{ fontSize: 13, padding: '8px 20px' }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="how-it-works" style={{ paddingTop: 64, minHeight: '100vh', background: c.heroBg, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: theme === 'dark' ? 'radial-gradient(circle, rgba(120,40,220,0.2) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 380, height: 380, borderRadius: '50%', background: theme === 'dark' ? 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 60, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: c.badgeBg, border: `1px solid ${c.badgeBorder}`, borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: c.badgeText, letterSpacing: 1, textTransform: 'uppercase' }}>AI-Powered Skin Analysis</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 700, margin: '0 0 20px', lineHeight: 1.1, color: c.h1 }}>
              Master Your<br />
              Skin's <span className="gradient-text">Story.</span>
            </h1>
            <p style={{ fontSize: 16, color: c.body, lineHeight: 1.8, margin: '0 0 36px', maxWidth: 440 }}>
              Precision AI dermatology meets the ethereal human touch. Discover your Glow Score and enter a new era of clinical-grade skin personalisation.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => setShowModal(true)} className="btn-glow" style={{ fontSize: 15, padding: '14px 28px' }}>
                ✨ Get Your Glow Score
              </button>
              <button
                onClick={() => document.getElementById('specialists')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ fontSize: 14, padding: '14px 24px', background: 'none', border: `1px solid ${c.cardBorder}`, borderRadius: 12, color: c.navMuted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: 'border-color 0.2s' }}>
                Free Specialist Network →
              </button>
            </div>
            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 32, marginTop: 44 }}>
              {[['50K+', 'Analyses done'], ['4.9★', 'User rating'], ['98%', 'AI accuracy']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: c.accent, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual card */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            {/* Main glow visual */}
            <div style={{ width: 320, height: 380, borderRadius: 28, background: theme === 'dark' ? 'linear-gradient(145deg, #1a0a3a, #2a0a4a, #1a1a3a)' : 'linear-gradient(145deg, #ede0ff, #fce4f5, #e8d5ff)', border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Face silhouette */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <svg width="180" height="220" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="90" cy="100" rx="62" ry="78" fill={theme === 'dark' ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.1)'} />
                  <ellipse cx="90" cy="100" rx="52" ry="68" fill={theme === 'dark' ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.15)'} />
                  <ellipse cx="90" cy="98" rx="42" ry="58" fill={theme === 'dark' ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0.1)'} />
                  {/* Sparkle */}
                  <circle cx="120" cy="48" r="4" fill="#a855f7" opacity="0.8"/>
                  <circle cx="136" cy="60" r="2" fill="#ec4899" opacity="0.6"/>
                  <circle cx="58" cy="42" r="3" fill="#a855f7" opacity="0.5"/>
                  <text x="90" y="108" textAnchor="middle" fontSize="36" fontFamily="serif" fill={theme === 'dark' ? 'rgba(248,248,255,0.15)' : 'rgba(80,0,160,0.12)'}>✦</text>
                </svg>
              </div>
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: theme === 'dark' ? 'radial-gradient(ellipse at 60% 30%, rgba(168,85,247,0.3) 0%, transparent 60%)' : 'radial-gradient(ellipse at 60% 30%, rgba(168,85,247,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
              {/* Bottom label */}
              <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: theme === 'dark' ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.12)', border: `1px solid ${c.cardBorder}`, borderRadius: 20, padding: '6px 16px', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: c.accent }}>✦ Optimal Clarity</span>
              </div>
            </div>
            {/* Floating score card */}
            <div style={{ position: 'absolute', top: 24, right: -20, background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 16, padding: '14px 18px', boxShadow: c.cardShadow, minWidth: 120 }}>
              <div style={{ fontSize: 10, color: c.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Glow Score</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>87</div>
              <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>Radiant State ✦</div>
            </div>
            {/* Floating concern tag */}
            <div style={{ position: 'absolute', bottom: 40, left: -24, background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 12, padding: '10px 14px', boxShadow: c.cardShadow }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: c.h1, marginBottom: 2 }}>🌿 Hydration</div>
              <div style={{ fontSize: 10, color: c.muted }}>High · Normal</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '100px 24px', background: c.sectionBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: 11, color: c.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Simple Process</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: c.h1, margin: '10px 0 0' }}>
              The Science of <span className="gradient-text">The Ethereal Glow</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {STEPS.map(s => (
              <div key={s.num} style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 20, padding: '32px 28px', boxShadow: c.cardShadow }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: c.accent, letterSpacing: 2, marginBottom: 16 }}>{s.num}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: c.h1, margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: c.body, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Score preview */}
          <div style={{ marginTop: 40, background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 24, padding: '36px 40px', boxShadow: c.cardShadow, display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ width: 110, height: 110, borderRadius: '50%', background: `conic-gradient(#22c55e 0deg ${Math.round(85*3.6)}deg, ${theme === 'dark' ? '#1a1a30' : '#ede9fe'} 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 84, height: 84, borderRadius: '50%', background: c.cardBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>85</div>
                  <div style={{ fontSize: 9, color: c.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Glow</div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', marginTop: 10 }}>Radiant State</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Optical Luminosity', desc: 'Your skin exhibits strong luminosity and even tone distribution', score: 88, color: '#a855f7' },
                { label: 'Surface Homogeneity', desc: 'Texture uniformity is above average with minimal visible pores', score: 82, color: '#06b6d4' },
                { label: 'Hydration Integrity', desc: 'Moisture barrier shows optimal resilience through careful analysis', score: 85, color: '#22c55e' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.h1 }}>{m.label}</span>
                    <span style={{ fontSize: 12, color: m.color, fontWeight: 700 }}>{m.score}</span>
                  </div>
                  <div style={{ height: 5, background: theme === 'dark' ? '#1a1a30' : '#ede9fe', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${m.score}%`, background: m.color, borderRadius: 4, transition: 'width 1s ease' }} />
                  </div>
                  <p style={{ fontSize: 11, color: c.muted, margin: '5px 0 0', lineHeight: 1.5 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: '100px 24px', background: c.altSectionBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, color: c.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Everything You Need</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: c.h1, margin: '10px 0 0' }}>
              Medical-Grade <span className="gradient-text">Curation</span>
            </h2>
            <p style={{ fontSize: 14, color: c.body, marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>
              No more guessing. Thousands of permutations analysed to find the exact combination for your skin.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 20, padding: '28px 24px', boxShadow: c.cardShadow, position: 'relative', overflow: 'hidden' }}>
                {i === 2 && (
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, #a855f7, #ec4899)', fontSize: 9, fontWeight: 700, color: '#fff', padding: '4px 10px', borderRadius: '0 20px 0 10px', letterSpacing: 0.5 }}>POPULAR</div>
                )}
                <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1))', border: `1px solid ${c.badgeBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: c.h1, margin: '0 0 8px', fontFamily: "'DM Sans', sans-serif" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: c.body, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialists ── */}
      <section id="specialists" style={{ padding: '100px 24px', background: c.sectionBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 11, color: c.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Expert Network</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: c.h1, margin: '10px 0 16px' }}>
                Elite Access To Board-Certified <span className="gradient-text">Clinical Minds</span>
              </h2>
              <p style={{ fontSize: 14, color: c.body, lineHeight: 1.8, marginBottom: 32 }}>
                AI provides the data; our specialists provide the wisdom. Get direct access to the world's leading dermatology experts for targeted consultations.
              </p>
              <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
                {[['150+', 'Cities in India'], ['24h', 'Avg. response']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: c.accent, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 12, color: c.muted, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowModal(true)}
                style={{ fontSize: 13, padding: '12px 24px', background: 'none', border: `1px solid ${c.accent}`, borderRadius: 12, color: c.accent, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                Explore Specialist Directory →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {DOCTORS.map(doc => (
                <div key={doc.name} style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 18, padding: '20px 24px', boxShadow: c.cardShadow, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {doc.initial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.h1 }}>{doc.name}</div>
                    <div style={{ fontSize: 12, color: c.muted }}>{doc.specialty} · {doc.city}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>⭐ {doc.rating}</div>
                    <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 600, marginTop: 2 }}>Available</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '100px 24px', background: theme === 'dark' ? 'linear-gradient(135deg, #0d0818 0%, #18083a 50%, #0d0818 100%)' : 'linear-gradient(135deg, #f0e8ff 0%, #fce4f5 50%, #f0e8ff 100%)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 28px' }}>✨</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: c.h1, margin: '0 0 16px', lineHeight: 1.2 }}>
            Join the Ethereal Clinic<br />of <span className="gradient-text">Skin Health</span>
          </h2>
          <p style={{ fontSize: 15, color: c.body, lineHeight: 1.8, margin: '0 0 36px' }}>
            Step into the future of precision dermatology. Your personalised skin coach — AI-powered, science-backed, always here.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-glow" style={{ fontSize: 16, padding: '16px 40px' }}>
            Begin Your Analysis
          </button>
          <p style={{ fontSize: 12, color: c.muted, marginTop: 16 }}>Free to start · No credit card · 60-second analysis</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '32px 24px', background: c.altSectionBg, borderTop: `1px solid ${c.navBorder}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✨</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: c.h1 }}>ROOP AI</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: c.muted, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: c.muted, margin: 0 }}>© 2026 ROOP AI. All rights reserved.</p>
        </div>
      </footer>

      {/* ── Sign-in Modal ── */}
      {showModal && <SignInModal c={c} onClose={() => setShowModal(false)} />}

      {/* Guest shortcut */}
      <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        <button onClick={() => navigate('/')}
          style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: 20, padding: '8px 18px', fontSize: 12, color: c.muted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: c.cardShadow }}>
          Continue as Guest →
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) { .nav-link-desktop { display: block !important; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
