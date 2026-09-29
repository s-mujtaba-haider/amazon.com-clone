import 'server-only';
import raw from '../../data/products.json';
import type { Product } from './types';

const products = raw as Product[];

export const CATEGORY_LABELS: Record<string, string> = {
  beauty: 'Beauty',
  fragrances: 'Fragrances',
  furniture: 'Furniture',
  groceries: 'Grocery',
  'home-decoration': 'Home Décor',
  'kitchen-accessories': 'Kitchen',
  laptops: 'Laptops',
  'mens-shirts': "Men's Shirts",
  'mens-shoes': "Men's Shoes",
  'mens-watches': "Men's Watches",
  'mobile-accessories': 'Mobile Accessories',
  motorcycle: 'Motorcycles',
  'skin-care': 'Skin Care',
  smartphones: 'Smartphones',
  'sports-accessories': 'Sports & Outdoors',
  sunglasses: 'Sunglasses',
  tablets: 'Tablets',
  tops: "Women's Tops",
  vehicle: 'Automotive',
  'womens-bags': "Women's Bags",
  'womens-dresses': "Women's Dresses",
  'womens-jewellery': 'Jewelry',
  'womens-shoes': "Women's Shoes",
  'womens-watches': "Women's Watches",
};

export const categories = Object.keys(CATEGORY_LABELS);

export function categoryLabel(slug: string) {
  return CATEGORY_LABELS[slug] ?? slug;
}

export function getProduct(id: number) {
  return products.find(p => p.id === id) ?? null;
}

export function getProducts(ids: number[]) {
  return ids.map(getProduct).filter((p): p is Product => p !== null);
}

export function byCategory(category: string, limit = 12) {
  return products.filter(p => p.category === category).slice(0, limit);
}

export function topDeals(limit = 12) {
  return [...products].sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, limit);
}

export function bestSellers(limit = 12) {
  return [...products].sort((a, b) => b.rating * b.reviews.length - a.rating * a.reviews.length || b.rating - a.rating).slice(0, limit);
}

/** Most-stocked brands, for the brand ticker. */
export function brands(limit = 20) {
  const counts = new Map<string, number>();
  for (const p of products) if (p.brand) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([b]) => b);
}

/** Real catalog figures for the home page stats band. */
export function catalogStats() {
  const brandCount = new Set(products.map(p => p.brand).filter(Boolean)).size;
  const reviews = products.reduce((n, p) => n + p.reviews.length, 0);
  const avgRating = products.reduce((n, p) => n + p.rating, 0) / products.length;
  return { products: products.length, brands: brandCount, categories: categories.length, reviews, avgRating };
}

export function related(p: Product, limit = 10) {
  const same = products.filter(x => x.category === p.category && x.id !== p.id);
  const tagged = products.filter(x => x.category !== p.category && x.tags.some(t => p.tags.includes(t)));
  return [...same, ...tagged].slice(0, limit);
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

export type SearchParams = {
  q?: string;
  category?: string;
  min?: number;
  max?: number;
  rating?: number;
  brand?: string;
  deals?: boolean;
  sort?: SortKey;
};

function score(p: Product, terms: string[]) {
  const title = p.title.toLowerCase();
  const hay = `${title} ${p.brand ?? ''} ${p.category} ${categoryLabel(p.category)} ${p.tags.join(' ')} ${p.description}`.toLowerCase();
  let s = 0;
  for (const t of terms) {
    if (!hay.includes(t)) return 0;
    s += title.includes(t) ? 3 : 1;
  }
  return s;
}

/** Filters/sorts the catalog. Facets (brands, categories) are computed before the brand/price filters so they stay useful. */
export function search(params: SearchParams) {
  const terms = (params.q ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  let list = products.map(p => ({ p, s: terms.length ? score(p, terms) : 1 })).filter(x => x.s > 0);
  if (params.category) list = list.filter(x => x.p.category === params.category);

  const categoryCounts = new Map<string, number>();
  const brandCounts = new Map<string, number>();
  for (const { p } of list) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
    if (p.brand) brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
  }

  if (params.brand) list = list.filter(x => x.p.brand === params.brand);
  if (params.min != null) list = list.filter(x => x.p.price >= params.min!);
  if (params.max != null) list = list.filter(x => x.p.price <= params.max!);
  if (params.rating) list = list.filter(x => x.p.rating >= params.rating!);
  if (params.deals) list = list.filter(x => x.p.discountPercentage >= 10);

  const cmp: Record<SortKey, (a: { p: Product; s: number }, b: { p: Product; s: number }) => number> = {
    featured: (a, b) => b.s - a.s || b.p.rating - a.p.rating,
    'price-asc': (a, b) => a.p.price - b.p.price,
    'price-desc': (a, b) => b.p.price - a.p.price,
    rating: (a, b) => b.p.rating - a.p.rating,
    discount: (a, b) => b.p.discountPercentage - a.p.discountPercentage,
  };
  list.sort(cmp[params.sort ?? 'featured']);

  return {
    results: list.map(x => x.p),
    categories: [...categoryCounts].sort((a, b) => b[1] - a[1]),
    brands: [...brandCounts].sort((a, b) => b[1] - a[1]).slice(0, 12),
  };
}
