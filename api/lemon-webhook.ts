import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Use service role key server-side to bypass RLS
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify Lemon Squeezy webhook signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const signature = req.headers['x-signature'] as string;

  if (secret && signature) {
    const rawBody = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    if (hmac !== signature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const event = req.body as {
    meta: {
      event_name: string;
      custom_data?: { user_id?: string; plan?: string };
    };
    data: {
      attributes: {
        status: string;
        identifier: string;
        first_order_item?: { variant_id: number };
      };
    };
  };

  // Only handle successful orders
  if (event.meta.event_name !== 'order_created') {
    return res.status(200).json({ received: true });
  }

  if (event.data.attributes.status !== 'paid') {
    return res.status(200).json({ received: true });
  }

  const userId = event.meta.custom_data?.user_id;
  const plan   = event.meta.custom_data?.plan ?? 'monthly';

  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id in custom data' });
  }

  const expiryDays = plan === 'yearly' ? 365 : 30;
  const expiresAt  = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString();
  const paymentId  = event.data.attributes.identifier;

  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      [{ user_id: userId, plan, razorpay_payment_id: paymentId, expires_at: expiresAt }],
      { onConflict: 'user_id' },
    );

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Send welcome email
  const { data: userData } = await supabase.auth.admin.getUserById(userId);
  if (userData?.user?.email) {
    await fetch(`${process.env.VITE_SUPABASE_URL?.replace('supabase.co', 'vercel.app') ?? ''}/api/send-welcome-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.user.email,
        name: userData.user.user_metadata?.full_name,
        plan,
      }),
    }).catch(() => {}); // non-blocking
  }

  return res.status(200).json({ success: true });
}
