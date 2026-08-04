export type SkinType = "dry" | "oily" | "combination" | "normal";
export type OilinessLevel = "dry" | "normal" | "oily" | "combination";
export type MaskType = "acne" | "dry" | "dark_circles" | "dull" | "oily";
export type AppMode = "glow";
export type ConfidenceLevel = "high" | "medium" | "low";
export type SeverityLevel = "mild" | "moderate" | "severe";

// ── GLOW (skin health) ────────────────────────────────────────────────────
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

export interface DetectedCondition {
  name: string;
  confidence: ConfidenceLevel;
  description: string;
  severity: SeverityLevel;
  recommendation: string;
}

export interface DiseaseDetection {
  detected: boolean;
  conditions: DetectedCondition[];
  disclaimer: string;
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
  diseaseDetection: DiseaseDetection;
}

export interface HistoryEntry {
  id: string;
  date: string;
  score: number;
  imageUrl: string;
  analysis: SkinAnalysis;
}

// Deprecated - kept for legacy pages still being cleaned up
export type GlamHistoryEntry = any;
export type MakeupProduct = any;
export type GuideAnalysis = any;
export type BridalPlan = any;
