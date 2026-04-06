import { useState } from 'react';
import type { BridalPlan } from '../types/analysis';

const BRIDAL_PROMPT = `You are ROOP AI Bridal Coach, a professional bridal beauty planner. You are given TWO images:
- Image 1: A bare skin selfie (no makeup) — analyze their skin condition, tone, and needs
- Image 2: A makeup selfie — analyze their current makeup skill level and style preference

Create a comprehensive personalized 90-day bridal beauty plan. Return ONLY a raw JSON object — no markdown, no backticks, no preamble.

Required JSON structure:
{
  "weddingLook": "<recommended bridal look e.g. Classic Dewy Glam, Soft Romantic, Bold South Asian Bridal>",
  "skinReadinessScore": <integer 0-100, how ready their skin is for wedding day>,
  "makeupCompatibilityScore": <integer 0-100, how compatible their current style is with bridal looks>,
  "urgentConcerns": ["<urgent skin or makeup concern if any — leave empty array if none>"],
  "phases": [
    {
      "weekRange": "Week 1-4",
      "phase": "Skin Reset",
      "skinGoal": "<specific skin goal for this phase>",
      "makeupFocus": "<makeup skill to practice this phase>",
      "treatments": ["<treatment 1>", "<treatment 2>"],
      "keyProducts": ["<product 1>", "<product 2>"]
    },
    {
      "weekRange": "Week 5-9",
      "phase": "Glow Build",
      "skinGoal": "<skin goal>",
      "makeupFocus": "<makeup focus>",
      "treatments": ["<treatment 1>", "<treatment 2>"],
      "keyProducts": ["<product 1>", "<product 2>"]
    },
    {
      "weekRange": "Week 10-13",
      "phase": "Wedding Ready",
      "skinGoal": "<skin goal>",
      "makeupFocus": "<makeup focus>",
      "treatments": ["<treatment 1>", "<treatment 2>"],
      "keyProducts": ["<product 1>", "<product 2>"]
    }
  ],
  "bridalProducts": [
    { "name": "<product>", "type": "<foundation|concealer|blush|eyeshadow|mascara|lipstick|highlighter|primer|setting spray|contour|eyeliner>", "reason": "<why for their bridal look>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" },
    { "name": "<product>", "type": "<type>", "reason": "<reason>" }
  ],
  "skinTreatments": ["<professional treatment recommendation 1>", "<treatment 2>", "<treatment 3>"],
  "weddingDayTips": ["<wedding day tip 1>", "<tip 2>", "<tip 3>"],
  "preWeddingRoutine": "<1-2 sentences describing their ideal morning-of routine on wedding day>"
}`;

async function callBridalApi(skinBase64: string, makeupBase64: string): Promise<BridalPlan> {
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
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: skinBase64 } },
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: makeupBase64 } },
          { type: 'text', text: BRIDAL_PROMPT },
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
  const parsed = JSON.parse(clean) as BridalPlan;
  parsed.skinReadinessScore = Math.round(parsed.skinReadinessScore);
  parsed.makeupCompatibilityScore = Math.round(parsed.makeupCompatibilityScore);
  return parsed;
}

export function useBridalPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(skinBase64: string, makeupBase64: string) {
    setLoading(true);
    setError(null);
    try {
      return await callBridalApi(skinBase64, makeupBase64);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bridal plan failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { analyze, loading, error };
}
