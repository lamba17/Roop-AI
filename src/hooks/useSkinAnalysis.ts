import { useState } from 'react';
import type { SkinAnalysis } from '../types/analysis';

const SKIN_ANALYSIS_PROMPT = `You are ROOP AI, a professional AI skin analysis coach. Analyze this selfie with clinical precision. Return ONLY a raw JSON object — no markdown, no backticks, no preamble.

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

async function callApi(base64: string): Promise<SkinAnalysis> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY as string,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
          { type: 'text', text: SKIN_ANALYSIS_PROMPT },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? 'API error');
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

  return parsed;
}

export function useSkinAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SkinAnalysis | null>(null);

  async function analyze(base64: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await callApi(base64);
      setResult(analysis);
      return analysis;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Analysis failed. Please try again.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { analyze, loading, error, result };
}
