import { useState } from 'react';
import type { GlamAnalysis } from '../types/analysis';

const GLAM_PROMPT = `You are ROOP AI Glam Coach, a professional makeup analysis AI specialised in Indian skin tones. Analyse this makeup selfie with expert precision. Return ONLY a raw JSON object — no markdown, no backticks, no preamble.

Score every product 0–100 where:
  0   = product is completely absent / not applied
  1–49  = applied but needs significant improvement
  50–74 = decent application
  75–100 = well applied and suits the person

Required JSON structure:
{
  "glamScore": <integer 0-100, weighted overall makeup score>,
  "scores": {
    "foundation": <0-100, coverage and shade match to skin tone>,
    "concealer": <0-100, under-eye and blemish coverage; 0 if absent>,
    "powder": <0-100, setting and finish; 0 if absent>,
    "blush": <0-100, placement and shade suitability; 0 if absent>,
    "highlighter": <0-100, glow and placement; 0 if absent>,
    "eyeshadow": <0-100, blending and colour choice; 0 if absent>,
    "eyeliner": <0-100, precision and style; 0 if absent>,
    "mascara": <0-100, volume and separation; 0 if absent>,
    "browProducts": <0-100, shape, fill and definition; 0 if absent>,
    "lipstick": <0-100, colour suitability and application; 0 if absent>,
    "gloss": <0-100, shine and hydration effect; 0 if absent>,
    "balm": <0-100, hydration and base; 0 if absent>,
    "overall": <0-100, cohesion, finish and harmony of the full look>
  },
  "currentLook": "<name of the look, e.g. Soft Glam, Bold Eye, Everyday Natural, No-Makeup Makeup>",
  "makeupStyle": "<natural|everyday|glam|bold|smokey|minimal>",
  "report": "<2-3 sentence friendly expert assessment of the makeup look — focus ONLY on makeup application, NOT on skin health>",
  "skinToneMatch": "<1 sentence on how well the makeup shades suit their Indian skin tone>",
  "missingElements": ["<product that is absent or underdone, e.g. 'Highlighter not applied'>", "<element 2>", "<element 3>"],
  "corrections": ["<specific makeup correction 1 — technique, blending, or placement>", "<correction 2>", "<correction 3>"],
  "products": [
    { "name": "<specific Indian-market product name>", "type": "<foundation|concealer|powder|blush|highlighter|contour|primer|setting spray|eyeshadow|eyeliner|mascara|brow|lipstick|gloss|balm>", "shade": "<shade suggestion for Indian skin tone if applicable>", "reason": "<why this product for this person's look>" },
    { "name": "<product>", "type": "<type>", "shade": "<shade>", "reason": "<reason>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" }
  ],
  "tutorialTip": "<1 specific technique tip based on what you observe in their current makeup>",
  "lookSuggestion": "<1 specific makeup look they should try next, suited to Indian features and skin tone>"
}`;

const SCORE_KEYS: Array<keyof import('../types/analysis').GlamScores> = [
  'foundation', 'concealer', 'powder', 'blush', 'highlighter',
  'eyeshadow', 'eyeliner', 'mascara', 'browProducts',
  'lipstick', 'gloss', 'balm', 'overall',
];

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
      max_tokens: 1200,
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

  // Round all scores to integers
  parsed.glamScore = Math.round(parsed.glamScore);
  for (const key of SCORE_KEYS) {
    parsed.scores[key] = Math.round(parsed.scores[key] ?? 0);
  }

  if (!Array.isArray(parsed.missingElements)) parsed.missingElements = [];
  if (!Array.isArray(parsed.products)) parsed.products = [];

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
