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

function buildWelcomeHTML(name: string, plan?: string) {
  const isPremium = !!plan;
  const planLabel = plan === 'yearly' ? 'Yearly Premium' : plan === 'monthly' ? 'Monthly Premium' : '';

  return `
<div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #080818; color: #e8e8f0; padding: 32px; border-radius: 16px;">

  <div style="text-align: center; margin-bottom: 28px;">
    <h1 style="font-size: 28px; margin: 0; color: #a855f7;">ROOP AI</h1>
    <p style="font-size: 13px; color: #888; margin: 4px 0 0;">Skin Coach</p>
  </div>

  <h2 style="font-size: 22px; color: #f8f8ff; margin: 0 0 12px;">
    ${isPremium ? `Welcome to Premium, ${name}! 🎉` : `Welcome to ROOP AI, ${name}! ✨`}
  </h2>

  <p style="font-size: 15px; color: #aaa; line-height: 1.6; margin: 0 0 20px;">
    ${isPremium
      ? `Your <strong style="color:#a855f7;">${planLabel}</strong> plan is now active. You have unlocked unlimited AI skin analyses, cloud selfie storage, before/after progress tracking, and full history.`
      : `Your account is ready. Upload a selfie and get your personalised Glow Score, skin report, daily routine, mask schedule, and dermatologist insights in seconds.`
    }
  </p>

  ${isPremium ? `
  <div style="background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #a855f7; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Premium Features Unlocked</p>
    <ul style="margin: 0; padding-left: 18px; color: #ccc; font-size: 14px; line-height: 2;">
      <li>Full detailed skin score breakdown</li>
      <li>Daily morning &amp; evening routine</li>
      <li>Product picks with Nykaa &amp; Amazon links</li>
      <li>Dermatologist finder (7 cities)</li>
      <li>Progress tracking &amp; analysis history</li>
      <li>PDF report export (coming soon)</li>
    </ul>
  </div>` : `
  <div style="background: rgba(168,85,247,0.05); border: 1px solid rgba(168,85,247,0.15); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
    <p style="margin: 0 0 8px; font-size: 13px; color: #a855f7; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">What you get for free</p>
    <ul style="margin: 0; padding-left: 18px; color: #ccc; font-size: 14px; line-height: 2;">
      <li>1 AI skin scan per day</li>
      <li>Glow Score (0–100) with animated ring</li>
      <li>Skin type identification</li>
      <li>2-line personalised skin summary</li>
    </ul>
  </div>`}

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://www.roopai.co.in" style="background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-size: 15px; font-weight: 600;">
      ${isPremium ? 'Start Your Analysis' : 'Analyse My Skin Now'}
    </a>
  </div>

  <div style="background: rgba(37,211,102,0.08); border: 1px solid rgba(37,211,102,0.25); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; text-align: center;">
    <p style="margin: 0 0 6px; font-size: 13px; color: #25D366; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">📱 Stay Connected on WhatsApp</p>
    <p style="margin: 0 0 14px; font-size: 13px; color: #aaa; line-height: 1.5;">Save our number for personalised skin tips, reminders &amp; exclusive offers — delivered straight to your WhatsApp.</p>
    <a href="https://wa.me/917567221085" style="background: #25D366; color: #fff; padding: 11px 28px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 600;">
      💬 Save on WhatsApp
    </a>
    <p style="margin: 10px 0 0; font-size: 11px; color: #555;">Once saved, send us a "Hi" and we'll send your first skin tip 🌿</p>
  </div>

  <p style="font-size: 12px; color: #555; text-align: center; margin-top: 28px;">
    Questions? Reply to this email or contact us at roopaiofficial58@gmail.com
  </p>

</div>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, plan } = req.body as {
    email: string;
    name?: string;
    plan?: string;
  };

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  const displayName = name || email.split('@')[0];
  const isPremium = !!plan;

  try {
    await transporter.sendMail({
      from: `"ROOP AI" <${process.env.GMAIL_FROM}>`,
      to: email,
      subject: isPremium
        ? `You're now a ROOP AI Premium member 🎉`
        : `Welcome to ROOP AI ✨ – Your skin coach is ready`,
      html: buildWelcomeHTML(displayName, plan),
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
