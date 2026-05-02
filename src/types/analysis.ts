export type SkinType = "dry" | "oily" | "combination" | "normal";
export type OilinessLevel = "dry" | "normal" | "oily" | "combination";
export type MaskType = "acne" | "dry" | "dark_circles" | "dull" | "oily";
export type MakeupStyle = "natural" | "everyday" | "glam" | "bold" | "smokey" | "minimal";
export type AppMode = "glow" | "glam" | "guide" | "bridal";

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

// ── GLAM (makeup coaching) ────────────────────────────────────────────────
export interface GlamScores {
  // Face
  foundation: number;
  concealer: number;
  powder: number;
  blush: number;
  highlighter: number;
  // Eyes
  eyeshadow: number;
  eyeliner: number;
  mascara: number;
  browProducts: number;
  // Lips
  lipstick: number;
  gloss: number;
  balm: number;
  // Overall
  overall: number;
}

export interface MakeupProduct {
  name: string;
  type: "foundation" | "concealer" | "powder" | "blush" | "highlighter" | "contour" | "primer" | "setting spray" | "eyeshadow" | "eyeliner" | "mascara" | "brow" | "lipstick" | "gloss" | "balm";
  shade?: string;
  reason: string;
}

export interface GlamAnalysis {
  glamScore: number;
  scores: GlamScores;
  currentLook: string;
  makeupStyle: MakeupStyle;
  report: string;
  skinToneMatch: string;
  missingElements: string[];
  corrections: string[];
  products: MakeupProduct[];
  tutorialTip: string;
  lookSuggestion: string;
  // Skin tone detection for foundation shade matching
  depthScore: number;    // 1-10: 1-2=Fair, 3-4=Light, 5-6=Wheatish, 7-8=Medium Brown, 9-10=Deep
  undertone: 'warm' | 'cool' | 'neutral';
}

// ── GUIDE (personalized tutorial) ────────────────────────────────────────
export interface GuideStep {
  step: number;
  title: string;
  instruction: string;
  product?: string;
  duration?: string;
}

export interface GuideAnalysis {
  title: string;
  lookCategory: string;
  totalTime: string;
  skinFoundationSummary: string;
  makeupBaseSummary: string;
  steps: GuideStep[];
  proTips: string[];
  avoidList: string[];
  products: MakeupProduct[];
}

// ── BRIDAL (90-day plan) ──────────────────────────────────────────────────
export interface BridalPhase {
  weekRange: string;
  phase: string;
  skinGoal: string;
  makeupFocus: string;
  treatments: string[];
  keyProducts: string[];
}

export interface GlamHistoryEntry {
  id: string;
  date: string;
  score: number;
  imageUrl: string;
  analysis: GlamAnalysis;
}

export interface BridalPlan {
  weddingLook: string;
  skinReadinessScore: number;
  makeupCompatibilityScore: number;
  urgentConcerns: string[];
  phases: BridalPhase[];
  bridalProducts: MakeupProduct[];
  skinTreatments: string[];
  weddingDayTips: string[];
  preWeddingRoutine: string;
}
