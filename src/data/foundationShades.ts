export type FoundationBrand = 'maybelline' | 'loreal' | 'lakme' | 'myglamm' | 'faces' | 'nykaa';
export type Undertone = 'warm' | 'cool' | 'neutral';

export interface ShadeEntry {
  maybelline: string;
  loreal: string;
  lakme: string;
  myglamm: string;
  faces: string;
  nykaa: string;
}

export interface MissingProduct {
  name: string;
  shade_note: string;
  price: string;
  nykaa: string;
}

const shadeMap: Record<string, ShadeEntry> = {
  // FAIR (1-2)
  '1-warm':    { maybelline: '110 Porcelain',       loreal: 'W1 Golden Ivory',     lakme: 'Marble',   myglamm: '01W', faces: '001 Porcelain', nykaa: '01W Fair Warm'     },
  '1-cool':    { maybelline: '110 Porcelain',       loreal: 'C1 Rose Ivory',       lakme: 'Marble',   myglamm: '01W', faces: '001 Porcelain', nykaa: '02N Fair Neutral'   },
  '1-neutral': { maybelline: '115 Ivory',           loreal: 'N1 Ivory',            lakme: 'Shell',    myglamm: '02N', faces: '001 Porcelain', nykaa: '02N Fair Neutral'   },
  '2-warm':    { maybelline: '120 Classic Ivory',   loreal: 'W1 Golden Ivory',     lakme: 'Shell',    myglamm: '01W', faces: '002 Ivory',     nykaa: '01W Fair Warm'     },
  '2-cool':    { maybelline: '115 Ivory',           loreal: 'C1 Rose Ivory',       lakme: 'Shell',    myglamm: '02N', faces: '002 Ivory',     nykaa: '02N Fair Neutral'   },
  '2-neutral': { maybelline: '120 Classic Ivory',   loreal: 'N1 Ivory',            lakme: 'Shell',    myglamm: '02N', faces: '002 Ivory',     nykaa: '02N Fair Neutral'   },

  // LIGHT (3-4)
  '3-warm':    { maybelline: '125 Nude Beige',      loreal: 'W2 Golden Vanilla',   lakme: 'Ivory',    myglamm: '03W', faces: '003 Sand',      nykaa: '03W Light Warm'    },
  '3-cool':    { maybelline: '125 Nude Beige',      loreal: 'N2 Vanilla',          lakme: 'Ivory',    myglamm: '04N', faces: '003 Sand',      nykaa: '04N Light Neutral'  },
  '3-neutral': { maybelline: '128 Warm Nude',       loreal: 'N2 Vanilla',          lakme: 'Ivory',    myglamm: '04N', faces: '003 Sand',      nykaa: '04N Light Neutral'  },
  '4-warm':    { maybelline: '130 Buff Beige',      loreal: 'W3 Golden Beige',     lakme: 'Beige',    myglamm: '03W', faces: '004 Buff',      nykaa: '03W Light Warm'    },
  '4-cool':    { maybelline: '128 Warm Nude',       loreal: 'N2 Vanilla',          lakme: 'Beige',    myglamm: '04N', faces: '004 Buff',      nykaa: '04N Light Neutral'  },
  '4-neutral': { maybelline: '130 Buff Beige',      loreal: 'N3 Creamy Beige',     lakme: 'Beige',    myglamm: '04N', faces: '004 Buff',      nykaa: '04N Light Neutral'  },

  // WHEATISH (5-6) — Most common Indian skin tone range
  '5-warm':    { maybelline: '220 Natural Beige',   loreal: 'W3 Golden Beige',     lakme: 'Honey',    myglamm: '05W', faces: '005 Honey',     nykaa: '05W Medium Warm'   },
  '5-cool':    { maybelline: '220 Natural Beige',   loreal: 'N3 Creamy Beige',     lakme: 'Honey',    myglamm: '06N', faces: '005 Honey',     nykaa: '06N Medium Neutral' },
  '5-neutral': { maybelline: '230 Natural Buff',    loreal: 'N4 Beige',            lakme: 'Honey',    myglamm: '06N', faces: '005 Honey',     nykaa: '06N Medium Neutral' },
  '6-warm':    { maybelline: '230 Natural Buff',    loreal: 'W4 Golden Natural',   lakme: 'Golden',   myglamm: '05W', faces: '006 Golden',    nykaa: '05W Medium Warm'   },
  '6-cool':    { maybelline: '230 Natural Buff',    loreal: 'N4 Beige',            lakme: 'Golden',   myglamm: '06N', faces: '006 Golden',    nykaa: '06N Medium Neutral' },
  '6-neutral': { maybelline: '310 Sun Beige',       loreal: 'N4 Beige',            lakme: 'Golden',   myglamm: '06N', faces: '006 Golden',    nykaa: '06N Medium Neutral' },

  // MEDIUM BROWN (7-8)
  '7-warm':    { maybelline: '310 Sun Beige',       loreal: 'W5 Golden Sand',      lakme: 'Caramel',  myglamm: '07W', faces: '007 Coffee',    nykaa: '07W Tan Warm'      },
  '7-cool':    { maybelline: '315 Soft Honey',      loreal: 'N5 Sand',             lakme: 'Caramel',  myglamm: '08N', faces: '007 Coffee',    nykaa: '08N Tan Neutral'   },
  '7-neutral': { maybelline: '320 Natural Tan',     loreal: 'N5 Sand',             lakme: 'Caramel',  myglamm: '08N', faces: '007 Coffee',    nykaa: '08N Tan Neutral'   },
  '8-warm':    { maybelline: '320 Natural Tan',     loreal: 'W6 Golden Sun',       lakme: 'Cocoa',    myglamm: '07W', faces: '007 Coffee',    nykaa: '07W Tan Warm'      },
  '8-cool':    { maybelline: '330 Toffee',          loreal: 'N5 Sand',             lakme: 'Cocoa',    myglamm: '08N', faces: '007 Coffee',    nykaa: '08N Tan Neutral'   },
  '8-neutral': { maybelline: '330 Toffee',          loreal: 'N6 Beige',            lakme: 'Cocoa',    myglamm: '08N', faces: '007 Coffee',    nykaa: '08N Tan Neutral'   },

  // DEEP (9-10)
  '9-warm':    { maybelline: '330 Toffee',          loreal: 'W7 Cinnamon',         lakme: 'Espresso', myglamm: '07W', faces: '007 Coffee',    nykaa: '09W Deep Warm'     },
  '9-cool':    { maybelline: '330 Toffee',          loreal: 'N7 Classic Brown',    lakme: 'Espresso', myglamm: '08N', faces: '007 Coffee',    nykaa: '09W Deep Warm'     },
  '9-neutral': { maybelline: '330 Toffee',          loreal: 'N7 Classic Brown',    lakme: 'Espresso', myglamm: '08N', faces: '007 Coffee',    nykaa: '09W Deep Warm'     },
  '10-warm':   { maybelline: '330 Toffee',          loreal: 'W7 Cinnamon',         lakme: 'Espresso', myglamm: '07W', faces: '007 Coffee',    nykaa: '09W Deep Warm'     },
  '10-cool':   { maybelline: '330 Toffee',          loreal: 'N7 Classic Brown',    lakme: 'Espresso', myglamm: '08N', faces: '007 Coffee',    nykaa: '09W Deep Warm'     },
  '10-neutral':{ maybelline: '330 Toffee',          loreal: 'N7 Classic Brown',    lakme: 'Espresso', myglamm: '08N', faces: '007 Coffee',    nykaa: '09W Deep Warm'     },
};

export const BRAND_LABELS: Record<FoundationBrand, string> = {
  maybelline: 'Maybelline Fit Me',
  loreal:     "L'Oreal True Match",
  lakme:      'Lakmé Absolute',
  myglamm:    'MyGlamm POSE HD',
  faces:      'Faces Canada HD',
  nykaa:      'Nykaa SKINgenius',
};

export const BRAND_COLORS: Record<FoundationBrand, string> = {
  maybelline: '#e91e8c',
  loreal:     '#c8102e',
  lakme:      '#d4a017',
  myglamm:    '#a855f7',
  faces:      '#06b6d4',
  nykaa:      '#ec4899',
};

export const PRICE_RANGE: Record<FoundationBrand, string> = {
  maybelline: '₹299–₹399',
  loreal:     '₹599–₹799',
  lakme:      '₹450–₹650',
  myglamm:    '₹599–₹799',
  faces:      '₹399–₹549',
  nykaa:      '₹499–₹699',
};

export function getNykaaLink(brand: FoundationBrand, shade: string): string {
  const q = shade.replace(/ /g, '+');
  const map: Record<FoundationBrand, string> = {
    maybelline: `https://www.nykaa.com/search/result/?q=maybelline+fit+me+${q}`,
    loreal:     `https://www.nykaa.com/search/result/?q=loreal+true+match+${q}`,
    lakme:      `https://www.nykaa.com/search/result/?q=lakme+absolute+skin+natural+mousse+${q}`,
    myglamm:    `https://www.nykaa.com/search/result/?q=myglamm+pose+hd+foundation+${q}`,
    faces:      `https://www.nykaa.com/search/result/?q=faces+canada+ultime+pro+hd+foundation+${q}`,
    nykaa:      `https://www.nykaa.com/search/result/?q=nykaa+skingenius+foundation+${q}`,
  };
  return map[brand];
}

export function getAmazonLink(brand: FoundationBrand, shade: string): string {
  const productNames: Record<FoundationBrand, string> = {
    maybelline: 'Maybelline Fit Me Foundation',
    loreal:     'LOreal True Match Foundation',
    lakme:      'Lakme Absolute Foundation',
    myglamm:    'MyGlamm POSE HD Foundation',
    faces:      'Faces Canada HD Foundation',
    nykaa:      'Nykaa SKINgenius Foundation',
  };
  const q = encodeURIComponent(`${productNames[brand]} ${shade}`);
  return `https://www.amazon.in/s?k=${q}&tag=roopai03-21`;
}

export function getShadeRecommendation(depthScore: number, undertone: Undertone): ShadeEntry | null {
  const depth = Math.min(10, Math.max(1, Math.round(depthScore)));
  const key = `${depth}-${undertone}`;
  return shadeMap[key] ?? null;
}

export function getDepthLabel(depthScore: number): string {
  if (depthScore <= 2) return 'Fair';
  if (depthScore <= 4) return 'Light';
  if (depthScore <= 6) return 'Wheatish';
  if (depthScore <= 8) return 'Medium Brown';
  return 'Deep';
}

// Missing product catalogue for upsell when element is absent
export const MISSING_PRODUCT_CATALOGUE: Record<string, MissingProduct[]> = {
  concealer: [
    { name: 'Maybelline Fit Me Concealer',           shade_note: 'go 1 shade lighter than foundation', price: '₹299', nykaa: 'https://www.nykaa.com/search/result/?q=maybelline+fit+me+concealer' },
    { name: "L'Oreal Infallible Full Wear Concealer", shade_note: 'match to foundation depth',          price: '₹799', nykaa: 'https://www.nykaa.com/search/result/?q=loreal+infallible+concealer' },
    { name: 'Colorbar Flawless Concealer',           shade_note: 'half shade lighter',                 price: '₹450', nykaa: 'https://www.nykaa.com/search/result/?q=colorbar+flawless+concealer' },
  ],
  blush: [
    { name: 'Lakmé 9to5 Blush',         shade_note: 'coral/peach for Indian skin warm tones',          price: '₹350', nykaa: 'https://www.nykaa.com/search/result/?q=lakme+9to5+blush' },
    { name: 'NYX Powder Blush',          shade_note: 'Pinched or Foreplay work for all Indian tones',  price: '₹850', nykaa: 'https://www.nykaa.com/search/result/?q=nyx+powder+blush' },
    { name: 'Colorbar Cheekillusion',    shade_note: 'nude peach for wheatish skin',                   price: '₹599', nykaa: 'https://www.nykaa.com/search/result/?q=colorbar+cheekillusion+blush' },
  ],
  contour: [
    { name: 'Faces Canada Contour Palette',    shade_note: 'use shade 1 darker than skin tone',       price: '₹499', nykaa: 'https://www.nykaa.com/search/result/?q=faces+canada+contour' },
    { name: 'Lakmé Absolute Sculpt Studio',    shade_note: 'medium for wheatish, deep for tan',        price: '₹625', nykaa: 'https://www.nykaa.com/search/result/?q=lakme+sculpt+studio' },
  ],
  highlighter: [
    { name: 'Nykaa SKINgenius Highlighter', shade_note: 'gold for warm undertones, champagne for cool', price: '₹399', nykaa: 'https://www.nykaa.com/search/result/?q=nykaa+highlighter' },
    { name: 'Colorbar Shimmer Bar',         shade_note: 'gold works on all Indian skin tones',          price: '₹625', nykaa: 'https://www.nykaa.com/search/result/?q=colorbar+shimmer+bar' },
  ],
  eyeshadow: [
    { name: 'Lakmé Eyeconic Palette',  shade_note: 'browns and bronzes suit Indian eyes',  price: '₹499', nykaa: 'https://www.nykaa.com/search/result/?q=lakme+eyeconic+palette' },
    { name: 'Colorbar Eye Shadow',     shade_note: 'warm browns and coppers',               price: '₹549', nykaa: 'https://www.nykaa.com/search/result/?q=colorbar+eyeshadow' },
  ],
  eyeliner: [
    { name: 'Maybelline Hypersharp Liner', shade_note: 'black for definition',      price: '₹299', nykaa: 'https://www.nykaa.com/search/result/?q=maybelline+hypersharp+liner' },
    { name: 'Lakmé Eyeconic Kajal',       shade_note: 'classic Indian kajal look',  price: '₹199', nykaa: 'https://www.nykaa.com/search/result/?q=lakme+eyeconic+kajal' },
  ],
  mascara: [
    { name: 'Maybelline Colossal Mascara', shade_note: 'black, cult favourite in India',         price: '₹349', nykaa: 'https://www.nykaa.com/search/result/?q=maybelline+colossal+mascara' },
    { name: 'Lakmé Eyeconic Mascara',      shade_note: 'volumizing for Indian lash types',       price: '₹399', nykaa: 'https://www.nykaa.com/search/result/?q=lakme+eyeconic+mascara' },
  ],
  lipstick: [
    { name: 'Lakmé 9to5 Matte Lip Color',   shade_note: 'nudes and berries suit Indian skin',             price: '₹270', nykaa: 'https://www.nykaa.com/search/result/?q=lakme+9to5+matte+lip' },
    { name: 'MyGlamm LIT Liquid Matte',      shade_note: 'warm nudes for wheatish, deep berry for tan',    price: '₹350', nykaa: 'https://www.nykaa.com/search/result/?q=myglamm+lit+liquid+matte' },
    { name: 'Colorbar Velvet Matte Lipstick',shade_note: 'coral for warm undertones',                       price: '₹599', nykaa: 'https://www.nykaa.com/search/result/?q=colorbar+velvet+matte+lipstick' },
  ],
  primer: [
    { name: 'Lakmé Absolute Blur Perfect Primer', shade_note: 'universal, works on all Indian skin',    price: '₹475', nykaa: 'https://www.nykaa.com/search/result/?q=lakme+blur+perfect+primer' },
    { name: 'Maybelline Baby Skin Primer',         shade_note: 'lightweight, ideal for humid climate',   price: '₹299', nykaa: 'https://www.nykaa.com/search/result/?q=maybelline+baby+skin+primer' },
  ],
  browFiller: [
    { name: 'Faces Canada Ultime Pro Brow Pencil', shade_note: 'dark brown for black hair, medium for highlighted', price: '₹349', nykaa: 'https://www.nykaa.com/search/result/?q=faces+canada+brow+pencil' },
    { name: 'Lakmé Eyeconic Brow Pencil',          shade_note: 'match to natural brow color',                       price: '₹250', nykaa: 'https://www.nykaa.com/search/result/?q=lakme+eyeconic+brow' },
  ],
};
