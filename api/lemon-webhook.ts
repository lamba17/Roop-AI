import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_LOGIN!,
    pass: process.env.BREVO_SMTP_KEY!,
  },
});

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

  // Send welcome email to user + admin notification
  const { data: userData } = await supabase.auth.admin.getUserById(userId);
  const userEmail = userData?.user?.email;
  const userName = userData?.user?.user_metadata?.full_name;
  const planLabel = plan === 'yearly' ? 'Yearly ($39.99/yr)' : 'Monthly ($4.99/mo)';

  if (userEmail) {
    // Welcome email to user
    fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, name: userName, plan }),
    }).catch(() => {});

    // Admin notification email
    transporter.sendMail({
      from: `"ROOP AI" <${process.env.GMAIL_FROM}>`,
      to: process.env.GMAIL_FROM,
      subject: `💰 New Premium Subscriber — ${userName || userEmail} (${planLabel})`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 480px; background: #080818; color: #e8e8f0; padding: 28px; border-radius: 14px;">
  <h2 style="color: #a855f7; margin: 0 0 20px;">New Premium Subscriber 💰</h2>
  <table style="width:100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e3a;">Name</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600; border-bottom: 1px solid #1e1e3a;">${userName || 'Unknown'}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e3a;">Email</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600; border-bottom: 1px solid #1e1e3a;">${userEmail}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e3a;">Plan</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: #a855f7; border-bottom: 1px solid #1e1e3a;">${planLabel}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px;">Payment ID</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600;">${paymentId}</td>
    </tr>
  </table>
</div>`,
    }).catch(() => {});
  }

  return res.status(200).json({ success: true });
}
