import type { ProductRecommendation } from '../types/analysis';

export const FALLBACK_PRODUCTS: ProductRecommendation[] = [
  { name: 'CeraVe Hydrating Cleanser', type: 'cleanser', reason: 'Gentle, non-stripping formula suitable for all skin types' },
  { name: 'The Ordinary Niacinamide 10% + Zinc 1%', type: 'serum', reason: 'Reduces pores and controls sebum production' },
  { name: 'Neutrogena Hydro Boost Water Gel', type: 'moisturizer', reason: 'Lightweight hydration without clogging pores' },
  { name: 'Minimalist Sunscreen SPF 50', type: 'sunscreen', reason: 'Broad-spectrum UV protection for daily use' },
];
