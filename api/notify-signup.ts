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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify this is from Supabase using a shared secret
  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { record } = req.body as {
    record: {
      id: string;
      email: string;
      created_at: string;
      raw_user_meta_data?: { full_name?: string; avatar_url?: string };
    };
  };

  const email = record?.email ?? 'Unknown';
  const name = record?.raw_user_meta_data?.full_name ?? 'Unknown';
  const signupTime = new Date(record?.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  try {
    await transporter.sendMail({
      from: `"ROOP AI" <${process.env.GMAIL_FROM}>`,
      to: process.env.GMAIL_FROM, // notify yourself
      subject: `🎉 New user signed up on ROOP AI — ${email}`,
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

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
