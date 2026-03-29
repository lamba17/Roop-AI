export const LS_PLANS = {
  monthly: {
    price: '$4.99',
    period: '/month',
    label: 'Monthly',
    expiryDays: 30,
  },
  yearly: {
    price: '$24.99',
    period: '/year',
    label: 'Yearly',
    expiryDays: 365,
    savings: 'Save $34.89',
  },
} as const;

export type LSPlanKey = keyof typeof LS_PLANS;

export function startLemonSqueezyCheckout(
  plan: LSPlanKey,
  userId: string,
  email: string,
  onError: (msg: string) => void,
): void {
  const variantId = plan === 'monthly'
    ? import.meta.env.VITE_LS_MONTHLY_VARIANT_ID as string
    : import.meta.env.VITE_LS_YEARLY_VARIANT_ID as string;

  const storeSlug = import.meta.env.VITE_LS_STORE_SLUG as string;

  if (!variantId || !storeSlug) {
    onError('Payment not configured. Please contact support.');
    return;
  }

  const successUrl = `${window.location.origin}/payment/success?provider=lemonsqueezy&plan=${plan}&userId=${userId}`;

  // Build Lemon Squeezy hosted checkout URL
  const url = new URL(`https://${storeSlug}.lemonsqueezy.com/buy/${variantId}`);
  url.searchParams.set('checkout[email]', email);
  url.searchParams.set('checkout[custom][user_id]', userId);
  url.searchParams.set('checkout[custom][plan]', plan);
  url.searchParams.set('checkout[success_url]', successUrl);

  window.location.href = url.toString();
}
