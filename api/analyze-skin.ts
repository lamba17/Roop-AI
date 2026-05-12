import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { SkinAnalysis } from '../src/types/analysis';

const SKIN_ANALYSIS_PROMPT_EN = `You are ROOP AI, a professional AI skin analysis coach. Analyze this selfie with clinical precision. Return ONLY a raw JSON object — no markdown, no backticks, no preamble.

Required JSON structure:
{
  "glowScore": <integer 0-100>,
  "scores": {
    "acne": <integer 0-100, higher = better acne control>,
    "skinTone": <integer 0-100, higher = more even tone>,
    "texture": <integer 0-100, higher = smoother texture>,
    "darkCircles": <integer 0-100, higher = less visible circles>,
    "hair": <integer 0-100, higher = healthier hairline/beard>
  },
  "skinType": "<dry|oily|combination|normal>",
  "oiliness": "<dry|normal|oily|combination>",
  "concerns": ["<specific concern 1>", "<specific concern 2>", "<specific concern 3>"],
  "report": "<2-3 sentence friendly, specific skin report based on actual visible observations>",
  "dailyRoutine": {
    "morning": ["<step with specific product type>", "<step>", "<step>"],
    "evening": ["<step>", "<step>", "<step>"]
  },
  "products": [
    { "name": "<specific product name>", "type": "<cleanser|serum|moisturizer|sunscreen|toner|eye cream>", "reason": "<why this specific product for this person>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" }
  ],
  "maskType": "<acne|dry|dark_circles|dull|oily> — choose based on primary concern",
  "groomingTip": "<1 sentence specific hairline/beard/grooming observation and tip>",
  "doctorAdvice": "<specific, actionable advice on when/why to visit a dermatologist based on what you observed>"
}`;

const SKIN_ANALYSIS_PROMPT_HI = `आप ROOP AI हैं, एक पेशेवर AI त्वचा विश्लेषण कोच। इस सेल्फी का नैदानिक सटीकता के साथ विश्लेषण करें। केवल एक raw JSON object लौटाएं — कोई markdown, backticks या प्रस्तावना नहीं।

आवश्यक JSON संरचना:
{
  "glowScore": <0-100 के बीच पूर्णांक>,
  "scores": {
    "acne": <0-100, अधिक = बेहतर मुंहासे नियंत्रण>,
    "skinTone": <0-100, अधिक = अधिक समान रंग>,
    "texture": <0-100, अधिक = चिकनी बनावट>,
    "darkCircles": <0-100, अधिक = कम दिखने वाले काले घेरे>,
    "hair": <0-100, अधिक = स्वस्थ हेयरलाइन/दाढ़ी>
  },
  "skinType": "<dry|oily|combination|normal>",
  "oiliness": "<dry|normal|oily|combination>",
  "concerns": ["<विशिष्ट समस्या 1>", "<विशिष्ट समस्या 2>", "<विशिष्ट समस्या 3>"],
  "report": "<2-3 वाक्य में मैत्रीपूर्ण, विशिष्ट त्वचा रिपोर्ट वास्तविक दृश्य अवलोकन पर आधारित>",
  "dailyRoutine": {
    "morning": ["<विशिष्ट उत्पाद प्रकार के साथ चरण>", "<चरण>", "<चरण>"],
    "evening": ["<चरण>", "<चरण>", "<चरण>"]
  },
  "products": [
    { "name": "<विशिष्ट उत्पाद नाम>", "type": "<cleanser|serum|moisturizer|sunscreen|toner|eye cream>", "reason": "<इस व्यक्ति के लिए यह उत्पाद क्यों>" },
    { "name": "<उत्पाद>", "type": "<प्रकार>", "reason": "<कारण>" },
    { "name": "<उत्पाद>", "type": "<प्रकार>", "reason": "<कारण>" }
  ],
  "maskType": "<acne|dry|dark_circles|dull|oily> — प्राथमिक समस्या के आधार पर चुनें",
  "groomingTip": "<1 वाक्य में हेयरलाइन/दाढ़ी/ग्रूमिंग अवलोकन और सुझाव>",
  "doctorAdvice": "<डर्मेटोलॉजिस्ट से कब और क्यों मिलें, इस पर विशिष्ट, कार्रवाई योग्य सलाह>"
}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { base64, lang = 'en' } = req.body as { base64: string; lang?: string };

  if (!base64) {
    return res.status(400).json({ error: 'Missing base64 image' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[analyze-skin] ANTHROPIC_API_KEY not configured');
    return res.status(500).json({ error: 'Analysis service unavailable' });
  }

  const prompt = lang === 'hi' ? SKIN_ANALYSIS_PROMPT_HI : SKIN_ANALYSIS_PROMPT_EN;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
            { type: 'text', text: prompt },
          ],
        }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const apiMsg = (err as any).error?.message ?? '';
      console.error('[analyze-skin] API error:', response.status, apiMsg);

      if (response.status === 529 || apiMsg.toLowerCase().includes('overload')) {
        return res.status(503).json({ error: 'Our analysis servers are busy right now. Please wait a moment and try again.' });
      }
      if (response.status === 401 || apiMsg.toLowerCase().includes('credit') || apiMsg.toLowerCase().includes('balance') || apiMsg.toLowerCase().includes('billing')) {
        return res.status(503).json({ error: 'Analysis service is temporarily unavailable. Please try again later or contact support.' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'Too many requests. Please wait a few seconds and try again.' });
      }
      return res.status(500).json({ error: 'Analysis failed. Please try again.' });
    }

    const data = await response.json() as { content?: Array<{ type: string; text?: string }> };
    const text = data.content?.find(b => b.type === 'text')?.text ?? '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean) as SkinAnalysis;

    if (typeof parsed.glowScore !== 'number' || parsed.glowScore < 0 || parsed.glowScore > 100) {
      throw new Error('Invalid score returned from analysis.');
    }

    parsed.glowScore = Math.round(parsed.glowScore);
    parsed.scores.acne = Math.round(parsed.scores.acne);
    parsed.scores.skinTone = Math.round(parsed.scores.skinTone);
    parsed.scores.texture = Math.round(parsed.scores.texture);
    parsed.scores.darkCircles = Math.round(parsed.scores.darkCircles);
    parsed.scores.hair = Math.round(parsed.scores.hair);

    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('[analyze-skin] Error:', err);
    return res.status(500).json({ error: err.message || 'Analysis failed. Please try again.' });
  }
}
