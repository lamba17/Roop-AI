export type SkinType = "dry" | "oily" | "combination" | "normal";
export type OilinessLevel = "dry" | "normal" | "oily" | "combination";
export type MaskType = "acne" | "dry" | "dark_circles" | "dull" | "oily";

export interface GlowScores {
  acne: number;
  skinTone: number;
  texture: number;
  darkCircles: number;
  hair: number;
}

export interface ProductRecommendation {
  name: string;
  type: "cleanser" | "serum" | "moisturizer" | "sunscreen" | "toner" | "eye cream";
  reason: string;
}

export interface DailyRoutine {
  morning: string[];
  evening: string[];
}

export interface SkinAnalysis {
  glowScore: number;
  scores: GlowScores;
  skinType: SkinType;
  oiliness: OilinessLevel;
  concerns: string[];
  report: string;
  dailyRoutine: DailyRoutine;
  products: ProductRecommendation[];
  maskType: MaskType;
  groomingTip: string;
  doctorAdvice: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  score: number;
  imageUrl: string;
  analysis: SkinAnalysis;
}
