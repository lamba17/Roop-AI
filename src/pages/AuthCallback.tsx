import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState('Signing you in…');

  useEffect(() => {
    async function handleCallback() {
      try {
        // Exchange the auth code in the URL for a session
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          // If no code in URL, the session may already be established via onAuthStateChange
          // (magic link / implicit flow) — just proceed
          if (!error.message.includes('Code challenge')) {
            setStatusText('Finalising your account…');
          }
        }
        // Small delay so the session can propagate before redirect
        setTimeout(() => navigate('/', { replace: true }), 800);
      } catch {
        // Fallback: session was set by the Supabase client listener already
        setTimeout(() => navigate('/', { replace: true }), 1000);
      }
    }

    handleCallback();
  }, [navigate]);

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

        <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3, display: 'block', margin: '0 auto 18px' }} />

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
