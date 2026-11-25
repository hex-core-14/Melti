// app/config/productsConfig.ts

export type FlavorCategory = 'all' | 'sachet' | 'family';

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  category: Exclude<FlavorCategory, 'all'>;
  cocoaPercent: string;
  packSize: string;
  weightGrams: number;
  servings: string;
  badge: string;
  accentColor: string;
  labelTint: string;
  price: number;
  price20g: number;
  price200g: number;
  description: string;
  tastingNotes: string[];
  sensory: {
    richness: number; // 0 to 100
    sweetness: number;
    roast: number;
  };
  origin: string;
  ritualTip: string;
  imageUrl: string;
}

export const FLAVOR_FILTERS: { id: FlavorCategory; label: string }[] = [
  { id: 'all', label: 'All Packs' },
  { id: 'sachet', label: '20g Single Sachet (₹32)' },
  { id: 'family', label: '200g Family Pack (₹256)' },
];

export const MELTI_PRODUCTS: ProductItem[] = [
  {
    id: 'classic-sachet-20g',
    slug: 'classic-hot-chocolate-20g-sachet',
    name: 'Classic Hot Chocolate — 20g Sachet',
    shortName: '20g Single Sachet',
    tagline: '35% Real Cocoa • Single-Serve Comfort Pour',
    category: 'sachet',
    cocoaPercent: '35%',
    packSize: '20g Sachet',
    weightGrams: 20,
    servings: '1 Mug (180ml)',
    badge: 'Try Single Pour',
    accentColor: '#C86D51',
    labelTint: '#F9EBDD',
    price: 32,
    price20g: 32,
    price200g: 256,
    description:
      'One pre-measured 20g pouch of MÈLTI 35% real cocoa couverture blend. Whisk into hot milk for a velvety, café-style mug in 30 seconds with zero measuring mess.',
    tastingNotes: ['Creamy Milk Cocoa', 'Warm Vanilla', 'Velvet Finish'],
    sensory: { richness: 82, sweetness: 64, roast: 58 },
    origin: 'South Indian Estate Cocoa',
    ritualTip:
      'Empty one 20g sachet into 180ml hot milk (70°C), whisk briskly for 30 seconds until glossy, and sip warm.',
    imageUrl: '/image20gm.png',
  },
  {
    id: 'classic-family-200g',
    slug: 'classic-hot-chocolate-200g-family-pack',
    name: 'Classic Hot Chocolate — 200g Family Pack',
    shortName: '200g Family Pack',
    tagline: '35% Real Cocoa • 10-Mug Value Stash (Save 20%)',
    category: 'family',
    cocoaPercent: '35%',
    packSize: '200g Family Pack',
    weightGrams: 200,
    servings: '10 Mugs (180ml each)',
    badge: 'Best Value • Save ₹64',
    accentColor: '#D4A373',
    labelTint: '#F9EBDD',
    price: 256,
    price20g: 32,
    price200g: 256,
    description:
      'Our signature 35% cocoa classic blend in a resealable 200g family pack—crafted for late-night study sessions, family rituals, and thick dessert pours at ₹25.6 per cup.',
    tastingNotes: ['Silky 35% Cocoa', 'Toasted Caramel', 'Rich Creaminess'],
    sensory: { richness: 85, sweetness: 64, roast: 60 },
    origin: 'South Indian Estate Cocoa',
    ritualTip:
      'Scoop 2 heaped tablespoons (20g) into 180ml warm milk for a classic pour, or 3 spoons for extra-thick sipping chocolate.',
    imageUrl: '/image200gm.png',
  },
];

export function getProductBySlug(slug: string): ProductItem | undefined {
  return MELTI_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}