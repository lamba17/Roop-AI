import { saveSubscription } from './supabase';

export const PLANS = {
  monthly: {
    amount: 9900,           // ₹99 in paise
    label: 'Monthly',
    price: '₹99',
    period: '/month',
    expiryDays: 30,
    description: 'ROOP AI Premium – Monthly',
  },
  yearly: {
    amount: 79900,          // ₹799 in paise
    label: 'Yearly',
    price: '₹799',
    period: '/year',
    expiryDays: 365,
    description: 'ROOP AI Premium – Yearly',
    savings: 'Save ₹389',
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/* Load Razorpay script once */
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
    currency: 'INR',
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
