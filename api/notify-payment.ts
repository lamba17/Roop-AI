import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_LOGIN!,
    pass: process.env.BREVO_SMTP_KEY!,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, plan, paymentId, gateway } = req.body as {
    email: string;
    plan: string;
    paymentId: string;
    gateway: string;
  };

  if (!email) return res.status(400).json({ error: 'Missing email' });

  const planLabel =
    plan === 'trial'   ? 'First Week Trial (₹25)' :
    plan === 'monthly' ? 'Monthly (₹49/mo)' :
    plan === 'yearly'  ? 'Yearly (₹399/yr)' :
    plan;

  try {
    await transporter.sendMail({
      from: `"ROOP AI" <${process.env.GMAIL_FROM}>`,
      to: process.env.GMAIL_FROM,
      subject: `💰 New Premium Subscriber — ${email} (${planLabel})`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 480px; background: #080818; color: #e8e8f0; padding: 28px; border-radius: 14px;">
  <h2 style="color: #a855f7; margin: 0 0 20px;">New Premium Subscriber 💰</h2>
  <table style="width:100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e3a;">Email</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600; border-bottom: 1px solid #1e1e3a;">${email}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e3a;">Plan</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: #a855f7; border-bottom: 1px solid #1e1e3a;">${planLabel}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px; border-bottom: 1px solid #1e1e3a;">Gateway</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600; border-bottom: 1px solid #1e1e3a;">${gateway}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #888; font-size: 13px;">Payment ID</td>
      <td style="padding: 10px 0; font-size: 14px; font-weight: 600;">${paymentId}</td>
    </tr>
  </table>
</div>`,
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
