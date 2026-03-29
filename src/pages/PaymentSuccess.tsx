import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

type Status = 'activating' | 'success' | 'error';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('activating');

  useEffect(() => {
    const params  = new URLSearchParams(window.location.search);
    const plan    = params.get('plan') ?? 'monthly';

    // Activate premium immediately in localStorage
    const expiryDays = plan === 'yearly' ? 365 : 30;
    const expiresAt  = new Date(
      Date.now() + expiryDays * 24 * 60 * 60 * 1000
    ).toISOString();

    localStorage.setItem('roop_premium', 'true');
    localStorage.setItem('roop_premium_expires', expiresAt);

    // Small delay for UX feel
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => navigate('/'), 3000);
    }, 1200);
  }, [navigate]);

  return (
    <div
      className="mesh-bg"
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 20px', position: 'relative', overflow: 'hidden',
      }}
    >
      <div className="hero-glow" />

      <div
        className="glass-card"
        style={{
          width: '100%', maxWidth: 420, textAlign: 'center',
          position: 'relative', zIndex: 1,
          animation: 'fadeInUp 0.5s ease both',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Logo size="lg" />
        </div>

        {status === 'activating' && (
          <>
            <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3, display: 'block', margin: '0 auto 18px' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px', color: '#f8f8ff' }}>
              Activating Premium…
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.5)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
              Setting up your account.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, margin: '0 0 10px', color: '#f8f8ff' }}>
              Welcome to Premium!
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(248,248,255,0.6)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, margin: '0 0 10px' }}>
              Your account has been upgraded. Redirecting you now…
            </p>
            <p style={{ fontSize: 12, color: '#a855f7', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
              ✦ Unlimited analyses · Cloud storage · Before/After slider
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, margin: '0 0 10px', color: '#f8f8ff' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 13, color: '#f87171', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, margin: '0 0 20px' }}>
              Please contact support at info@roopai.co.in
            </p>
            <button onClick={() => navigate('/')} className="btn-glow" style={{ justifyContent: 'center', fontSize: 14, padding: '12px 28px' }}>
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
