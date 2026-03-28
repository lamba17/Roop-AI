import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FeedbackRow {
  glow_score: number;
  skin_type: string;
  rating: number;
  accuracy_rating: number;
  comment: string | null;
}

export async function submitFeedback(feedback: FeedbackRow): Promise<void> {
  const { error } = await supabase.from('feedback').insert([feedback]);
  if (error) {
    throw new Error(error.message);
  }
}

/* ── Auth helpers ─────────────────────────────────────────────────────── */

export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

/* ── Storage ──────────────────────────────────────────────────────────── */

export async function uploadSelfie(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('selfies')
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('selfies').getPublicUrl(path);
  return data.publicUrl;
}

/* ── Analyses table ───────────────────────────────────────────────────── */

export interface AnalysisRow {
  user_id: string;
  glow_score: number;
  skin_type: string;
  concerns: string[];
  created_at?: string;
}

export async function saveAnalysis(row: AnalysisRow): Promise<void> {
  const { error } = await supabase.from('analyses').insert([row]);
  if (error) throw new Error(error.message);
}
