import { saveSubscription } from './supabase';

export type Currency = 'INR' | 'USD';

export const PLANS = {
  trial: {
    amount: 2500,           // ₹25 in paise
    label: 'First Week',
    price: '₹25',
    period: '/week',
    expiryDays: 7,
    description: 'ROOP AI Premium – 7-Day Trial',
    billingNote: 'First week',
    tagline: 'Try it',
    perDay: null,
  },
  monthly: {
    amount: 4900,           // ₹49 in paise
    label: 'Monthly',
    price: '₹49',
    period: '/month',
    expiryDays: 30,
    description: 'ROOP AI Premium – Monthly',
    billingNote: 'Billed monthly',
    tagline: 'Stay consistent',
    perDay: '₹4.90/day',
  },
  yearly: {
    amount: 39900,          // ₹399 in paise
    label: 'Yearly',
    price: '₹399',
    period: '/year',
    expiryDays: 365,
    description: 'ROOP AI Premium – Yearly',
    billingNote: 'Billed once',
    tagline: 'Best value ✨',
    perDay: '₹1.09/day',
    savings: 'Save ₹189',
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/* Detect currency based on user's timezone */
export function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')
      ? 'INR'
      : 'USD';
  } catch {
    return 'INR';
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(
  plan: PlanKey,
  currency: Currency,
  userId: string,
  userEmail: string,
  onSuccess: () => void,
  onError: (msg: string) => void,
): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) { onError('Failed to load payment gateway. Please try again.'); return; }

  const key = import.meta.env.VITE_RAZORPAY_KEY_ID as string;
  if (!key) { onError('Payment not configured. Contact support.'); return; }

  const selectedPlan = PLANS[plan];
  const expiresAt = new Date(
    Date.now() + selectedPlan.expiryDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const options = {
    key,
    amount: selectedPlan.amount,
    currency,
    name: 'ROOP AI',
    description: selectedPlan.description,
    image: '/favicon.svg',
    prefill: { email: userEmail },
    theme: { color: '#a855f7' },
    modal: { backdropclose: false },
    handler: async (response: { razorpay_payment_id: string }) => {
      try {
        await saveSubscription({
          user_id: userId,
          plan,
          razorpay_payment_id: response.razorpay_payment_id,
          expires_at: expiresAt,
        });
        localStorage.setItem('roop_premium', 'true');
        localStorage.setItem('roop_premium_expires', expiresAt);
        // Send welcome email (non-blocking)
        fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, plan }),
        }).catch(() => {});
        // Admin notification (non-blocking)
        fetch('/api/notify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            plan,
            paymentId: response.razorpay_payment_id,
            gateway: 'Razorpay',
          }),
        }).catch(() => {});
        onSuccess();
      } catch {
        onError('Payment received but activation failed. Contact support with payment ID: ' + response.razorpay_payment_id);
      }
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.on('payment.failed', () => onError('Payment failed. Please try again.'));
  rzp.open();
}
