import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HistoryEntry, GlamHistoryEntry } from '../types/analysis';
import AppLayout from '../components/AppLayout';
import { useLanguage } from '../context/LanguageContext';
import { T } from '../data/translations';

/* ── Price range buckets ─────────────────────────────────────────────── */
type PriceRange = 'all' | 'under500' | '500to1000' | '1000to2000' | 'above2000';
const PRICE_RANGES: { key: PriceRange; label: string; min: number; max: number }[] = [
  { key: 'all',        label: 'All Prices',   min: 0,    max: Infinity },
  { key: 'under500',   label: 'Under ₹500',   min: 0,    max: 499 },
  { key: '500to1000',  label: '₹500–₹1,000',  min: 500,  max: 1000 },
  { key: '1000to2000', label: '₹1,000–₹2,000',min: 1001, max: 2000 },
  { key: 'above2000',  label: 'Above ₹2,000', min: 2001, max: Infinity },
];

/* ── Static skin product catalogue ──────────────────────────────────── */
interface StaticProduct {
  name: string;
  brand: string;
  type: string;
  price: number;      // actual mid-price for filtering
  priceLabel: string;
  reason: string;
  rating: number;
}

const STATIC_SKIN_PRODUCTS: StaticProduct[] = [
  // Cleansers
  { name: 'Mamaearth Ubtan Face Wash', brand: 'Mamaearth', type: 'cleanser', price: 299, priceLabel: '₹299', reason: 'Turmeric & saffron gently cleanse while brightening dull skin.', rating: 4.5 },
  { name: 'Dot & Key Pore Clarifying Facewash', brand: 'Dot & Key', type: 'cleanser', price: 395, priceLabel: '₹395', reason: 'BHA-powered cleanser clears pores and controls oil without stripping.', rating: 4.4 },
  { name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil', type: 'cleanser', price: 549, priceLabel: '₹549', reason: 'Dermatologist-recommended, soap-free formula for sensitive skin.', rating: 4.7 },
  { name: 'Plum Green Tea Pore Cleansing Face Wash', brand: 'Plum', type: 'cleanser', price: 399, priceLabel: '₹399', reason: 'Green tea antioxidants minimize pores and balance oily skin.', rating: 4.4 },
  { name: 'The Derma Co 1% Salicylic Acid Facewash', brand: 'The Derma Co', type: 'cleanser', price: 359, priceLabel: '₹359', reason: 'Salicylic acid exfoliates inside pores, reducing acne and blackheads.', rating: 4.3 },
  { name: 'Simple Kind to Skin Moisturising Cleanser', brand: 'Simple', type: 'cleanser', price: 349, priceLabel: '₹349', reason: 'No perfume or dyes — perfect for sensitive or reactive skin.', rating: 4.2 },

  // Serums
  { name: 'Mamaearth Vitamin C Daily Glow Serum', brand: 'Mamaearth', type: 'serum', price: 599, priceLabel: '₹599', reason: 'Vitamin C + turmeric reduce dark spots and add a healthy glow.', rating: 4.4 },
  { name: 'Dot & Key Waterlight Gel Moisturiser + Serum', brand: 'Dot & Key', type: 'serum', price: 745, priceLabel: '₹745', reason: 'Hyaluronic acid serum-moisturiser combo keeps oily skin matte yet dewy.', rating: 4.5 },
  { name: 'Minimalist 10% Niacinamide Serum', brand: 'Minimalist', type: 'serum', price: 599, priceLabel: '₹599', reason: 'Reduces pore size, controls sebum, and fades hyperpigmentation.', rating: 4.6 },
  { name: 'Plum 15% Vitamin C Serum', brand: 'Plum', type: 'serum', price: 849, priceLabel: '₹849', reason: 'Stable Vitamin C formula evens tone and boosts collagen.', rating: 4.3 },
  { name: 'The Ordinary Hyaluronic Acid 2% + B5', brand: 'The Ordinary', type: 'serum', price: 649, priceLabel: '₹649', reason: 'Intense hydration serum plumps fine lines and restores moisture barrier.', rating: 4.7 },
  { name: 'Dot & Key Cica Calming Serum', brand: 'Dot & Key', type: 'serum', price: 995, priceLabel: '₹995', reason: 'Centella Asiatica calms redness and repairs damaged skin barrier.', rating: 4.5 },
  { name: 'Mamaearth Retinol Sleeping Serum', brand: 'Mamaearth', type: 'serum', price: 699, priceLabel: '₹699', reason: 'Overnight retinol formula smooths texture and reduces fine lines.', rating: 4.3 },
  { name: 'Minimalist 0.3% Retinol Serum', brand: 'Minimalist', type: 'serum', price: 689, priceLabel: '₹689', reason: 'Beginner-friendly retinol reduces signs of ageing and blemishes.', rating: 4.5 },

  // Moisturisers
  { name: 'Mamaearth Oil-Free Moisturiser', brand: 'Mamaearth', type: 'moisturizer', price: 349, priceLabel: '₹349', reason: 'Lightweight, non-comedogenic gel moisturiser ideal for oily skin.', rating: 4.3 },
  { name: 'Dot & Key Barrier Repair Moisturiser', brand: 'Dot & Key', type: 'moisturizer', price: 895, priceLabel: '₹895', reason: 'Ceramide-rich formula restores the skin barrier and locks in hydration.', rating: 4.6 },
  { name: 'Neutrogena Hydro Boost Water Gel', brand: 'Neutrogena', type: 'moisturizer', price: 899, priceLabel: '₹899', reason: 'Hyaluronic acid gel absorbs instantly and keeps skin hydrated for 48 hrs.', rating: 4.8 },
  { name: 'Cetaphil Moisturising Lotion', brand: 'Cetaphil', type: 'moisturizer', price: 549, priceLabel: '₹549', reason: 'Non-greasy, fragrance-free lotion ideal for normal to combination skin.', rating: 4.6 },
  { name: 'Plum Hello Aloe 72Hr Hydration Gel', brand: 'Plum', type: 'moisturizer', price: 449, priceLabel: '₹449', reason: 'Pure aloe vera cools and soothes while providing lasting hydration.', rating: 4.4 },
  { name: 'Minimalist 10% Lactic Acid Moisturiser', brand: 'Minimalist', type: 'moisturizer', price: 599, priceLabel: '₹599', reason: 'Exfoliates dead skin cells and retains moisture for glowing skin.', rating: 4.3 },

  // Sunscreens
  { name: 'Mamaearth Hydagel Indian Sunscreen SPF 50', brand: 'Mamaearth', type: 'sunscreen', price: 399, priceLabel: '₹399', reason: 'Matte-finish mineral sunscreen with hyaluronic acid — no white cast.', rating: 4.4 },
  { name: 'Dot & Key Waterlight Broad Spectrum SPF 50', brand: 'Dot & Key', type: 'sunscreen', price: 595, priceLabel: '₹595', reason: 'Feather-light gel formula absorbs instantly with zero greasiness.', rating: 4.6 },
  { name: 'Re\'equil Oxybenzone & OMC Free SPF 50', brand: 'Re\'equil', type: 'sunscreen', price: 675, priceLabel: '₹675', reason: 'Chemical-free formula safe for sensitive skin — no irritants.', rating: 4.5 },
  { name: 'Minimalist SPF 50 PA++++ Sunscreen', brand: 'Minimalist', type: 'sunscreen', price: 399, priceLabel: '₹399', reason: 'Broad-spectrum UV protection with Niacinamide for added brightening.', rating: 4.7 },
  { name: 'La Shield Fisico SPF 50+ Sunscreen', brand: 'La Shield', type: 'sunscreen', price: 850, priceLabel: '₹850', reason: 'Dermatologist-prescribed mineral filter — ideal for acne-prone skin.', rating: 4.6 },

  // Toners
  { name: 'Mamaearth Skin Correct Face Serum Toner', brand: 'Mamaearth', type: 'toner', price: 449, priceLabel: '₹449', reason: 'AHA-based toner gently exfoliates and reduces dark spots overnight.', rating: 4.3 },
  { name: 'Dot & Key Pore Tightening Toner', brand: 'Dot & Key', type: 'toner', price: 545, priceLabel: '₹545', reason: 'Witch hazel and niacinamide tighten pores and control excess oil.', rating: 4.4 },
  { name: 'Plum Green Tea Alcohol-Free Toner', brand: 'Plum', type: 'toner', price: 395, priceLabel: '₹395', reason: 'Green tea and hyaluronic acid hydrate and soothe without drying.', rating: 4.4 },
  { name: 'Minimalist 7% Glycolic Acid Toner', brand: 'Minimalist', type: 'toner', price: 599, priceLabel: '₹599', reason: 'Chemical exfoliation unclogs pores and improves skin texture.', rating: 4.5 },
  { name: 'Thayers Rose Petal Witch Hazel Toner', brand: 'Thayers', type: 'toner', price: 799, priceLabel: '₹799', reason: 'Alcohol-free, rose-infused toner refines pores and balances pH.', rating: 4.6 },

  // Eye Creams
  { name: 'Mamaearth Bye Bye Dark Circles Eye Cream', brand: 'Mamaearth', type: 'eye cream', price: 549, priceLabel: '₹549', reason: 'Coffee and cucumber reduce puffiness and lighten under-eye darkness.', rating: 4.3 },
  { name: 'Dot & Key Cooling Eye Serum', brand: 'Dot & Key', type: 'eye cream', price: 795, priceLabel: '₹795', reason: 'Peptide-infused cooling serum de-puffs and reduces crow\'s feet.', rating: 4.5 },
  { name: 'Plum Bright Years Cell Renewal Eye Cream', brand: 'Plum', type: 'eye cream', price: 695, priceLabel: '₹695', reason: 'Retinol + Vitamin C formula firms and brightens the under-eye zone.', rating: 4.4 },
  { name: 'Minimalist Caffeine 5% Eye Serum', brand: 'Minimalist', type: 'eye cream', price: 549, priceLabel: '₹549', reason: 'Caffeine reduces dark circles and puffiness from lack of sleep.', rating: 4.6 },
];

/* ── Static makeup product catalogue ────────────────────────────────── */
const STATIC_MAKEUP_PRODUCTS: StaticProduct[] = [
  // Foundation
  { name: 'Mamaearth Glow Serum Foundation', brand: 'Mamaearth', type: 'foundation', price: 549, priceLabel: '₹549', reason: 'Skin-tint foundation with Vitamin C for a natural, glowy finish.', rating: 4.3 },
  { name: 'Dot & Key Flawless Skin Foundation', brand: 'Dot & Key', type: 'foundation', price: 799, priceLabel: '₹799', reason: 'Buildable coverage with SPF 20 — lightweight for everyday wear.', rating: 4.4 },
  { name: 'Lakme 9to5 Weightless Mousse Foundation', brand: 'Lakme', type: 'foundation', price: 599, priceLabel: '₹599', reason: 'Whipped mousse texture blends seamlessly for a smooth matte finish.', rating: 4.2 },
  { name: 'Maybelline Fit Me Matte+Poreless Foundation', brand: 'Maybelline', type: 'foundation', price: 499, priceLabel: '₹499', reason: 'Refined pore look with oil-free formula — 40 shades for Indian skin tones.', rating: 4.5 },
  { name: 'L\'Oreal True Match Super Blendable Foundation', brand: 'L\'Oreal', type: 'foundation', price: 899, priceLabel: '₹899', reason: 'Matches Indian skin undertones precisely for an undetectable finish.', rating: 4.4 },
  { name: 'SUGAR Cosmetics Ace of Face Foundation Stick', brand: 'SUGAR', type: 'foundation', price: 999, priceLabel: '₹999', reason: 'Stick format for on-the-go application — medium to full buildable coverage.', rating: 4.5 },

  // Concealer
  { name: 'Mamaearth Glow Concealer', brand: 'Mamaearth', type: 'concealer', price: 399, priceLabel: '₹399', reason: 'Peach-toned formula neutralises dark under-eyes naturally.', rating: 4.2 },
  { name: 'Maybelline Fit Me Concealer', brand: 'Maybelline', type: 'concealer', price: 349, priceLabel: '₹349', reason: 'Creamy texture blends effortlessly and covers blemishes for 16 hours.', rating: 4.6 },
  { name: 'SUGAR Cosmetics Ace of Face Concealer', brand: 'SUGAR', type: 'concealer', price: 699, priceLabel: '₹699', reason: 'Full-coverage formula for blemishes, dark spots, and under-eye circles.', rating: 4.4 },
  { name: 'Nykaa Skin Secrets Concealer', brand: 'Nykaa', type: 'concealer', price: 449, priceLabel: '₹449', reason: 'Creamy coverage with moisturising ingredients for a smooth finish.', rating: 4.3 },

  // Eyeshadow
  { name: 'Mamaearth Natural Eye Shadow Palette', brand: 'Mamaearth', type: 'eyeshadow', price: 599, priceLabel: '₹599', reason: 'Earthy nudes and matte shades perfect for everyday natural looks.', rating: 4.2 },
  { name: 'SUGAR Cosmetics Blend The Rules Palette', brand: 'SUGAR', type: 'eyeshadow', price: 999, priceLabel: '₹999', reason: 'Mix of mattes and shimmers for both day-to-night eye looks.', rating: 4.5 },
  { name: 'Nykaa Eyes On Me Palette', brand: 'Nykaa', type: 'eyeshadow', price: 849, priceLabel: '₹849', reason: 'Pigmented shades with easy blendability — great for beginners.', rating: 4.4 },
  { name: 'Lakme Absolute Midnight Mosaic Palette', brand: 'Lakme', type: 'eyeshadow', price: 699, priceLabel: '₹699', reason: 'Rich pigments for bold eye looks that suit Indian skin tones.', rating: 4.3 },

  // Eyeliner
  { name: 'Mamaearth Natural Long-Lasting Kohl', brand: 'Mamaearth', type: 'eyeliner', price: 299, priceLabel: '₹299', reason: 'Safe kohl with almond extracts — gentle for sensitive eyes.', rating: 4.2 },
  { name: 'Maybelline Hyper Precise All Day Liner', brand: 'Maybelline', type: 'eyeliner', price: 349, priceLabel: '₹349', reason: 'Ultra-fine 0.4mm tip for precise wings — smudge-proof for 24 hours.', rating: 4.6 },
  { name: 'SUGAR Cosmetics Wing It Liner', brand: 'SUGAR', type: 'eyeliner', price: 499, priceLabel: '₹499', reason: 'Waterproof liquid liner with a flexible brush tip — perfect wings every time.', rating: 4.5 },
  { name: 'Nykaa Black Magic Kajal', brand: 'Nykaa', type: 'eyeliner', price: 199, priceLabel: '₹199', reason: 'Intense black kajal with long-lasting formula — great for everyday use.', rating: 4.3 },

  // Mascara
  { name: 'Maybelline Colossal Kohl Kajal', brand: 'Maybelline', type: 'mascara', price: 299, priceLabel: '₹299', reason: 'Volume-boosting formula with a thick brush for bold, defined lashes.', rating: 4.5 },
  { name: 'Lakme Eyeconic Curling Mascara', brand: 'Lakme', type: 'mascara', price: 449, priceLabel: '₹449', reason: 'Lifts and curls straight lashes — smudge-resistant for humid climates.', rating: 4.3 },
  { name: 'SUGAR Cosmetics Uptown Curl Mascara', brand: 'SUGAR', type: 'mascara', price: 599, priceLabel: '₹599', reason: 'Buildable volume with a curved wand — no clumping, no flaking.', rating: 4.4 },

  // Lipstick
  { name: 'Mamaearth Moisture Matte Lipstick', brand: 'Mamaearth', type: 'lipstick', price: 349, priceLabel: '₹349', reason: 'Shea butter–infused matte lipstick that keeps lips soft and hydrated.', rating: 4.3 },
  { name: 'Dot & Key Glossy Lip Butter', brand: 'Dot & Key', type: 'lipstick', price: 495, priceLabel: '₹495', reason: 'Nourishing gloss-meets-balm formula for glossy, plump lips.', rating: 4.5 },
  { name: 'SUGAR Cosmetics Matte As Hell Lipstick', brand: 'SUGAR', type: 'lipstick', price: 599, priceLabel: '₹599', reason: 'Intense pigment, 16-hour wear, and a luxurious matte finish.', rating: 4.6 },
  { name: 'Lakme 9to5 Primer + Matte Lip Color', brand: 'Lakme', type: 'lipstick', price: 449, priceLabel: '₹449', reason: 'Built-in primer ensures even application and hours of lasting color.', rating: 4.4 },
  { name: 'Maybelline SuperStay Matte Ink Lipstick', brand: 'Maybelline', type: 'lipstick', price: 699, priceLabel: '₹699', reason: 'Up to 16-hour matte wear — transfers minimally, survives meals.', rating: 4.7 },

  // Lip Gloss
  { name: 'Mamaearth Glow Butter Lip Gloss', brand: 'Mamaearth', type: 'gloss', price: 299, priceLabel: '₹299', reason: 'Plumping gloss with shea butter — adds shine without stickiness.', rating: 4.3 },
  { name: 'Nykaa So Glossy Lip Gloss', brand: 'Nykaa', type: 'gloss', price: 349, priceLabel: '₹349', reason: 'High-shine formula available in 20 shades — light, non-sticky finish.', rating: 4.4 },
  { name: 'SUGAR Cosmetics Tipsy Lips Glossy Balm', brand: 'SUGAR', type: 'gloss', price: 499, priceLabel: '₹499', reason: 'Glossy balm with conditioning oils for plump, hydrated lips.', rating: 4.5 },

  // Blush
  { name: 'Mamaearth Natural Blush', brand: 'Mamaearth', type: 'blush', price: 449, priceLabel: '₹449', reason: 'Finely milled blush with Vitamin E for a natural rosy flush.', rating: 4.2 },
  { name: 'SUGAR Cosmetics Contour De Force Blush', brand: 'SUGAR', type: 'blush', price: 699, priceLabel: '₹699', reason: 'Highly pigmented, buildable blush in shades curated for brown skin.', rating: 4.5 },
  { name: 'Nykaa SKINgenius Sculpting Blush', brand: 'Nykaa', type: 'blush', price: 549, priceLabel: '₹549', reason: 'Peach and berry shades that complement Indian skin tones beautifully.', rating: 4.4 },
  { name: 'Lakme Absolute Illuminating Blush', brand: 'Lakme', type: 'blush', price: 549, priceLabel: '₹549', reason: 'Subtle shimmer particles add a lit-from-within glow to cheeks.', rating: 4.3 },

  // Highlighter
  { name: 'Nykaa SKINgenius Illuminating Highlighter', brand: 'Nykaa', type: 'highlighter', price: 649, priceLabel: '₹649', reason: 'Ultra-fine champagne shimmer that catches light without glitter chunks.', rating: 4.5 },
  { name: 'SUGAR Cosmetics Glow & Behold Highlight', brand: 'SUGAR', type: 'highlighter', price: 799, priceLabel: '₹799', reason: 'Baked formula for a blinding highlight on brow bones and cheekbones.', rating: 4.6 },
  { name: 'Lakme Absolute Spotlight Highlighter', brand: 'Lakme', type: 'highlighter', price: 499, priceLabel: '₹499', reason: 'Pressed pearl highlighter for dewy, glass-skin effect.', rating: 4.3 },

  // Powder
  { name: 'Mamaearth Glow Talc-Free Setting Powder', brand: 'Mamaearth', type: 'powder', price: 449, priceLabel: '₹449', reason: 'Translucent talc-free powder sets makeup and controls shine naturally.', rating: 4.2 },
  { name: 'Dot & Key HD Setting Powder', brand: 'Dot & Key', type: 'powder', price: 695, priceLabel: '₹695', reason: 'Ultra-fine powder blurs pores and extends foundation wear time.', rating: 4.4 },
  { name: 'Maybelline Fit Me Loose Finishing Powder', brand: 'Maybelline', type: 'powder', price: 449, priceLabel: '₹449', reason: 'Silky setting powder minimises shine and keeps makeup fresh all day.', rating: 4.5 },
  { name: 'Lakme Absolute Blur Perfect Matte Powder', brand: 'Lakme', type: 'powder', price: 549, priceLabel: '₹549', reason: 'Blur-effect powder reduces appearance of pores and fine lines.', rating: 4.3 },
];

/* ── Skin constants ──────────────────────────────────────────────────── */
const SKIN_FILTER_TABS = ['All', 'Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Toner', 'Eye Cream'];

const SKIN_TYPE_COLOR: Record<string, string> = {
  cleanser:    '#06b6d4',
  serum:       '#a855f7',
  moisturizer: '#22c55e',
  sunscreen:   '#f59e0b',
  toner:       '#ec4899',
  'eye cream': '#6366f1',
};

const SKIN_TYPE_IMAGE: Record<string, string> = {
  cleanser:    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=85&fit=crop',
  serum:       'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=85&fit=crop',
  moisturizer: 'https://images.unsplash.com/photo-1607602132700-068258431c7c?w=500&q=85&fit=crop',
  sunscreen:   'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=85&fit=crop',
  toner:       'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&q=85&fit=crop',
  'eye cream': 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=85&fit=crop',
};

/* ── Makeup constants ────────────────────────────────────────────────── */
const MAKEUP_FILTER_TABS = ['All', 'Foundation', 'Concealer', 'Eyes', 'Lips', 'Blush', 'Highlighter', 'Powder'];

const MAKEUP_TYPE_COLOR: Record<string, string> = {
  foundation: '#f59e0b', concealer: '#ec4899', powder: '#a855f7',
  blush: '#f43f5e', highlighter: '#eab308', primer: '#06b6d4',
  eyeshadow: '#6366f1', eyeliner: '#334155', mascara: '#334155',
  lipstick: '#e11d48', gloss: '#f472b6', balm: '#fb923c',
};

const MAKEUP_TYPE_IMAGE: Record<string, string> = {
  foundation:  'https://images.unsplash.com/photo-1631214524020-3c69d08b3b10?w=500&q=85&fit=crop',
  concealer:   'https://images.unsplash.com/photo-1631214524020-3c69d08b3b10?w=500&q=85&fit=crop',
  powder:      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  blush:       'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  highlighter: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  eyeshadow:   'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  eyeliner:    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  mascara:     'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=85&fit=crop',
  lipstick:    'https://images.unsplash.com/photo-1586495777744-4e6b8f5c4c5e?w=500&q=85&fit=crop',
  gloss:       'https://images.unsplash.com/photo-1586495777744-4e6b8f5c4c5e?w=500&q=85&fit=crop',
};

const MAKEUP_TYPE_EMOJI: Record<string, string> = {
  foundation: '🏅', concealer: '✨', powder: '🌸', blush: '🌹',
  highlighter: '⭐', eyeshadow: '👁️', eyeliner: '✏️', mascara: '🪄',
  lipstick: '💋', gloss: '💄', balm: '🫦',
};

const AFFILIATE_TAG = 'roopai03-21';

function buildLinks(name: string) {
  const query = encodeURIComponent(name);
  return {
    amazon: `https://www.amazon.in/s?k=${query}&tag=${AFFILIATE_TAG}`,
    nykaa:  `https://www.nykaa.com/search/result/?q=${query}`,
  };
}

function matchesMakeupFilter(type: string, filter: string): boolean {
  if (filter === 'All') return true;
  const f = filter.toLowerCase();
  if (f === 'eyes') return ['eyeshadow', 'eyeliner', 'mascara', 'brow'].includes(type);
  if (f === 'lips') return ['lipstick', 'gloss', 'balm'].includes(type);
  return type === f;
}

/* ── Price range filter UI ───────────────────────────────────────────── */
function PriceRangeFilter({ value, onChange }: { value: PriceRange; onChange: (v: PriceRange) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', flexShrink: 0 }}>
        Budget:
      </span>
      {PRICE_RANGES.map(r => {
        const active = value === r.key;
        return (
          <button
            key={r.key}
            onClick={() => onChange(r.key)}
            style={{
              padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
              border: `1.5px solid ${active ? '#a855f7' : 'var(--border)'}`,
              background: active ? 'rgba(168,85,247,0.14)' : 'transparent',
              color: active ? '#a855f7' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Merge AI products with static catalogue ─────────────────────────── */
function mergeWithStatic(aiProducts: any[], staticCatalogue: StaticProduct[], priceRange: PriceRange): StaticProduct[] {
  const rangeConfig = PRICE_RANGES.find(r => r.key === priceRange) ?? PRICE_RANGES[0];

  // Convert AI products to StaticProduct shape
  const fromAI: StaticProduct[] = aiProducts.map((p: any) => ({
    name: p.name,
    brand: '',
    type: p.type,
    price: 599,
    priceLabel: '₹599',
    reason: p.reason,
    rating: 4.4,
  }));

  // Merge: deduplicate by name (AI first, then static)
  const seen = new Set(fromAI.map(p => p.name.toLowerCase()));
  const extras = staticCatalogue.filter(p => !seen.has(p.name.toLowerCase()));
  const all = [...fromAI, ...extras];

  // Apply price filter (AI products without real price always pass through)
  return all.filter(p => {
    if (rangeConfig.key === 'all') return true;
    if (p.brand === '') return true; // AI-generated, no price data
    return p.price >= rangeConfig.min && p.price <= rangeConfig.max;
  });
}

/* ── Product card ────────────────────────────────────────────────────── */
function ProductCard({
  p, i, color, img, emoji, isGlam, t,
}: {
  p: StaticProduct; i: number; color: string; img: string; emoji?: string; isGlam: boolean; t: any;
}) {
  const links = buildLinks(p.name);
  const isTop = i === 0;
  const match = Math.min(99, Math.max(72, 97 - i * 2));

  return (
    <div className="product-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Match badge */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 2,
        background: isTop
          ? (isGlam ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'linear-gradient(135deg,#a855f7,#ec4899)')
          : 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)', borderRadius: 20,
        padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.5,
      }}>
        {isTop ? (isGlam ? '💄 BEST PICK' : '✦ BEST MATCH') : `${match}% Match`}
      </div>

      {/* Brand badge */}
      {p.brand && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', borderRadius: 16,
          padding: '3px 10px', fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: 0.3,
        }}>
          {p.brand}
        </div>
      )}

      {/* Image */}
      <div style={{ width: '100%', height: 200, overflow: 'hidden', background: `${color}12`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <img
          src={img} alt={p.name} className="product-card-img"
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          onError={e => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = 'none';
            const parent = el.parentElement;
            if (parent) { parent.style.fontSize = '48px'; parent.innerHTML = emoji ?? '🧴'; }
          }}
        />
      </div>

      <div className="product-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="product-type-badge" style={{ background: `${color}22`, color }}>{p.type.toUpperCase()}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{p.priceLabel}</span>
        </div>
        {/* Stars */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 6, alignItems: 'center' }}>
          {[1,2,3,4,5].map(s => (
            <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= Math.floor(p.rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-hint)', marginLeft: 4 }}>{p.rating.toFixed(1)}</span>
        </div>
        <div className="product-name">{p.name}</div>
        <p className="product-reason">{p.reason}</p>
        <div className="product-actions">
          <a href={links.amazon} target="_blank" rel="noreferrer noopener" className="product-buy-btn product-buy-amazon">{t.buyAmazon}</a>
          <a href={links.nykaa} target="_blank" rel="noreferrer noopener" className="product-buy-btn product-buy-nykaa">{t.buyNykaa}</a>
        </div>
      </div>
    </div>
  );
}

/* ── Skin Products Section ───────────────────────────────────────────── */
function SkinProductsContent({ latest, activeFilter, priceRange, t }: { latest: HistoryEntry; activeFilter: string; priceRange: PriceRange; t: any }) {
  const { products, glowScore, scores } = latest.analysis;

  const merged = mergeWithStatic(products, STATIC_SKIN_PRODUCTS, priceRange);
  const filtered = activeFilter === 'All'
    ? merged
    : merged.filter(p => p.type.toLowerCase() === activeFilter.toLowerCase());

  const featured = filtered[0] ?? merged[0];
  const glowPoints = Math.round(filtered.length * 4 + (glowScore * 0.1));

  void scores; // scores used by AI product generation, not here

  return (
    <div className="products-layout">
      <div className="products-grid-wrap">
        {filtered.length === 0 ? (
          <div className="products-empty">
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p>No products found in this price range for the selected category.</p>
            <p style={{ fontSize: 12, color: 'var(--text-hint)', marginTop: 4 }}>Try a wider budget filter.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p, i) => (
              <ProductCard
                key={i} p={p} i={i}
                color={SKIN_TYPE_COLOR[p.type] ?? '#a855f7'}
                img={SKIN_TYPE_IMAGE[p.type] ?? SKIN_TYPE_IMAGE['serum']}
                isGlam={false} t={t}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="products-sidebar">
        {featured && (
          <div className="editors-choice-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src={SKIN_TYPE_IMAGE[featured.type] ?? SKIN_TYPE_IMAGE['serum']} alt={featured.name}
                style={{ width: '100%', height: 150, objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'linear-gradient(135deg,#a855f7,#ec4899)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                ✦ Editor's Choice
              </div>
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ fontSize: 10, color: SKIN_TYPE_COLOR[featured.type] ?? '#a855f7', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{featured.type}</div>
              <div className="editors-name">{featured.name}</div>
              <p className="editors-reason">{featured.reason}</p>
              <a href={buildLinks(featured.name).amazon} target="_blank" rel="noreferrer noopener"
                className="btn-glow" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px' }}>
                Shop Now
              </a>
            </div>
          </div>
        )}

        <div className="routine-potential-card">
          <div className="section-label">Routine Potential</div>
          <div className="routine-potential-score">
            <span className="potential-num">+{glowPoints}</span>
            <span className="potential-label">Glow Points</span>
          </div>
          <p className="potential-desc">Using these products consistently could boost your Glow Score by up to {glowPoints} points.</p>
          <div className="potential-bar-track">
            <div className="potential-bar-fill" style={{ width: `${Math.min(glowPoints, 100)}%` }} />
          </div>
        </div>

        <div className="skin-profile-card">
          <div className="section-label">Your Skin Profile</div>
          <div className="skin-profile-row"><span>Type</span><span className="skin-badge skin-badge-purple">{latest.analysis.skinType}</span></div>
          <div className="skin-profile-row"><span>Oiliness</span><span className="skin-badge skin-badge-cyan">{latest.analysis.oiliness}</span></div>
          <div className="skin-profile-row"><span>Glow Score</span><span className="skin-badge skin-badge-gold">{glowScore}/100</span></div>
        </div>
      </div>
    </div>
  );
}

/* ── Makeup Products Section ─────────────────────────────────────────── */
function MakeupProductsContent({ latest, activeFilter, priceRange, t }: { latest: GlamHistoryEntry; activeFilter: string; priceRange: PriceRange; t: any }) {
  const { products, glamScore, makeupStyle, currentLook } = latest.analysis;

  const merged = mergeWithStatic(products, STATIC_MAKEUP_PRODUCTS, priceRange);
  const filtered = merged.filter(p => matchesMakeupFilter(p.type, activeFilter));
  const featured = filtered[0] ?? merged[0];
  const glamPoints = Math.round(filtered.length * 5 + glamScore * 0.15);

  return (
    <div className="products-layout">
      <div className="products-grid-wrap">
        {filtered.length === 0 ? (
          <div className="products-empty">
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p>No makeup products found in this price range for the selected category.</p>
            <p style={{ fontSize: 12, color: 'var(--text-hint)', marginTop: 4 }}>Try a wider budget filter.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p, i) => (
              <ProductCard
                key={i} p={p} i={i}
                color={MAKEUP_TYPE_COLOR[p.type] ?? '#ec4899'}
                img={MAKEUP_TYPE_IMAGE[p.type] ?? MAKEUP_TYPE_IMAGE['lipstick']}
                emoji={MAKEUP_TYPE_EMOJI[p.type]}
                isGlam={true} t={t}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="products-sidebar">
        {featured && (
          <div className="editors-choice-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img src={MAKEUP_TYPE_IMAGE[featured.type] ?? MAKEUP_TYPE_IMAGE['lipstick']} alt={featured.name}
                style={{ width: '100%', height: 150, objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'linear-gradient(135deg,#ec4899,#a855f7)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                💄 Top Pick
              </div>
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ fontSize: 10, color: MAKEUP_TYPE_COLOR[featured.type] ?? '#ec4899', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{featured.type}</div>
              <div className="editors-name">{featured.name}</div>
              <p className="editors-reason">{featured.reason}</p>
              <a href={buildLinks(featured.name).nykaa} target="_blank" rel="noreferrer noopener"
                className="btn-glow" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '10px', background: 'linear-gradient(135deg,#ec4899,#a855f7)' }}>
                Shop Now
              </a>
            </div>
          </div>
        )}

        <div className="routine-potential-card">
          <div className="section-label">Glam Potential</div>
          <div className="routine-potential-score">
            <span className="potential-num" style={{ background: 'linear-gradient(135deg,#ec4899,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>+{glamPoints}</span>
            <span className="potential-label">Glam Points</span>
          </div>
          <p className="potential-desc">Using these makeup products could boost your Glam Score by up to {glamPoints} points.</p>
          <div className="potential-bar-track">
            <div className="potential-bar-fill" style={{ width: `${Math.min(glamPoints, 100)}%`, background: 'linear-gradient(90deg,#ec4899,#a855f7)' }} />
          </div>
        </div>

        <div className="skin-profile-card">
          <div className="section-label">Your Glam Profile</div>
          <div className="skin-profile-row"><span>Style</span><span className="skin-badge skin-badge-purple">{makeupStyle}</span></div>
          <div className="skin-profile-row"><span>Current Look</span><span className="skin-badge skin-badge-cyan">{currentLook}</span></div>
          <div className="skin-profile-row"><span>Glam Score</span><span className="skin-badge skin-badge-gold">{glamScore}/100</span></div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function Products() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = T[lang];

  const [history] = useLocalStorage<HistoryEntry[]>('roop_history', []);
  const [glamHistory] = useLocalStorage<GlamHistoryEntry[]>('roop_glam_history', []);
  const [scoreMode] = useLocalStorage<'glow' | 'glam' | null>('roop_score_mode', null);

  const [productTab, setProductTab] = useState<'skin' | 'makeup'>(scoreMode === 'glam' ? 'makeup' : 'skin');
  const [activeFilter, setActiveFilter] = useState('All');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');

  const latestSkin = history[0];
  const latestGlam = glamHistory[0];

  const hasAnything = latestSkin || latestGlam;

  if (!hasAnything) {
    return (
      <AppLayout>
        <div className="page-empty">
          <div className="page-empty-icon">🛍️</div>
          <h3>No Products Yet</h3>
          <p>Complete a skin or makeup analysis to unlock your personalised product recommendations.</p>
          <button onClick={() => navigate('/scan')} className="btn-glow">Start Analysis</button>
        </div>
      </AppLayout>
    );
  }

  const effectiveTab = (productTab === 'skin' && !latestSkin && latestGlam) ? 'makeup'
    : (productTab === 'makeup' && !latestGlam && latestSkin) ? 'skin'
    : productTab;

  const filterTabs = effectiveTab === 'makeup' ? MAKEUP_FILTER_TABS : SKIN_FILTER_TABS;
  const isGlam = effectiveTab === 'makeup';

  function handleTabSwitch(tab: 'skin' | 'makeup') {
    setProductTab(tab);
    setActiveFilter('All');
    setPriceRange('all');
  }

  function handleFilterSwitch(f: string) {
    setActiveFilter(f);
  }

  return (
    <AppLayout>
      <div className="page-products fade-in">
        {/* Header */}
        <div className="products-header">
          <span className="page-eyebrow">{isGlam ? 'Curated For Your Look' : 'Curated For Your Skin'}</span>
          <h1 className="products-title">
            {isGlam ? 'Makeup' : 'Ethereal'} <span className="gradient-text">{isGlam ? 'Arsenal' : 'Selection'}</span>
          </h1>
          <p className="products-subtitle">
            {isGlam
              ? `AI-recommended makeup products matched to your ${latestGlam?.analysis.makeupStyle ?? ''} style.`
              : `AI-recommended products tailored to your ${latestSkin?.analysis.skinType ?? ''} skin profile.`}
          </p>
        </div>

        {/* Tab switcher — only shown when no mode is locked */}
        {!scoreMode && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button
              onClick={() => handleTabSwitch('skin')}
              disabled={!latestSkin}
              style={{
                padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700,
                cursor: latestSkin ? 'pointer' : 'not-allowed',
                border: `1.5px solid ${effectiveTab === 'skin' ? '#a855f7' : 'var(--border)'}`,
                background: effectiveTab === 'skin' ? 'rgba(168,85,247,0.12)' : 'transparent',
                color: effectiveTab === 'skin' ? '#a855f7' : 'var(--text-muted)',
                opacity: latestSkin ? 1 : 0.4, transition: 'all 0.2s',
              }}
            >
              🌿 Skin Products
            </button>
            <button
              onClick={() => handleTabSwitch('makeup')}
              disabled={!latestGlam}
              style={{
                padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700,
                cursor: latestGlam ? 'pointer' : 'not-allowed',
                border: `1.5px solid ${effectiveTab === 'makeup' ? '#ec4899' : 'var(--border)'}`,
                background: effectiveTab === 'makeup' ? 'rgba(236,72,153,0.12)' : 'transparent',
                color: effectiveTab === 'makeup' ? '#ec4899' : 'var(--text-muted)',
                opacity: latestGlam ? 1 : 0.4, transition: 'all 0.2s',
              }}
            >
              💄 Makeup Products
            </button>
          </div>
        )}

        {/* Price range filter */}
        <PriceRangeFilter value={priceRange} onChange={v => { setPriceRange(v); }} />

        {/* Category filter tabs */}
        <div className="products-filters">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => handleFilterSwitch(tab)}
              className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Empty states per tab */}
        {effectiveTab === 'skin' && !latestSkin && (
          <div className="page-empty" style={{ marginTop: 40 }}>
            <div className="page-empty-icon">🌿</div>
            <h3>No Skin Analysis Yet</h3>
            <p>Run a Glow Score scan to see your personalised skincare recommendations.</p>
            <button onClick={() => navigate('/scan')} className="btn-glow">Start Glow Scan</button>
          </div>
        )}

        {effectiveTab === 'makeup' && !latestGlam && (
          <div className="page-empty" style={{ marginTop: 40 }}>
            <div className="page-empty-icon">💄</div>
            <h3>No Glam Analysis Yet</h3>
            <p>Run a Glam Score scan to see your personalised makeup recommendations.</p>
            <button onClick={() => navigate('/scan')} className="btn-glow">Start Glam Scan</button>
          </div>
        )}

        {/* Content */}
        <>
          {effectiveTab === 'skin' && latestSkin && (
            <SkinProductsContent latest={latestSkin} activeFilter={activeFilter} priceRange={priceRange} t={t} />
          )}
          {effectiveTab === 'makeup' && latestGlam && (
            <MakeupProductsContent latest={latestGlam} activeFilter={activeFilter} priceRange={priceRange} t={t} />
          )}
        </>
      </div>
    </AppLayout>
  );
}
