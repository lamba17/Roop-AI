import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { openRazorpayCheckout, PLANS as INR_PLANS, type PlanKey, detectCurrency, type Currency } from '../lib/razorpay';
import { startLemonSqueezyCheckout, LS_PLANS } from '../lib/lemonsqueezy';

const FEATURES_FREE = [
  '3 analyses per day',
  'Glow Score + skin report',
  'Daily routine checklist',
  'Mask plan',
];

const FEATURES_PREMIUM = [
  'Unlimited analyses per day',
  'Selfies saved to cloud',
  'Before/After progress slider',
  'Full history (30 entries)',
  'PDF report export (coming soon)',
  'Priority support',
];

interface Props {
  user: User;
  onClose: () => void;
  onUpgraded: () => void;
}

export default function PremiumModal({ user, onClose, onUpgraded }: Props) {
  const [selected, setSelected] = useState<PlanKey>('yearly');
  const [currency, setCurrency] = useState<Currency>(detectCurrency);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pick plan list based on currency
  const plans = currency === 'INR' ? INR_PLANS : LS_PLANS;
  const currentPlan = plans[selected];

  async function handlePay() {
    setError(null);
    setLoading(true);

    if (currency === 'INR') {
      await openRazorpayCheckout(
        selected, 'INR',
        user.id, user.email ?? '',
        () => { setSuccess(true); setLoading(false); setTimeout(onUpgraded, 2000); },
        (msg) => { setError(msg); setLoading(false); },
      );
    } else {
      // Lemon Squeezy redirects to hosted checkout — loading stays true
      startLemonSqueezyCheckout(
        selected, user.id, user.email ?? '',
        (msg) => { setError(msg); setLoading(false); },
      );
    }

    setLoading(false);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: 'linear-gradient(145deg, #12122a, #1a1a35)',
          border: '1px solid rgba(168,85,247,0.3)',
          borderRadius: 24,
          padding: '32px 28px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(168,85,247,0.1)',
          animation: 'fadeInUp 0.3s ease both',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none',
            color: 'rgba(248,248,255,0.4)', fontSize: 22,
            cursor: 'pointer', lineHeight: 1, padding: '4px 8px',
            borderRadius: 8, transition: 'color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f8f8ff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,248,255,0.4)'; }}
        >
          ×
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, margin: '0 0 10px', color: '#f8f8ff' }}>
              Welcome to Premium!
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(248,248,255,0.6)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
              Your account has been upgraded. Enjoy unlimited analyses!
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ display: 'inline-block', fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#a855f7', marginBottom: 8 }}>
                Upgrade
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem,4vw,1.8rem)', fontWeight: 700, margin: '0 0 6px', color: '#f8f8ff', lineHeight: 1.2 }}>
                Unlock <span className="gradient-text">ROOP AI Premium</span>
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.5)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                Unlimited skin analyses + cloud storage
              </p>
            </div>

            {/* Currency toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
              <div style={{
                display: 'flex', gap: 0,
                background: 'rgba(13,13,31,0.6)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: 12, padding: 4,
              }}>
                {(['INR', 'USD'] as Currency[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    style={{
                      padding: '6px 18px', borderRadius: 9, border: 'none',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                      background: currency === c
                        ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                        : 'transparent',
                      color: currency === c ? '#fff' : 'rgba(248,248,255,0.4)',
                    }}
                  >
                    {c === 'INR' ? '🇮🇳  INR' : '🇺🇸  USD'}
                  </button>
                ))}
              </div>
            </div>

            {/* Gateway badge */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <span style={{
                fontSize: 10, fontFamily: "'DM Sans', sans-serif",
                color: 'rgba(248,248,255,0.3)', letterSpacing: 0.5,
              }}>
                {currency === 'INR'
                  ? 'Powered by Razorpay · UPI, Cards, Net Banking'
                  : 'Powered by Lemon Squeezy · Credit & Debit Cards'}
              </span>
            </div>

            {/* Plan toggle */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {(Object.keys(plans) as PlanKey[]).map(key => {
                const plan = plans[key];
                const isSelected = selected === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    style={{
                      flex: 1, padding: '14px 10px', borderRadius: 14,
                      border: isSelected ? '2px solid #a855f7' : '1px solid rgba(124,58,237,0.25)',
                      background: isSelected ? 'rgba(168,85,247,0.12)' : 'rgba(13,13,31,0.5)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      position: 'relative',
                      boxShadow: isSelected ? '0 0 20px rgba(168,85,247,0.15)' : 'none',
                    }}
                  >
                    {'savings' in plan && (
                      <span style={{
                        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg,#a855f7,#ec4899)',
                        color: '#fff', fontSize: 10, fontWeight: 700,
                        padding: '2px 10px', borderRadius: 20,
                        fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5,
                        whiteSpace: 'nowrap',
                      }}>
                        {(plan as any).savings}
                      </span>
                    )}
                    <div style={{ fontSize: 18, fontWeight: 800, color: isSelected ? '#a855f7' : '#f8f8ff', fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>
                      {plan.price}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>
                      {plan.label}{plan.period}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Features */}
            <div style={{ background: 'rgba(13,13,31,0.6)', borderRadius: 14, padding: '16px 18px', marginBottom: 20, border: '1px solid rgba(124,58,237,0.12)' }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: 'rgba(248,248,255,0.35)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Free</span>
                {FEATURES_FREE.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 13, color: 'rgba(248,248,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ color: 'rgba(248,248,255,0.2)', fontSize: 14 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(168,85,247,0.15)', paddingTop: 10 }}>
                <span style={{ fontSize: 11, color: '#a855f7', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Premium</span>
                {FEATURES_PREMIUM.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 13, color: '#f8f8ff', fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ color: '#a855f7', fontSize: 14 }}>✦</span> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)' }}>
                <p style={{ margin: 0, fontSize: 12, color: '#f87171', fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-glow"
              style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '15px', opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    {currency === 'USD' ? ' Redirecting to checkout…' : ' Processing…'}</>
                : <>✨ Pay {currentPlan.price} &amp; Unlock Premium</>
              }
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(248,248,255,0.25)', marginTop: 12, marginBottom: 0, fontFamily: "'DM Sans', sans-serif" }}>
              🔒 Payments are secure and encrypted
            </p>
          </>
        )}
      </div>
    </div>
  );
}
