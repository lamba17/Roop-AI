import { useState } from 'react';
import type { GlamAnalysis } from '../types/analysis';

const GLAM_PROMPT = `You are ROOP AI Glam Coach, a professional makeup analysis AI. Analyze this makeup selfie with expert precision. Return ONLY a raw JSON object — no markdown, no backticks, no preamble.

Required JSON structure:
{
  "glamScore": <integer 0-100, overall makeup score>,
  "scores": {
    "foundationMatch": <integer 0-100, how well foundation matches skin tone>,
    "eyeMakeup": <integer 0-100, eye makeup skill and blending>,
    "lipColor": <integer 0-100, lip color suitability for their features>,
    "blushContour": <integer 0-100, blush and contour placement>,
    "overall": <integer 0-100, overall look cohesion and finish>
  },
  "currentLook": "<name of the look they are wearing, e.g. Soft Glam, Bold Eye, Everyday Natural>",
  "makeupStyle": "<natural|everyday|glam|bold|smokey|minimal>",
  "report": "<2-3 sentence friendly expert assessment of their current makeup — focus ONLY on makeup application, NOT on skin health>",
  "skinToneMatch": "<1 sentence on how well the makeup shades suit their skin tone>",
  "missingElements": ["<makeup element that is absent or underdone, e.g. 'No highlighter applied'>, "<element 2>", "<element 3>"],
  "corrections": ["<specific makeup correction 1 — technique, blending, or placement>", "<correction 2>", "<correction 3>"],
  "products": [
    { "name": "<specific product name>", "type": "<foundation|concealer|blush|eyeshadow|mascara|lipstick|highlighter|primer|setting spray|contour|eyeliner>", "shade": "<shade suggestion if applicable>", "reason": "<why this product for their look>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" }
  ],
  "tutorialTip": "<1 specific technique tip based on what you observe in their current makeup>",
  "lookSuggestion": "<1 specific makeup look they should try next based on their features>"
}`;

async function callGlamApi(base64: string): Promise<GlamAnalysis> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY as string,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
          { type: 'text', text: GLAM_PROMPT },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const apiMsg = (err as { error?: { message?: string } }).error?.message ?? '';
    if (response.status === 529 || apiMsg.toLowerCase().includes('overload')) {
      throw new Error('Servers are busy. Please wait a moment and try again.');
    }
    throw new Error(apiMsg || 'API error');
  }

  const data = await response.json() as { content?: Array<{ type: string; text?: string }> };
  const text = data.content?.find(b => b.type === 'text')?.text ?? '';
  const clean = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean) as GlamAnalysis;

  parsed.glamScore = Math.round(parsed.glamScore);
  parsed.scores.foundationMatch = Math.round(parsed.scores.foundationMatch);
  parsed.scores.eyeMakeup = Math.round(parsed.scores.eyeMakeup);
  parsed.scores.lipColor = Math.round(parsed.scores.lipColor);
  parsed.scores.blushContour = Math.round(parsed.scores.blushContour);
  parsed.scores.overall = Math.round(parsed.scores.overall);

  if (!Array.isArray(parsed.missingElements)) parsed.missingElements = [];

  return parsed;
}

export function useGlamAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(base64: string) {
    setLoading(true);
    setError(null);
    try {
      return await callGlamApi(base64);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Glam analysis failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { analyze, loading, error };
}
