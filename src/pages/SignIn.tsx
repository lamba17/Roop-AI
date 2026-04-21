import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { signInWithGoogle, supabase } from '../lib/supabase';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Spinner({ size = 20 }: { size?: number }) {
  return <span className="spinner" style={{ width: size, height: size, borderWidth: 2, flexShrink: 0 }} />;
}

const FEATURES = [
  { icon: '✨', title: 'AI Glow Score', desc: 'Instant skin analysis from a single selfie' },
  { icon: '🧴', title: 'Daily Ritual', desc: 'Personalised morning & night routine for your skin' },
  { icon: '🛍️', title: 'Product Picks', desc: 'Curated recommendations with Nykaa & Amazon links' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Watch your skin improve scan by scan over time' },
  { icon: '🩺', title: 'Specialist Finder', desc: 'Connect with verified dermatologists near you' },
];

const STATS = [
  { value: '50K+', label: 'Analyses done' },
  { value: '4.9★', label: 'User rating' },
  { value: '98%', label: 'Accuracy score' },
];

export default function SignIn() {
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicEmail, setMagicEmail] = useState('');
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!magicEmail.trim()) return;
    setError(null);
    setMagicLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: magicEmail.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (otpError) throw new Error(otpError.message);
      setMagicSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link. Try again.');
    } finally {
      setMagicLoading(false);
    }
  }

  return (
    <div
      className="mesh-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="hero-glow" />

      {/* Outer wrapper — two columns on desktop */}
      <div style={{
        width: '100%',
        maxWidth: 900,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 0,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        border: '1px solid rgba(168,85,247,0.18)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both',
      }}>

        {/* ── LEFT: Features panel ─────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(160deg, #0d0d22 0%, #160d2e 60%, #0d1a2e 100%)',
          padding: '44px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(168,85,247,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 220, height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -40,
            width: 180, height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div>
            {/* Logo + Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
              <Logo size="sm" />
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#f8f8ff', lineHeight: 1 }}>
                  ROOP AI
                </div>
                <div style={{ fontSize: 11, color: 'rgba(168,85,247,0.7)', fontFamily: "'DM Sans', sans-serif", letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>
                  Skin Coach
                </div>
              </div>
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 700,
              margin: '0 0 10px',
              lineHeight: 1.25,
              color: '#f8f8ff',
            }}>
              Your skin's AI coach,<br />
              <span className="gradient-text">always on call.</span>
            </h2>
            <p style={{
              fontSize: 13,
              color: 'rgba(248,248,255,0.5)',
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.7,
              margin: '0 0 32px',
            }}>
              Upload a selfie. Get a full skin report in seconds — completely personalised to you.
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
              {FEATURES.map(f => (
                <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(168,85,247,0.12)',
                    border: '1px solid rgba(168,85,247,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f8f8ff', fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.45)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 0,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(168,85,247,0.15)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                flex: 1, textAlign: 'center', padding: '14px 8px',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(168,85,247,0.12)' : 'none',
              }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#a855f7', fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(248,248,255,0.35)', fontFamily: "'DM Sans', sans-serif", marginTop: 4, letterSpacing: 0.3 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Sign-in form ──────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(160deg, #12122a 0%, #1a1a35 100%)',
          padding: '44px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
              fontWeight: 700,
              margin: '0 0 8px',
              lineHeight: 1.25,
              color: '#f8f8ff',
            }}>
              Your skin story{' '}
              <span className="gradient-text">starts here</span>
            </h1>
            <p style={{
              fontSize: 13,
              color: 'rgba(248,248,255,0.45)',
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.6,
            }}>
              Sign in to save your analyses and unlock your full skin profile.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 18, padding: '12px 16px',
              background: 'rgba(239,68,68,0.08)', borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.25)',
            }}>
              <p style={{ margin: 0, fontSize: 13, color: '#f87171', fontFamily: "'DM Sans', sans-serif" }}>
                {error}
              </p>
            </div>
          )}

          {/* Google Sign-In */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: '14px 20px',
              background: '#ffffff', color: '#1f1f1f',
              border: 'none', borderRadius: 14,
              fontSize: 15, fontWeight: 600,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              opacity: googleLoading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              marginBottom: 6,
            }}
            onMouseEnter={e => {
              if (!googleLoading) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.45)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)';
            }}
          >
            {googleLoading ? <Spinner size={20} /> : <GoogleIcon />}
            {googleLoading ? 'Connecting…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)' }} />
            <span style={{ fontSize: 12, color: 'rgba(248,248,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)' }} />
          </div>

          {/* Magic Link */}
          {magicSent ? (
            <div style={{
              padding: '16px 20px', marginBottom: 24,
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14,
            }}>
              <p style={{ margin: 0, fontSize: 14, color: '#4ade80', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
                ✅ Magic link sent to <strong>{magicEmail}</strong>. Check your inbox and click the link to sign in.
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} style={{ marginBottom: 20 }}>
              <input
                type="email"
                value={magicEmail}
                onChange={e => setMagicEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: '100%', padding: '13px 16px',
                  background: 'rgba(20,20,42,0.8)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: 12, color: '#f8f8ff',
                  fontSize: 14, fontFamily: "'DM Sans', system-ui, sans-serif",
                  outline: 'none', marginBottom: 10,
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }}
              />
              <button
                type="submit"
                disabled={magicLoading || !magicEmail.trim()}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '13px 20px' }}
              >
                {magicLoading ? <><Spinner size={18} /> Sending…</> : '✉️ Send Magic Link'}
              </button>
            </form>
          )}

          {/* Trust badges */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
            marginBottom: 20,
          }}>
            {['🔒 Encrypted', '🆓 Free to start', '❌ No card needed'].map(badge => (
              <span key={badge} style={{
                fontSize: 11, color: 'rgba(248,248,255,0.35)',
                fontFamily: "'DM Sans', sans-serif",
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: '4px 10px',
              }}>
                {badge}
              </span>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            background: 'rgba(168,85,247,0.06)',
            border: '1px solid rgba(168,85,247,0.14)',
            borderRadius: 14, padding: '14px 16px',
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f59e0b', fontSize: 12 }}>★</span>)}
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: 'rgba(248,248,255,0.6)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, fontStyle: 'italic' }}>
              "Genuinely shocked by how accurate the analysis was. My skin has improved so much following the routine."
            </p>
            <div style={{ fontSize: 11, color: 'rgba(168,85,247,0.7)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              — Priya V., Mumbai
            </div>
          </div>

          {/* Guest link */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(248,248,255,0.3)', fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer', padding: '4px 8px',
                transition: 'color 0.2s',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(248,248,255,0.1)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,248,255,0.55)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,248,255,0.3)'; }}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
