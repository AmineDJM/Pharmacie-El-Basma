import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/data';
import { toCardData } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** Lightweight autocomplete endpoint for the smart search bar. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();

  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const results = await searchProducts(q, 6);
  return NextResponse.json(
    {
      products: results.map((p) => {
        const c = toCardData(p);
        return {
          slug: c.slug,
          name: c.name,
          brandName: c.brandName,
          categoryName: c.categoryName,
          price: c.price,
          accent: c.accent,
          imageUrl: c.imageUrl,
        };
      }),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
