import { useState } from 'react';
import type { GuideAnalysis } from '../types/analysis';

const GUIDE_PROMPT = `You are ROOP AI Beauty Guide, a professional makeup tutorial creator. You are given TWO images:
- Image 1: A bare skin selfie (no makeup) — use this to understand their natural skin, tone, and features
- Image 2: A makeup selfie — use this to understand their current makeup style and skill level

Create a personalized step-by-step makeup tutorial tailored to their unique face and features. Return ONLY a raw JSON object — no markdown, no backticks, no preamble.

Required JSON structure:
{
  "title": "<personalized tutorial title e.g. Your Everyday Soft Glam Tutorial>",
  "lookCategory": "<e.g. Everyday Glam, Office Ready, Date Night, Natural Glow>",
  "totalTime": "<e.g. 15 minutes, 25 minutes>",
  "skinFoundationSummary": "<1 sentence about their natural skin from Image 1>",
  "makeupBaseSummary": "<1 sentence about their current makeup style from Image 2>",
  "steps": [
    { "step": 1, "title": "<step name>", "instruction": "<detailed instruction specific to their features>", "product": "<recommended product type>", "duration": "<e.g. 2 minutes>" },
    { "step": 2, "title": "<step name>", "instruction": "<instruction>", "product": "<product>", "duration": "<time>" },
    { "step": 3, "title": "<step name>", "instruction": "<instruction>", "product": "<product>", "duration": "<time>" },
    { "step": 4, "title": "<step name>", "instruction": "<instruction>", "product": "<product>", "duration": "<time>" },
    { "step": 5, "title": "<step name>", "instruction": "<instruction>", "product": "<product>", "duration": "<time>" },
    { "step": 6, "title": "<step name>", "instruction": "<instruction>", "product": "<product>", "duration": "<time>" },
    { "step": 7, "title": "<step name>", "instruction": "<instruction>", "product": "<product>", "duration": "<time>" }
  ],
  "proTips": ["<pro tip specific to their face shape or features>", "<tip 2>", "<tip 3>"],
  "avoidList": ["<thing to avoid based on their features>", "<avoid 2>", "<avoid 3>"],
  "products": [
    { "name": "<specific product>", "type": "<foundation|concealer|blush|eyeshadow|mascara|lipstick|highlighter|primer|setting spray|contour|eyeliner>", "reason": "<why for them>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" }
  ]
}`;

async function callGuideApi(skinBase64: string, makeupBase64: string): Promise<GuideAnalysis> {
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
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: skinBase64 } },
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: makeupBase64 } },
          { type: 'text', text: GUIDE_PROMPT },
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
  return JSON.parse(clean) as GuideAnalysis;
}

export function useGuideAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(skinBase64: string, makeupBase64: string) {
    setLoading(true);
    setError(null);
    try {
      return await callGuideApi(skinBase64, makeupBase64);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Guide analysis failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { analyze, loading, error };
}
