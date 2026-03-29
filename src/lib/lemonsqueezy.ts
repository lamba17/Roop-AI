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
  // Lemon Squeezy uses a UUID-based checkout URL: /checkout/buy/{uuid}
  const checkoutUuid = plan === 'monthly'
    ? import.meta.env.VITE_LS_MONTHLY_UUID as string
    : import.meta.env.VITE_LS_YEARLY_UUID as string;

  if (!checkoutUuid) {
    onError('Payment not configured. Please contact support.');
    return;
  }

  const successUrl = `${window.location.origin}/payment/success?provider=lemonsqueezy&plan=${plan}&userId=${userId}`;

  // Build Lemon Squeezy hosted checkout URL using UUID format
  const url = new URL(`https://roop-ai.lemonsqueezy.com/checkout/buy/${checkoutUuid}`);
  url.searchParams.set('checkout[email]', email);
  url.searchParams.set('checkout[custom][user_id]', userId);
  url.searchParams.set('checkout[custom][plan]', plan);
  url.searchParams.set('checkout[success_url]', successUrl);

  window.location.href = url.toString();
}
