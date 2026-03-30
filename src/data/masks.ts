import type { MaskType } from '../types/analysis';

export interface MaskRecommendation {
  name: string;
  frequency: string;
  days: string[];
  time: string;
  benefit: string;
  nykaaLink: string;
  amazonLink?: string;
  myntraLink?: string;
}

export const MASK_RECOMMENDATIONS: Record<MaskType, MaskRecommendation> = {
  acne: {
    name: 'Kaolin Clay Mask',
    frequency: '2x/week',
    days: ['Tue', 'Sat'],
    time: 'Evening',
    benefit: 'Absorbs excess oil, unclogs pores, reduces breakouts',
    nykaaLink: 'https://www.nykaa.com/search/result/?q=kaolin+clay+mask',
    amazonLink: 'https://www.amazon.in/s?k=kaolin+clay+mask+face&tag=roopai03-21',
  },
  dry: {
    name: 'Hydrating Sheet Mask',
    frequency: '3x/week',
    days: ['Mon', 'Wed', 'Fri'],
    time: 'Night',
    benefit: 'Deep hydration, plumps skin, reduces flakiness',
    nykaaLink: 'https://www.nykaa.com/search/result/?q=hydrating+sheet+mask',
    amazonLink: 'https://www.amazon.in/s?k=hydrating+sheet+mask&tag=roopai03-21',
  },
  dark_circles: {
    name: 'Collagen Eye Patches',
    frequency: '4x/week',
    days: ['Mon', 'Wed', 'Fri', 'Sun'],
    time: 'Morning',
    benefit: 'Reduces puffiness, brightens under-eye area',
    nykaaLink: 'https://www.nykaa.com/search/result/?q=eye+patches+dark+circles',
    amazonLink: 'https://www.amazon.in/s?k=collagen+eye+patches&tag=roopai03-21',
  },
  dull: {
    name: 'Vitamin C Glow Mask',
    frequency: '2x/week',
    days: ['Wed', 'Sun'],
    time: 'Evening',
    benefit: 'Brightens complexion, evens skin tone, boosts radiance',
    nykaaLink: 'https://www.nykaa.com/search/result/?q=vitamin+c+glow+mask',
    amazonLink: 'https://www.amazon.in/s?k=vitamin+c+glow+mask&tag=roopai03-21',
    myntraLink: 'https://www.myntra.com/face-mask?rawQuery=vitamin+c+glow+mask',
  },
  oily: {
    name: 'Charcoal Peel-Off Mask',
    frequency: '2x/week',
    days: ['Thu', 'Sun'],
    time: 'Evening',
    benefit: 'Deep cleanses pores, removes blackheads, controls oil',
    nykaaLink: 'https://www.nykaa.com/search/result/?q=charcoal+peel+off+mask',
    amazonLink: 'https://www.amazon.in/s?k=charcoal+peel+off+mask&tag=roopai03-21',
    myntraLink: 'https://www.myntra.com/face-mask?rawQuery=charcoal+peel+off+mask',
  },
};
