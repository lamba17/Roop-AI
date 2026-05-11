import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_LOGIN!,       // a68786001@smtp-brevo.com
    pass: process.env.BREVO_SMTP_KEY!,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[notify-signup] Request received', {
    method: req.method,
    headers: req.headers,
    bodyKeys: req.body ? Object.keys(req.body) : 'no body',
  });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-webhook-secret');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify this is from Supabase using a shared secret
  const secret = req.headers['x-webhook-secret'];
  console.log('[notify-signup] Secret check', { received: secret, expected: process.env.SUPABASE_WEBHOOK_SECRET });
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    console.error('[notify-signup] Unauthorized: secret mismatch');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { record } = req.body as {
    record: {
      id: string;
      email: string;
      created_at: string;
      raw_user_meta_data?: {
        full_name?: string;
        name?: string;
        first_name?: string;
        phone?: string;
        avatar_url?: string;
      };
    };
  };

  const email = record?.email ?? 'Unknown';
  const fullName = record?.raw_user_meta_data?.full_name ?? record?.raw_user_meta_data?.name;
  const firstName = record?.raw_user_meta_data?.first_name;
  const phone = record?.raw_user_meta_data?.phone;
  const name = fullName ?? 'User';
  const signupTime = new Date(record?.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  try {
    // ── Sync to Brevo contacts list ──────────────────────────────────────
    if (email && email !== 'Unknown') {
      const baseUrl = 'https://www.roopai.co.in';
      fetch(`${baseUrl}/api/sync-brevo-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName: fullName || undefined,
          firstName: firstName || undefined,
          phone: phone || undefined,
        }),
      }).catch(err => console.error('Brevo sync error:', err));
    }

    // ── Welcome email to the new user ────────────────────────────────────
    if (email && email !== 'Unknown') {
      const baseUrl = 'https://www.roopai.co.in';
      fetch(`${baseUrl}/api/send-welcome-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: fullName || undefined }),
      }).catch(() => {});
    }

    // ── Admin notification ────────────────────────────────────────────────
    console.log('[notify-signup] Sending admin notification email', { email, name, to: process.env.GMAIL_FROM });
    await transporter.sendMail({
      from: `"ROOP AI" <${process.env.GMAIL_FROM}>`,
      to: process.env.GMAIL_FROM, // notify yourself
      subject: `🎉 New user signed up on ROOP AI — ${name !== 'Unknown' ? name : email}`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 480px; background: #080818; color: #e8e8f0; padding: 28px; border-radius: 14px;">
  <h2 style="color: #a855f7; margin: 0 0 20px;">New Sign Up on ROOP AI 🎉</h2>
  <table style="width:100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e3a;">Name</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600; border-bottom: 1px solid #1e1e3a;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e3a;">Email</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600; border-bottom: 1px solid #1e1e3a;">${email}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px;">Signed Up At</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600;">${signupTime} IST</td>
    </tr>
  </table>
  <p style="margin-top: 20px; font-size: 12px; color: #555;">
    View all users in your <a href="https://supabase.com/dashboard" style="color: #a855f7;">Supabase Dashboard</a>
  </p>
</div>`,
    });

    console.log('[notify-signup] Email sent successfully for', email);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('[notify-signup] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
