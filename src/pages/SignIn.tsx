import { useState, useEffect } from 'react';
import { signInWithGoogle, supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

/* ── Design tokens (Ethereal Clinic system) ───────────────────────────────── */
type Theme = 'dark' | 'light';

function tok(t: Theme) {
  const d = t === 'dark';
  return {
    surface:         d ? '#171020' : '#f4f0ff',
    surfaceLow:      d ? '#201829' : '#e8e0f8',
    surfaceContainer:d ? '#241c2d' : '#ddd5f5',
    surfaceHigh:     d ? '#2f2738' : '#ccc0ee',
    surfaceHighest:  d ? '#3a3143' : '#b8a8e4',
    onSurface:       d ? '#ebdef5' : '#1a0a3a',
    onSurfaceVar:    d ? '#ccc3d8' : '#5a4a7a',
    primary:         d ? '#d2bbff' : '#7c3aed',
    primaryContainer:'#7c3aed',
    secondary:       d ? '#ffb1c7' : '#be0062',
    secondaryContainer:'#be0062',
    tertiary:        d ? '#ffb95f' : '#b45309',
    outlineVar:      d ? 'rgba(74,68,85,0.4)' : 'rgba(124,58,237,0.15)',
    navShadow:       d ? 'rgba(19,12,28,0.5)' : 'rgba(100,50,180,0.08)',
    glowPurple:      d ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)',
    glowPink:        d ? 'rgba(190,0,98,0.12)' : 'rgba(190,0,98,0.07)',
    glassBg:         d ? 'rgba(47,39,56,0.45)' : 'rgba(255,255,255,0.65)',
    white:           '#ffffff',
    shadow:          d ? 'rgba(19,12,28,0.45)' : 'rgba(80,40,160,0.12)',
  };
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #be0062 100%)';
const TEXT_GRADIENT  = 'linear-gradient(135deg, #d2bbff 0%, #ffb1c7 100%)';

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
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

/* ── Sign-in modal ────────────────────────────────────────────────────────── */
function SignInModal({ c, onClose, mode }: { c: ReturnType<typeof tok>; onClose: () => void; mode: 'login' | 'signup' }) {
  const [gLoading, setGLoading] = useState(false);
  const [email, setEmail]       = useState('');
  const [name, setName]         = useState('');
  const [eLoading, setELoading] = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', background: c.surfaceLow,
    border: `1px solid ${c.outlineVar}`, borderRadius: 14, color: c.onSurface,
    fontSize: 14, fontFamily: "'Manrope', sans-serif", outline: 'none',
    marginBottom: 10, boxSizing: 'border-box',
  };
  const focusIn  = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = c.outlineVar; e.currentTarget.style.boxShadow = 'none'; };

  async function handleGoogle() {
    setError(null); setGLoading(true);
    try { await signInWithGoogle(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Sign-in failed.'); setGLoading(false); }
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!email.trim()) return;
    if (mode === 'signup' && !name.trim()) return;
    setError(null); setELoading(true);
    try {
      const { error: e } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          ...(mode === 'signup' && { data: { full_name: name.trim() } }),
        },
      });
      if (e) throw new Error(e.message);
      setSent(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to send link.'); }
    finally { setELoading(false); }
  }

  const glass: React.CSSProperties = { background: c.glassBg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' };
  const isSignup = mode === 'signup';
  const canSubmit = !!email.trim() && (!isSignup || !!name.trim());

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(23,16,32,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 420, ...glass, border: `1px solid ${c.outlineVar}`, borderRadius: 32, padding: '40px 36px', boxShadow: `0 32px 80px ${c.shadow}`, animation: 'fadeInUp 0.35s ease both', position: 'relative' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: 24, color: c.onSurfaceVar, cursor: 'pointer', lineHeight: 1, padding: 4 }}>×</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            <img src="/Face 1 Purple.png" alt="ROOP AI" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', background: TEXT_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ROOP AI</span>
          </div>
          <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em', color: c.onSurface }}>
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: 13, color: c.onSurfaceVar, margin: 0, fontFamily: "'Manrope', sans-serif", lineHeight: 1.6 }}>
            {isSignup ? 'Join the Ethereal Clinic and start your skin journey.' : 'Sign in to access your personalised skin profile.'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(147,0,10,0.15)', borderRadius: 14, border: '1px solid rgba(255,180,171,0.2)' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#ffb4ab', fontFamily: "'Manrope', sans-serif" }}>{error}</p>
          </div>
        )}

        {/* Google */}
        <button onClick={handleGoogle} disabled={gLoading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px 20px', background: '#fff', color: '#1a1a2e', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700, fontFamily: "'Manrope', sans-serif", cursor: gLoading ? 'not-allowed' : 'pointer', opacity: gLoading ? 0.7 : 1, boxShadow: `0 4px 20px ${c.shadow}`, marginBottom: 20 }}>
          {gLoading ? <Spinner size={18} /> : <GoogleIcon />}
          {gLoading ? 'Connecting…' : isSignup ? 'Sign up with Google' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: c.outlineVar }} />
          <span style={{ fontSize: 11, color: c.onSurfaceVar, fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>or {isSignup ? 'sign up' : 'sign in'} with email</span>
          <div style={{ flex: 1, height: 1, background: c.outlineVar }} />
        </div>

        {/* Success state */}
        {sent ? (
          <div style={{ padding: '20px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📬</div>
            <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#4ade80', fontFamily: "'Manrope', sans-serif" }}>Check your inbox</p>
            <p style={{ margin: 0, fontSize: 13, color: c.onSurfaceVar, fontFamily: "'Manrope', sans-serif", lineHeight: 1.6 }}>
              Magic link sent to <strong style={{ color: c.onSurface }}>{email}</strong>. Click it to {isSignup ? 'activate your account' : 'sign in'} instantly.
            </p>
            <button onClick={() => { setSent(false); setEmail(''); setName(''); }}
              style={{ marginTop: 14, background: 'none', border: 'none', color: c.onSurfaceVar, fontSize: 12, fontFamily: "'Manrope', sans-serif", cursor: 'pointer', textDecoration: 'underline' }}>
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Name field — signup only */}
            {isSignup && (
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your full name" required style={inputStyle}
                onFocus={focusIn} onBlur={focusOut} />
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required style={inputStyle}
              onFocus={focusIn} onBlur={focusOut} />
            <button type="submit" disabled={eLoading || !canSubmit}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', background: BRAND_GRADIENT, color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700, fontFamily: "'Manrope', sans-serif", cursor: eLoading || !canSubmit ? 'not-allowed' : 'pointer', opacity: eLoading || !canSubmit ? 0.6 : 1, boxShadow: '0 0 24px rgba(124,58,237,0.3)' }}>
              {eLoading ? <><Spinner size={16} /> Sending…</> : isSignup ? '✨  Create Account' : '✉️  Send Magic Link'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: 11, color: c.onSurfaceVar, marginTop: 20, marginBottom: 0, fontFamily: "'Inter', sans-serif", letterSpacing: 0.3 }}>🔒 Encrypted · Free to start · No card needed</p>
      </div>
    </div>
  );
}

/* ── Landing Page ─────────────────────────────────────────────────────────── */
export default function SignIn() {
  const { forceTheme } = useTheme();
  const [theme, setTheme]         = useState<Theme>('light');
  const [modalMode, setModalMode] = useState<'login' | 'signup' | null>(null);

  // Force light theme whenever the landing page is mounted (covers SPA navigation too)
  useEffect(() => { forceTheme('light'); }, []);
  const c = tok(theme);
  const d = theme === 'dark';

  const glass: React.CSSProperties = { background: c.glassBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' };

  const STEPS = [
    { n: '01', title: 'Upload a Selfie', desc: 'Take a clear, natural-light selfie and upload it in seconds from any device.' },
    { n: '02', title: 'Receive Your Glow Score', desc: 'AI analyses your skin across 5 clinical dimensions in real time.' },
    { n: '03', title: 'Follow Your Ritual', desc: 'A personalised morning & evening routine, product picks, and specialist access.' },
  ];

  const SCIENCE = [
    { icon: '✦', title: 'Optical Luminosity', desc: 'Measuring light refraction and skin transparency to determine inner vibrance levels.' },
    { icon: '⬡', title: 'Surface Homogeneity', desc: 'Detecting micro-irregularities and texture patterns for refined clinical smoothness.' },
    { icon: '◎', title: 'Hydration Integrity', desc: 'Evaluating moisture retention and barrier strength at a microscopic cellular level.' },
  ];

  const DOCTORS = [
    { name: 'Dr. Elena Vos',    spec: 'Regenerative Aesthetics', offset: 48, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeZA6U98X4RA-0JNNIkC7_PnM2MPCJAfF3-Ebf7Zvmqqo3apw1wZm5qpI0XfY606v9yfmVt74A2ZJx38QYOzLXZf6A86VO0yxivR-CgnY2H-iXf8B95FeXaJ1aOELEm_68emOUubvqKS-wk7mtotjxTwbELpsmD0NIuOmQAIMFFQZRnAwUK5B1z3a9UwOVKqkAHITzqB5QbjUP_TPdrjK4836QbRmYd0Fz6VoJEhhDfQdumyqE8CvzwUHLKrQKPVISpbpDNqG1eKU' },
    { name: 'Dr. Marcus Chen',  spec: 'Clinical Dermatology',    offset: 0,  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdHzcb4hK3Ve2PL7AjZTsK_P53T0pGlvfe3-rVG4D44OG76ob4I0dO8PFe1vIRPtpMVpDvZTZV7tD2-EbACjWDVjYZJwaA50n0OmWOE684sqdzMsZEXf5aWuVvL2quRXCk2bgeFWxn_zZsLD91yuDAb3lZvsT-pLPU15RtTRCb0c-SDsM2_r01G2Q6RkTKzIxocngr6bQ9u-afR3I2s6tazlaP6LsRs7LDDWrJKKknkJ6kQCLAA-Jdjoi-wdvXEVXiDT7sRBGj4Sg' },
    { name: 'Dr. Sarah Julian', spec: 'Dermal Science',          offset: 32, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJVqAtN7qKWFPE7OV0DGM4vJ7PhlTJBJ-bbUdUod6Oegi5qvOtUsaL_9ve93h0cHZEb9lwverAS_-8lT1-n7Pa1fKm5m_5ZdnzHno21qCeDBjrsltsVdWXuoXFIFtSSAyLC-BPal1fpWCwI3tWysEBKp-zRThe2k-aps6OOPDnHeOR1AIipaxFreKDT9qz3ELlq6PYn_N6JzsA7lEyLjtDd4gKP-C86xcFKOGGWBWr9VKhCV2523d7w21Jx668SLQGsGlHxRo6vtQ' },
  ];

  return (
    <div style={{ background: c.surface, minHeight: '100vh', color: c.onSurface, transition: 'background 0.3s, color 0.3s', overflowX: 'hidden', scrollBehavior: 'smooth' }}>

      {/* ── Font imports ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700;800&family=Manrope:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        .brand-btn { background: ${BRAND_GRADIENT}; color: #fff; padding: 16px 36px; border-radius: 9999px; font-family: 'Epilogue', sans-serif; font-weight: 800; font-size: 15px; border: none; cursor: pointer; box-shadow: 0 0 30px rgba(124,58,237,0.35); transition: transform 0.2s, box-shadow 0.2s; letter-spacing: -0.01em; }
        .brand-btn:hover { transform: scale(1.04); box-shadow: 0 0 50px rgba(124,58,237,0.5); }
        .ghost-btn { background: ${c.glassBg}; backdrop-filter: blur(20px); color: ${c.onSurface}; padding: 16px 36px; border-radius: 9999px; font-family: 'Epilogue', sans-serif; font-weight: 700; font-size: 15px; border: 1px solid ${c.outlineVar}; cursor: pointer; transition: all 0.2s; }
        .ghost-btn:hover { border-color: rgba(124,58,237,0.5); }
        .text-grad { background: ${TEXT_GRADIENT}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .float-card { animation: float 4s ease-in-out infinite; }
        .float-card-2 { animation: float 5s ease-in-out infinite 1s; }
        @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; } .nav-links { display: none !important; } .step-grid { grid-template-columns: 1fr !important; } .science-grid { flex-direction: column !important; } .specialist-cascade { margin-left: 0 !important; } }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, ...glass, borderBottom: `1px solid ${c.outlineVar}`, boxShadow: `0 20px 40px ${c.navShadow}` }}>
        <nav style={{ width: '100%', padding: '0 40px', height: 72, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', boxSizing: 'border-box' }}>
          {/* Logo — far left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/Face 1 Purple.png" alt="ROOP AI" style={{ width: 34, height: 34, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', background: TEXT_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ROOP AI</span>
          </div>

          {/* Nav links — true center */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {[
              { label: 'Glow Score',    id: 'glow-score'    },
              { label: 'How It Works',  id: 'products'      },
              { label: 'Specialists',   id: 'specialists'   },
              { label: 'Testimonials',  id: 'testimonials'  },
              { label: 'The Clinic',    id: 'clinic'        },
            ].map(({ label, id }, i) => (
              <a
                key={label}
                href={`#${id}`}
                onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 14, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? c.onSurface : c.onSurfaceVar, textDecoration: 'none', letterSpacing: '-0.01em', transition: 'color 0.2s', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Auth buttons — far right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              style={{ padding: '7px 14px', background: c.surfaceHigh, border: `1px solid ${c.outlineVar}`, borderRadius: 50, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: c.onSurfaceVar, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
              {d ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button onClick={() => setModalMode('login')}
              style={{ padding: '9px 20px', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Epilogue', sans-serif", fontWeight: 600, color: c.onSurfaceVar, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              Login
            </button>
            <button className="brand-btn" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => setModalMode('signup')}>
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowPurple} 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowPink} 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div className="hero-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

          {/* Left — Copy */}
          <div style={{ animation: 'fadeInUp 0.7s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 50, background: c.surfaceHigh, border: `1px solid ${c.outlineVar}`, marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: c.onSurfaceVar, letterSpacing: 2, textTransform: 'uppercase' }}>Real-time Analysis</span>
            </div>

            <h1 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em', margin: '0 0 24px', color: c.onSurface }}>
              Master Your<br /><span className="text-grad">Skin's Story</span>
            </h1>

            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, color: c.onSurfaceVar, lineHeight: 1.75, margin: '0 0 40px', maxWidth: 480 }}>
              Precision AI dermatology meets the ethereal human touch. Discover your Glow Score and enter a new era of clinical-grade skincare personalisation.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}>
              <button className="brand-btn" onClick={() => setModalMode("signup")}>Get Your Glow Score</button>
              <button className="ghost-btn" onClick={() => document.getElementById('specialists')?.scrollIntoView({ behavior: 'smooth' })}>
                Free Specialist Network
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 48 }}>
              {[['50K+', 'Analyses done', c.primary], ['4.9★', 'User rating', c.secondary], ['98%', 'AI accuracy', c.tertiary]].map(([v, l, clr]) => (
                <div key={String(l)}>
                  <div style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 28, fontWeight: 800, color: String(clr), lineHeight: 1, letterSpacing: '-0.03em' }}>{v}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: c.onSurfaceVar, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Hero image card */}
          <div style={{ position: 'relative', animation: 'fadeInUp 0.7s ease 0.15s both' }}>
            {/* Decorative border frame */}
            <div style={{ position: 'absolute', inset: 0, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 48, transform: 'translate(16px, 16px)', zIndex: 0 }} />

            {/* Main image container */}
            <div style={{ position: 'relative', zIndex: 1, borderRadius: 48, overflow: 'hidden', boxShadow: `0 32px 80px ${c.shadow}` }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQuuIGcMrWFEVZVWi0qkeyE64WyZPx3WVNxKRk5J9YFuzkbbkejYHsU72_PEbzqEBBhMHB-4hLXl4ohMqHzrGwPDhToHJuTrJAYBnVc4e7uyhAqU2PaQkOLB6TIzAqnBN-IXxkkAUOwkf0QmqoHrVGEAsExT8L-1XV6Lybg1Vn-o2R8hLjk6WQBTaLemqIXkNnRXFbEiHBRHBaWhpwP64d8rSr22DKdzJolBc5OqFXFeALXmvaJNM7s4jrZO9eJ9QclVZS5XVXcB4"
                alt="Radiant skin close-up"
                style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
                onError={e => {
                  const img = e.currentTarget;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    parent.style.background = d
                      ? 'linear-gradient(145deg, #2a0a4a, #1a1a3a, #0d1a2e)'
                      : 'linear-gradient(145deg, #ede0ff, #fce4f5, #e8d5ff)';
                    parent.style.minHeight = '480px';
                    parent.style.display = 'flex';
                    parent.style.alignItems = 'center';
                    parent.style.justifyContent = 'center';
                    const fallback = document.createElement('div');
                    fallback.style.cssText = 'font-size: 120px; opacity: 0.3;';
                    fallback.textContent = '✨';
                    parent.appendChild(fallback);
                  }
                }}
              />
              {/* Gradient overlay at bottom */}
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${c.surface} 0%, transparent 50%)` }} />

              {/* Floating glass card — Optimal Clarity */}
              <div className="float-card" style={{ position: 'absolute', bottom: 32, left: 24, right: 24, ...glass, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 24, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: c.secondary, fontWeight: 700, margin: '0 0 4px' }}>Luminosity detected</p>
                  <h4 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Optimal Clarity</h4>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${c.secondary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: c.secondary, fontSize: 20, fontWeight: 700 }}>✓</span>
                </div>
              </div>
            </div>

            {/* Floating score badge */}
            <div className="float-card-2" style={{ position: 'absolute', top: 32, right: -24, ...glass, border: `1px solid ${c.outlineVar}`, borderRadius: 20, padding: '16px 20px', boxShadow: `0 16px 40px ${c.shadow}`, minWidth: 120, textAlign: 'center', zIndex: 2 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: c.onSurfaceVar, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Glow Score</div>
              <div style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 36, fontWeight: 800, color: '#22c55e', lineHeight: 1, letterSpacing: '-0.04em' }}>87</div>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, color: c.primary, marginTop: 4, fontWeight: 600 }}>Radiant State ✦</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Glow Score Science ── */}
      <section id="glow-score" style={{ padding: '120px 40px', background: c.surfaceLow }}>
        <div className="science-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 80, alignItems: 'center' }}>
          {/* Score ring */}
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', width: 340 }}>
            <div style={{ position: 'relative', width: 320, height: 320 }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(190,0,98,0.2) 0%, transparent 70%)' }} />
              <div style={{ ...glass, width: 320, height: 320, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.08)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32 }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: c.onSurfaceVar, fontWeight: 600, margin: '0 0 8px' }}>Skin Vitality Index</p>
                <span style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 96, fontWeight: 800, color: c.onSurface, lineHeight: 1, letterSpacing: '-0.05em' }}>85</span>
                <p style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 20, color: c.primary, fontWeight: 700, margin: '8px 0 20px', letterSpacing: '-0.02em' }}>Radiant State</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ height: 4, width: 28, borderRadius: 2, background: i < 4 ? c.primary : c.surfaceHighest }} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Science copy */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 20px', color: c.onSurface }}>
              The Science of<br />The Ethereal Glow
            </h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, color: c.onSurfaceVar, lineHeight: 1.8, margin: '0 0 48px', maxWidth: 500 }}>
              Our proprietary Glow Score goes beyond surface aesthetics. By mapping 4,000+ data points, we evaluate your skin through three primary pillars of clinical excellence.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {SCIENCE.map(s => (
                <div key={s.title} style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 16, background: c.surfaceHigh, border: `1px solid ${c.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: c.primary }}>
                    {s.icon}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 18, fontWeight: 700, color: c.onSurface, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{s.title}</h4>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: c.onSurfaceVar, margin: 0, lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="products" style={{ padding: '120px 40px', background: c.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: c.primary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2 }}>Simple Process</span>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', color: c.onSurface, margin: '12px 0 0' }}>
              Medical-Grade <span className="text-grad">Curation</span>
            </h2>
          </div>
          <div className="step-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ ...glass, border: `1px solid ${c.outlineVar}`, borderRadius: 32, padding: '40px 32px' }}>
                <div style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 12, fontWeight: 800, color: c.primary, letterSpacing: 2, marginBottom: 20, textTransform: 'uppercase' }}>{s.n}</div>
                <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 22, fontWeight: 800, color: c.onSurface, margin: '0 0 12px', letterSpacing: '-0.03em' }}>{s.title}</h3>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: c.onSurfaceVar, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialists ── */}
      <section id="specialists" style={{ padding: '120px 40px', background: c.surfaceLow, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 800, height: 800, background: `radial-gradient(circle, ${c.glowPurple} 0%, transparent 60%)`, transform: 'translate(30%, -30%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 24px', color: c.onSurface }}>
              Elite Access<br />To Board-Certified<br /><span className="text-grad">Clinical Minds</span>
            </h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, color: c.onSurfaceVar, lineHeight: 1.8, margin: '0 0 48px', maxWidth: 440 }}>
              AI provides the data; our specialists provide the wisdom. Gain direct access to the world's leading dermatology specialists for bespoke consultations.
            </p>
            <div style={{ display: 'flex', gap: 64, marginBottom: 48 }}>
              {[['150+', 'Specialists', c.primary], ['24h', 'Rapid Response', c.secondary]].map(([v, l, clr]) => (
                <div key={String(l)}>
                  <div style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 40, fontWeight: 800, color: String(clr), letterSpacing: '-0.04em', lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: c.onSurfaceVar, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1.5 }}>{l}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setModalMode("signup")}
              style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'none', border: 'none', color: c.onSurface, fontFamily: "'Epilogue', sans-serif", fontWeight: 700, fontSize: 16, cursor: 'pointer', letterSpacing: '-0.01em' }}>
              Explore Specialist Directory
              <span style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${c.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>→</span>
            </button>
          </div>

          {/* Cascading doctor cards */}
          <div className="specialist-cascade" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginLeft: 24 }}>
            {DOCTORS.map((doc) => (
              <div key={doc.name} style={{ ...glass, border: `1px solid ${c.outlineVar}`, borderRadius: 28, padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'center', marginLeft: doc.offset }}>
                <img src={doc.img} alt={doc.name}
                  style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover', flexShrink: 0 }}
                  onError={e => { const el = e.currentTarget; el.style.display = 'none'; const sib = el.nextElementSibling as HTMLElement; if (sib) sib.style.display = 'flex'; }}
                />
                <div style={{ width: 72, height: 72, borderRadius: 18, background: BRAND_GRADIENT, display: 'none', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Epilogue', sans-serif", flexShrink: 0 }}>
                  {doc.name[3]}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 17, fontWeight: 700, color: c.onSurface, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{doc.name}</h4>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: c.primary, fontWeight: 600, margin: '0 0 8px' }}>{doc.spec}</p>
                  <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: c.tertiary, fontSize: 12 }}>★</span>)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" style={{ padding: '120px 40px', background: c.surfaceLow, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: c.primary, marginBottom: 16 }}>Real Results</p>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: c.onSurface, margin: 0 }}>
              Skin that <span className="text-grad">speaks for itself</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { name: 'Priya Mehta', city: 'Mumbai', score: 84, avatar: 'PM', quote: 'I was skeptical at first, but after my first scan ROOP AI caught my dehydration pattern instantly. My skin cleared up in 3 weeks just following the routine.', tag: 'Oily + Acne-prone', color: '#7C3AED' },
              { name: 'Arjun Kapoor', city: 'Delhi', score: 91, avatar: 'AK', quote: 'The Glow Score actually motivated me to be consistent. Went from a 67 to 91 in 6 weeks. The product picks were spot on — nothing generic.', tag: 'Combination skin', color: '#BE0062' },
              { name: 'Sneha Iyer', city: 'Bangalore', score: 78, avatar: 'SI', quote: 'Tried 4 apps before this. ROOP AI is the only one that felt like a real dermatologist was looking at my face. The dark circle analysis was scarily accurate.', tag: 'Dry + Sensitive', color: '#7C3AED' },
              { name: 'Rahul Sharma', city: 'Pune', score: 88, avatar: 'RS', quote: 'As a guy I never paid attention to skincare. ROOP AI made it dead simple — 3 steps morning, 3 evening. My confidence is completely different now.', tag: 'Normal skin', color: '#BE0062' },
              { name: 'Ananya Singh', city: 'Chennai', score: 76, avatar: 'AS', quote: 'The specialist recommendations led me to a dermatologist who finally diagnosed my rosacea. I had been treating it wrong for years.', tag: 'Rosacea-prone', color: '#7C3AED' },
              { name: 'Vikram Nair', city: 'Hyderabad', score: 93, avatar: 'VN', quote: 'I travel constantly and my skin was suffering. The weekly mask plan adjusted to my skin type each scan. It is like having a skin coach in my pocket.', tag: 'Combination skin', color: '#BE0062' },
            ].map((t, i) => (
              <div key={t.name} style={{ ...glass, border: `1px solid ${c.outlineVar}`, borderRadius: 28, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 20, transform: i % 2 === 1 ? 'translateY(20px)' : 'none' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, color: c.onSurfaceVar, lineHeight: 1.75, margin: 0, flex: 1 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 16, borderTop: `1px solid ${c.outlineVar}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Epilogue', sans-serif", fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 15, fontWeight: 700, color: c.onSurface, margin: '0 0 2px', letterSpacing: '-0.02em' }}>{t.name}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: c.onSurfaceVar, margin: 0 }}>{t.city} · {t.tag}</p>
                  </div>
                  <div style={{ background: BRAND_GRADIENT, borderRadius: 12, padding: '4px 12px', fontFamily: "'Epilogue', sans-serif", fontSize: 13, fontWeight: 800, color: '#fff' }}>{t.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="clinic" style={{ padding: '120px 40px', background: c.surface }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ ...glass, border: `1px solid ${c.outlineVar}`, borderRadius: 64, padding: '100px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(190,0,98,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.95, margin: '0 0 24px', color: c.onSurface }}>
                Join the Ethereal Clinic<br /><span className="text-grad">of Skin Health</span>
              </h2>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, color: c.onSurfaceVar, maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.75 }}>
                Step into the future of precision dermatology. Your personalised skin journey starts with a single scan.
              </p>
              <button className="brand-btn" style={{ fontSize: 18, padding: '20px 52px' }} onClick={() => setModalMode("signup")}>
                Begin Your Analysis
              </button>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: c.onSurfaceVar, marginTop: 20 }}>Free to start · No credit card · 60-second analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: c.surfaceLow, padding: '64px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/Face 1 Purple.png" alt="ROOP AI" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em', background: TEXT_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ROOP AI</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: c.onSurfaceVar, marginLeft: 4 }}>© 2026 The Ethereal Clinic.</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Scientific Protocol', 'Privacy', 'Terms', 'Membership'].map(l => (
              <a key={l} href="#" style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: c.onSurfaceVar, textDecoration: 'none', transition: 'color 0.2s' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Sign-in Modal ── */}
      {modalMode && <SignInModal c={c} onClose={() => setModalMode(null)} mode={modalMode} />}
    </div>
  );
}
