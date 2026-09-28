import { NextResponse, type NextRequest } from 'next/server';
import { categoryLabel, search } from '@/lib/products';

export function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.slice(0, 80) ?? '';
  const category = req.nextUrl.searchParams.get('category') || undefined;
  if (q.trim().length < 2) return NextResponse.json([]);
  const { results } = search({ q, category });
  return NextResponse.json(
    results.slice(0, 6).map(p => ({ id: p.id, title: p.title, category: categoryLabel(p.category), thumbnail: p.thumbnail, price: p.price })),
  );
}
