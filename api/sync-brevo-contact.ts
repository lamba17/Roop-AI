import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Syncs a user contact to Brevo's contact list.
 * Handles NULL/missing full_name by defaulting to email-based name.
 * Creates or updates the contact in Brevo.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, fullName, firstName, phone } = req.body as {
    email: string;
    fullName?: string | null;
    firstName?: string | null;
    phone?: string | null;
  };

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.warn('BREVO_API_KEY not configured, skipping contact sync');
    return res.status(200).json({ success: true, skipped: true });
  }

  // Default full_name handling
  let defaultedFullName = fullName?.trim();
  let defaultedFirstName = firstName?.trim();

  if (!defaultedFullName) {
    // Fall back to email prefix
    const emailPrefix = email.split('@')[0];
    defaultedFullName = emailPrefix.replace(/[._-]/g, ' ');
    defaultedFirstName = defaultedFullName.split(' ')[0] || 'User';
  }

  if (!defaultedFirstName) {
    defaultedFirstName = defaultedFullName.split(' ')[0] || 'User';
  }

  try {
    const contactPayload = {
      email: email.toLowerCase().trim(),
      attributes: {
        FIRSTNAME: defaultedFirstName,
        LASTNAME: defaultedFullName.split(' ').slice(1).join(' ') || 'User',
        FULLNAME: defaultedFullName,
      },
      ...(phone && { SMS: phone }),
      updateEnabled: true,
    };

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(contactPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.message || `HTTP ${response.status}`;

      // 409 means contact exists, which is fine — it will be updated due to updateEnabled: true
      if (response.status === 409) {
        return res.status(200).json({ success: true, action: 'updated', email });
      }

      console.error('Brevo API error:', errorMsg, errorData);
      return res.status(response.status).json({ error: `Brevo sync failed: ${errorMsg}` });
    }

    const result = await response.json();
    return res.status(200).json({
      success: true,
      action: result.id ? 'created' : 'updated',
      email,
      contactId: result.id,
    });
  } catch (err: any) {
    console.error('Brevo contact sync error:', err);
    return res.status(500).json({ error: err.message });
  }
}
