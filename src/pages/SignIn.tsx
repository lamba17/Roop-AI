import { useState, useEffect } from 'react';
import { signInWithGoogle, supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

type Theme = 'dark' | 'light';

function tok(t: Theme) {
  const d = t === 'dark';
  return {
    surface:          d ? '#171020' : '#f4f0ff',
    surfaceLow:       d ? '#201829' : '#e8e0f8',
    surfaceContainer: d ? '#241c2d' : '#ddd5f5',
    surfaceHigh:      d ? '#2f2738' : '#ccc0ee',
    surfaceHighest:   d ? '#3a3143' : '#b8a8e4',
    onSurface:        d ? '#ebdef5' : '#1a0a3a',
    onSurfaceVar:     d ? '#ccc3d8' : '#5a4a7a',
    primary:          d ? '#d2bbff' : '#7c3aed',
    primaryContainer: '#7c3aed',
    secondary:        d ? '#ffb1c7' : '#be0062',
    secondaryContainer:'#be0062',
    tertiary:         d ? '#ffb95f' : '#b45309',
    outlineVar:       d ? 'rgba(74,68,85,0.4)' : 'rgba(124,58,237,0.15)',
    navShadow:        d ? 'rgba(19,12,28,0.5)' : 'rgba(100,50,180,0.08)',
    glowPurple:       d ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)',
    glowPink:         d ? 'rgba(190,0,98,0.12)' : 'rgba(190,0,98,0.07)',
    glassBg:          d ? 'rgba(47,39,56,0.45)' : 'rgba(255,255,255,0.65)',
    white:            '#ffffff',
    shadow:           d ? 'rgba(19,12,28,0.45)' : 'rgba(80,40,160,0.12)',
  };
}

const BRAND_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #be0062 100%)';
const TEXT_GRADIENT  = 'linear-gradient(135deg, #d2bbff 0%, #ffb1c7 100%)';

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

function SignInModal({ c, onClose, mode }: { c: ReturnType<typeof tok>; onClose: () => void; mode: 'login' | 'signup' }) {
  const [gLoading, setGLoading] = useState(false);
  const [email, setEmail]       = useState('');
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
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
          ...(mode === 'signup' && { data: {
            full_name: name.trim(),
            first_name: name.trim().split(' ')[0],
            phone: phone ? `+91${phone}` : null,
          }}),
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

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
            <img src="/Face 1 Purple.png" alt="ROOP AI" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', background: TEXT_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ROOP AI</span>
          </div>
          <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.03em', color: c.onSurface }}>
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: 13, color: c.onSurfaceVar, margin: 0, fontFamily: "'Manrope', sans-serif", lineHeight: 1.6 }}>
            {isSignup ? 'Join ROOP AI — get your Glow Score and personalised skincare.' : 'Sign in to access your Glow Score and skincare profile.'}
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(147,0,10,0.15)', borderRadius: 14, border: '1px solid rgba(255,180,171,0.2)' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#ffb4ab', fontFamily: "'Manrope', sans-serif" }}>{error}</p>
          </div>
        )}

        <button onClick={handleGoogle} disabled={gLoading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px 20px', background: '#fff', color: '#1a1a2e', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700, fontFamily: "'Manrope', sans-serif", cursor: gLoading ? 'not-allowed' : 'pointer', opacity: gLoading ? 0.7 : 1, boxShadow: `0 4px 20px ${c.shadow}`, marginBottom: 20 }}>
          {gLoading ? <Spinner size={18} /> : <GoogleIcon />}
          {gLoading ? 'Connecting…' : isSignup ? 'Sign up with Google' : 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: c.outlineVar }} />
          <span style={{ fontSize: 11, color: c.onSurfaceVar, fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>or {isSignup ? 'sign up' : 'sign in'} with email</span>
          <div style={{ flex: 1, height: 1, background: c.outlineVar }} />
        </div>

        {sent ? (
          <div style={{ padding: '20px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📬</div>
            <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#4ade80', fontFamily: "'Manrope', sans-serif" }}>Check your inbox</p>
            <p style={{ margin: 0, fontSize: 13, color: c.onSurfaceVar, fontFamily: "'Manrope', sans-serif", lineHeight: 1.6 }}>
              Magic link sent to <strong style={{ color: c.onSurface }}>{email}</strong>. Click it to {isSignup ? 'activate your account' : 'sign in'} instantly.
            </p>
            <button style={{ marginTop: 14, background: 'none', border: 'none', color: c.onSurfaceVar, fontSize: 12, fontFamily: "'Manrope', sans-serif", cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => { setSent(false); setEmail(''); setName(''); setPhone(''); }}>
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your full name" required style={inputStyle}
                onFocus={focusIn} onBlur={focusOut} />
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required style={inputStyle}
              onFocus={focusIn} onBlur={focusOut} />
            {isSignup && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ position: 'absolute', left: 14, fontSize: 14, fontWeight: 600, color: c.onSurfaceVar, fontFamily: "'Manrope', sans-serif", pointerEvents: 'none', userSelect: 'none' }}>+91</span>
                <input type="tel" value={phone}
                  onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setPhone(val); }}
                  placeholder="WhatsApp number (optional)" maxLength={10}
                  style={{ ...inputStyle, paddingLeft: 48, paddingRight: 80, marginBottom: 0 }}
                  onFocus={focusIn} onBlur={focusOut} />
                <span style={{ position: 'absolute', right: 14, fontSize: 10, color: c.onSurfaceVar, fontFamily: "'Inter', sans-serif", background: c.surfaceHigh, padding: '2px 8px', borderRadius: 20, pointerEvents: 'none' }}>optional</span>
              </div>
            )}
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

export default function SignIn() {
  const { forceTheme } = useTheme();
  const [theme, setTheme]         = useState<Theme>('light');
  const [modalMode, setModalMode] = useState<'login' | 'signup' | null>(null);

  useEffect(() => { forceTheme('light'); }, []);
  const c = tok(theme);
  const d = theme === 'dark';

  const glass: React.CSSProperties = { background: c.glassBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' };

  const STEPS = [
    { n: '01', title: 'Upload Your Selfie', desc: 'Take a clear, natural-light selfie and upload it in seconds from any device.' },
    { n: '02', title: 'Get Your Glow Score', desc: 'Our AI analyzes your skin across 5 clinical dimensions and delivers results in real time.' },
    { n: '03', title: 'Follow Your Routine', desc: 'Get a personalised morning & evening routine, product recommendations, and dermatologist access.' },
  ];

  const DOCTORS = [
    { name: 'Dr. Elena Vos',    spec: 'Regenerative Aesthetics', offset: 48, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeZA6U98X4RA-0JNNIkC7_PnM2MPCJAfF3-Ebf7Zvmqqo3apw1wZm5qpI0XfY606v9yfmVt74A2ZJx38QYOzLXZf6A86VO0yxivR-CgnY2H-iXf8B95FeXaJ1aOELEm_68emOUubvqKS-wk7mtotjxTwbELpsmD0NIuOmQAIMFFQZRnAwUK5B1z3a9UwOVKqkAHITzqB5QbjUP_TPdrjK4836QbRmYd0Fz6VoJEhhDfQdumyqE8CvzwUHLKrQKPVISpbpDNqG1eKU' },
    { name: 'Dr. Marcus Chen',  spec: 'Clinical Dermatology',    offset: 0,  img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdHzcb4hK3Ve2PL7AjZTsK_P53T0pGlvfe3-rVG4D44OG76ob4I0dO8PFe1vIRPtpMVpDvZTZV7tD2-EbACjWDVjYZJwaA50n0OmWOE684sqdzMsZEXf5aWuVvL2quRXCk2bgeFWxn_zZsLD91yuDAb3lZvsT-pLPU15RtTRCb0c-SDsM2_r01G2Q6RkTKzIxocngr6bQ9u-afR3I2s6tazlaP6LsRs7LDDWrJKKknkJ6kQCLAA-Jdjoi-wdvXEVXiDT7sRBGj4Sg' },
    { name: 'Dr. Sarah Julian', spec: 'Dermal Science',          offset: 32, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJVqAtN7qKWFPE7OV0DGM4vJ7PhlTJBJ-bbUdUod6Oegi5qvOtUsaL_9ve93h0cHZEb9lwverAS_-8lT1-n7Pa1fKm5m_5ZdnzHno21qCeDBjrsltsVdWXuoXFIFtSSAyLC-BPal1fpWCwI3tWysEBKp-zRThe2k-aps6OOPDnHeOR1AIipaxFreKDT9qz3ELlq6PYn_N6JzsA7lEyLjtDd4gKP-C86xcFKOGGWBWr9VKhCV2523d7w21Jx668SLQGsGlHxRo6vtQ' },
  ];

  return (
    <div style={{ background: c.surface, minHeight: '100vh', color: c.onSurface, transition: 'background 0.3s, color 0.3s', overflowX: 'hidden', scrollBehavior: 'smooth' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700;800&family=Manrope:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        .brand-btn { background: ${BRAND_GRADIENT}; color: #fff; padding: 12px 28px; border-radius: 9999px; font-family: 'Epilogue', sans-serif; font-weight: 700; font-size: 14px; border: none; cursor: pointer; box-shadow: 0 0 24px rgba(124,58,237,0.3); transition: transform 0.2s, box-shadow 0.2s; letter-spacing: -0.01em; white-space: nowrap; }
        .brand-btn:hover { transform: scale(1.03); box-shadow: 0 0 40px rgba(124,58,237,0.5); }
        .ghost-btn { background: ${c.glassBg}; backdrop-filter: blur(20px); color: ${c.onSurface}; padding: 16px 36px; border-radius: 9999px; font-family: 'Epilogue', sans-serif; font-weight: 700; font-size: 15px; border: 1px solid ${c.outlineVar}; cursor: pointer; transition: all 0.2s; }
        .ghost-btn:hover { border-color: rgba(124,58,237,0.5); }
        .text-grad { background: ${TEXT_GRADIENT}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .nav-link { color: ${c.onSurfaceVar}; text-decoration: none; font-family: 'Epilogue', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: -0.01em; transition: color 0.2s; cursor: pointer; white-space: nowrap; }
        .nav-link:hover { color: ${c.onSurface}; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .float-card { animation: float 4s ease-in-out infinite; }
        .float-card-2 { animation: float 5s ease-in-out infinite 1s; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .step-grid { grid-template-columns: 1fr !important; }
          .specialist-cascade { margin-left: 0 !important; }
          .theme-toggle-btn { width: 32px !important; height: 32px !important; font-size: 14px !important; }
          .nav-login-btn { padding: 6px 10px !important; font-size: 12px !important; }
          .nav-auth-right { gap: 4px !important; }
          .landing-nav { padding: 0 14px !important; grid-template-columns: 1fr auto !important; }
          .brand-btn { padding: 8px 14px !important; font-size: 12px !important; }
          .hero-inner { padding: 80px 20px 40px !important; }
          .hero-stats { gap: 24px !important; flex-wrap: wrap !important; }
          .section-padded { padding: 80px 20px !important; }
          .cta-box { padding: 60px 28px !important; border-radius: 32px !important; }
        }
      `}</style>

      {/* Navbar */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, ...glass, borderBottom: `1px solid ${c.outlineVar}`, boxShadow: `0 20px 40px ${c.navShadow}` }}>
        <nav className="landing-nav" style={{ width: '100%', padding: '0 40px', height: 72, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/Face 1 Purple.png" alt="ROOP AI" style={{ width: 32, height: 32, objectFit: 'contain', display: 'block' }} />
            <span style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 19, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, background: BRAND_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ROOP AI</span>
          </div>

          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'Specialists', id: 'specialists' },
              { label: 'Reviews', id: 'reviews' },
              { label: 'Get Started', id: 'get-started' }
            ].map(item => (
              <a key={item.id} href={`#${item.id}`} className="nav-link">{item.label}</a>
            ))}
          </div>

          <div className="nav-auth-right" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <button className="theme-toggle-btn" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              style={{ width: 36, height: 36, borderRadius: '50%', background: c.surfaceHigh, border: `1px solid ${c.outlineVar}`, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {d ? '☀️' : '🌙'}
            </button>
            <button className="nav-login-btn" onClick={() => setModalMode('login')}
              style={{ padding: '8px 16px', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Epilogue', sans-serif", fontWeight: 600, color: c.onSurfaceVar, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              Login
            </button>
            <button className="brand-btn" style={{ padding: '10px 20px', fontSize: 13, letterSpacing: '-0.01em' }} onClick={() => setModalMode('signup')}>
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowPurple} 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div className="hero-grid hero-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

          <div style={{ animation: 'fadeInUp 0.7s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 50, background: c.surfaceHigh, border: `1px solid ${c.outlineVar}`, marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: c.onSurfaceVar, letterSpacing: 2, textTransform: 'uppercase' }}>Real-time AI Analysis</span>
            </div>

            <h1 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em', margin: '0 0 24px', color: c.onSurface }}>
              Your AI Coach<br />for Skin <span className="text-grad">Health</span>
            </h1>

            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, color: c.onSurfaceVar, lineHeight: 1.75, margin: '0 0 36px', maxWidth: 480 }}>
              Upload a selfie and get your Glow Score — a clinical analysis of your skin health with personalized skincare routines and dermatologist recommendations.
            </p>

            <div style={{ marginBottom: 56 }}>
              <button className="brand-btn" style={{ padding: '15px 28px', fontSize: 14 }} onClick={() => setModalMode('signup')}>
                🌿 Start Glow Score
              </button>
            </div>

            <div className="hero-stats" style={{ display: 'flex', gap: 48 }}>
              {[['50K+', 'Analyses done', c.primary], ['4.9★', 'User rating', c.secondary], ['98%', 'AI accuracy', c.tertiary]].map(([v, l, clr]) => (
                <div key={String(l)}>
                  <div style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 28, fontWeight: 800, color: String(clr), lineHeight: 1, letterSpacing: '-0.03em' }}>{v}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: c.onSurfaceVar, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', animation: 'fadeInUp 0.7s ease 0.15s both' }}>
            <div style={{ position: 'absolute', inset: 0, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 48, transform: 'translate(16px, 16px)', zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1, borderRadius: 48, overflow: 'hidden', boxShadow: `0 32px 80px ${c.shadow}` }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQuuIGcMrWFEVZVWi0qkeyE64WyZPx3WVNxKRk5J9YFuzkbbkejYHsU72_PEbzqEBBhMHB-4hLXl4ohMqHzrGwPDhToHJuTrJAYBnVc4e7uyhAqU2PaQkOLB6TIzAqnBN-IXxkkAUOwkf0QmqoHrVGEAsExT8L-1XV6Lybg1Vn-o2R8hLjk6WQBTaLemqIXkNnRXFbEiHBRHBaWhpwP64d8rSr22DKdzJolBc5OqFXFeALXmvaJNM7s4jrZO9eJ9QclVZS5XVXcB4"
                alt="Glowing skin"
                style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${c.surface} 0%, transparent 50%)` }} />

              <div className="float-card-2" style={{ position: 'absolute', top: 32, right: -24, ...glass, border: `1px solid ${c.outlineVar}`, borderRadius: 20, padding: '14px 18px', boxShadow: `0 16px 40px ${c.shadow}`, minWidth: 110, textAlign: 'center', zIndex: 2 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: c.onSurfaceVar, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>Glow Score</div>
                <div style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 34, fontWeight: 800, color: '#22c55e', lineHeight: 1, letterSpacing: '-0.04em' }}>87</div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10, color: c.primary, marginTop: 3, fontWeight: 600 }}>🌿 Radiant State</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '120px 40px', background: c.surface }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: c.primary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2 }}>Simple Process</span>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', color: c.onSurface, margin: '12px 0 0', lineHeight: 1.05 }}>
              Get Your <span className="text-grad">Glow Score</span>
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

      {/* SPECIALISTS */}
      <section id="specialists" style={{ padding: '120px 40px', background: c.surfaceLow, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 800, height: 800, background: `radial-gradient(circle, ${c.glowPurple} 0%, transparent 60%)`, transform: 'translate(30%, -30%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 80, alignItems: 'center' }}>
          <div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 20 }}>🌿 Specialist Access</span>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 24px', color: c.onSurface }}>
              Connect With<br /><span className="text-grad">Dermatologists</span>
            </h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, color: c.onSurfaceVar, lineHeight: 1.8, margin: '0 0 48px', maxWidth: 440 }}>
              Get personalized consultations with board-certified dermatologists who can provide advanced treatment recommendations based on your Glow Score analysis.
            </p>
            <button onClick={() => setModalMode('signup')}
              style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'none', border: 'none', color: c.onSurface, fontFamily: "'Epilogue', sans-serif", fontWeight: 700, fontSize: 16, cursor: 'pointer', letterSpacing: '-0.01em' }}>
              Browse Specialists
              <span style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${c.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>→</span>
            </button>
          </div>

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

      {/* REVIEWS */}
      <section id="reviews" style={{ padding: '120px 40px', background: c.surfaceLow, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 24px', color: c.onSurface }}>
              Join <span className="text-grad">10,000+ users</span> already glowing
            </h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, color: c.onSurfaceVar, maxWidth: 580, margin: '0 auto' }}>
              Real transformations from real people using the Glow Score
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {[
              { name: 'Priya M.', role: 'Product Manager', text: 'My skin completely transformed in 3 months. The personalized routine from Glow Score made all the difference.' },
              { name: 'Rajesh K.', role: 'Software Engineer', text: 'Finally understood my skin type. The dermatologist recommendations were spot-on.' },
              { name: 'Aisha P.', role: 'Designer', text: 'The Glow Score analysis is incredibly accurate. It\'s like having a dermatologist in my pocket.' },
              { name: 'Deepak S.', role: 'Student', text: 'Cleared my acne using the suggested routine. The daily checklist keeps me accountable.' }
            ].map(review => (
              <div key={review.name} style={{ ...glass, border: `1px solid ${c.outlineVar}`, borderRadius: 24, padding: 32 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: c.onSurfaceVar, margin: '0 0 24px', lineHeight: 1.7 }}>"{review.text}"</p>
                <div>
                  <p style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 14, fontWeight: 700, color: c.onSurface, margin: 0 }}>{review.name}</p>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: c.onSurfaceVar, margin: '4px 0 0' }}>{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="get-started" style={{ padding: '120px 40px', background: c.surface }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="cta-box" style={{ ...glass, border: `1px solid ${c.outlineVar}`, borderRadius: 64, padding: '100px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(124,58,237,0.1) 0%, transparent 55%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ padding: '8px 20px', borderRadius: 50, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, color: c.primary, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
                🌿 Glow Score
              </div>
              <h2 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.95, margin: '0 0 24px', color: c.onSurface }}>
                Transform Your<br /><span className="text-grad">Skincare Journey</span>
              </h2>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, color: c.onSurfaceVar, maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.75 }}>
                Step into the future of personalized skincare. Your AI-powered analysis and dermatologist guidance starts with a single scan.
              </p>
              <button className="brand-btn" style={{ fontSize: 16, padding: '18px 44px' }} onClick={() => setModalMode('signup')}>
                🌿 Start Your Glow Score
              </button>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: c.onSurfaceVar, marginTop: 20 }}>Free to start · No credit card · 60-second analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: c.surfaceLow, padding: '64px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/Face 1 Purple.png" alt="ROOP AI" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em', background: TEXT_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ROOP AI</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: c.onSurfaceVar, marginLeft: 4 }}>© 2026 ROOP AI.</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Glow Score', 'Privacy', 'Terms'].map(l => (
              <a key={l} href="#" style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: c.onSurfaceVar, textDecoration: 'none', transition: 'color 0.2s' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {modalMode && <SignInModal c={c} onClose={() => setModalMode(null)} mode={modalMode} />}
    </div>
  );
}
