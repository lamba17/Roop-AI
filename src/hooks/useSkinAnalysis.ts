import { useState } from 'react';
import type { SkinAnalysis } from '../types/analysis';

async function callApi(base64: string, lang = 'en'): Promise<SkinAnalysis> {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.roopai.co.in';

  const response = await fetch(`${baseUrl}/api/analyze-skin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ base64, lang }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const errorMsg = (err as { error?: string }).error ?? '';

    if (response.status === 429) {
      throw new Error('Too many requests. Please wait a few seconds and try again.');
    }
    if (response.status === 503) {
      throw new Error(errorMsg || 'Analysis service is temporarily unavailable.');
    }
    throw new Error(errorMsg || 'Analysis failed. Please try again.');
  }

  const parsed = await response.json() as SkinAnalysis;

  if (typeof parsed.glowScore !== 'number' || parsed.glowScore < 0 || parsed.glowScore > 100) {
    throw new Error('Invalid score returned from analysis.');
  }

  return parsed;
}

export function useSkinAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SkinAnalysis | null>(null);

  async function analyze(base64: string, lang = 'en') {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await callApi(base64, lang);
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
