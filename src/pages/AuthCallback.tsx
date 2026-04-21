import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState('Signing you in…');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      // ── 1. Check for error params Supabase puts in the URL ──────────────
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get('error');
      const urlErrorDesc = params.get('error_description');

      if (urlError) {
        const msg = urlErrorDesc
          ? decodeURIComponent(urlErrorDesc.replace(/\+/g, ' '))
          : urlError;
        setErrorMsg(msg);
        return;
      }

      // ── 2. PKCE flow: ?code=... in query string ──────────────────────────
      const code = params.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        setTimeout(() => navigate('/dashboard', { replace: true }), 600);
        return;
      }

      // ── 3. Implicit / magic-link flow: #access_token=... in hash ────────
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        // Supabase JS client picks up the fragment automatically via
        // onAuthStateChange — just wait briefly then redirect.
        setStatusText('Finalising your account…');
        setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        return;
      }

      // ── 4. Nothing in URL — session may already be active ───────────────
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setTimeout(() => navigate('/dashboard', { replace: true }), 600);
      } else {
        setErrorMsg(
          'The sign-in link has expired or is invalid. Please request a new one.'
        );
      }
    }

    handleCallback();
  }, [navigate]);

  if (errorMsg) {
    return (
      <div
        className="mesh-bg"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '24px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="hero-glow" />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <Logo size="lg" />
          </div>
          <div
            style={{
              padding: '20px 24px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 16,
              marginBottom: 24,
            }}
          >
            <p style={{ fontSize: 22, margin: '0 0 10px' }}>⚠️</p>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: '#f87171',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                lineHeight: 1.6,
              }}
            >
              {errorMsg}
            </p>
          </div>
          <button
            onClick={() => navigate('/signin', { replace: true })}
            className="btn-glow"
            style={{ justifyContent: 'center', width: '100%' }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
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
        gap: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="hero-glow" />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div className="pulse-ring">
            <Logo size="lg" />
          </div>
        </div>

        <span
          className="spinner"
          style={{ width: 36, height: 36, borderWidth: 3, display: 'block', margin: '0 auto 18px' }}
        />

        <p
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 16,
            color: 'rgba(248,248,255,0.7)',
            margin: 0,
            animation: 'fadeIn 0.5s ease both',
          }}
        >
          {statusText}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13,
            color: 'rgba(248,248,255,0.3)',
            marginTop: 8,
          }}
        >
          You&apos;ll be redirected automatically.
        </p>
      </div>
    </div>
  );
}
