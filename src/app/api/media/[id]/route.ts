import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

/** Serve an uploaded image by id (long-cache, immutable). */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await prisma.mediaImage.findUnique({ where: { id } }).catch(() => null);
  if (!media) return new NextResponse('Introuvable', { status: 404 });

  return new NextResponse(new Uint8Array(media.data), {
    headers: {
      'Content-Type': media.contentType,
      'Content-Length': String(media.size || media.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
