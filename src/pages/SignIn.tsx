import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { signInWithGoogle, supabase } from '../lib/supabase';

/* ── Google SVG icon ─────────────────────────────────────────────────── */
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

/* ── Spinner ──────────────────────────────────────────────────────────── */
function Spinner({ size = 20 }: { size?: number }) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size, borderWidth: 2, flexShrink: 0 }}
    />
  );
}

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
      // Redirect happens automatically via Supabase OAuth flow
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div className="hero-glow" />

      {/* Card */}
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 420,
          textAlign: 'center',
          animation: 'fadeInUp 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div className="pulse-ring">
            <Logo size="lg" />
          </div>
        </div>

        {/* Tagline */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
            fontWeight: 700,
            margin: '0 0 8px',
            lineHeight: 1.25,
          }}
        >
          Your skin story{' '}
          <span className="gradient-text">starts here</span>
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'rgba(248,248,255,0.5)',
            margin: '0 0 32px',
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.6,
          }}
        >
          Sign in to save your analyses, track your glow progress, and unlock personalised insights.
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: 18,
              padding: '12px 16px',
              background: 'rgba(239,68,68,0.08)',
              borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.25)',
            }}
          >
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
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '14px 20px',
            background: '#ffffff',
            color: '#1f1f1f',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            opacity: googleLoading ? 0.7 : 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s',
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '20px 0',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)' }} />
          <span style={{ fontSize: 12, color: 'rgba(248,248,255,0.35)', fontFamily: "'DM Sans', sans-serif" }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.2)' }} />
        </div>

        {/* Magic Link */}
        {magicSent ? (
          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 14,
              marginBottom: 24,
            }}
          >
            <p style={{ margin: 0, fontSize: 14, color: '#4ade80', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
              ✅ Magic link sent to <strong>{magicEmail}</strong>. Check your inbox and click the link to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} style={{ marginBottom: 24 }}>
            <input
              type="email"
              value={magicEmail}
              onChange={e => setMagicEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '13px 16px',
                background: 'rgba(20,20,42,0.8)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 12,
                color: '#f8f8ff',
                fontSize: 14,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                outline: 'none',
                marginBottom: 10,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
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

        {/* Guest link */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(248,248,255,0.35)',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer',
            padding: '4px 8px',
            transition: 'color 0.2s',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(248,248,255,0.15)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,248,255,0.6)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,248,255,0.35)'; }}
        >
          Continue as Guest
        </button>
      </div>

      {/* Trust line */}
      <p
        style={{
          marginTop: 20,
          fontSize: 12,
          color: 'rgba(248,248,255,0.2)',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: 0.5,
          position: 'relative',
          zIndex: 1,
        }}
      >
        🔒 &nbsp;Your data is encrypted and never sold
      </p>
    </div>
  );
}
