import { createClient } from '@supabase/supabase-js';

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
