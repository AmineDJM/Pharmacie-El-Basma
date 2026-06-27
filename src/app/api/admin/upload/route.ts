import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 10 * 1024 * 1024; // 10 Mo
const MAX_DIM = 1280; // redimensionnement automatique

/** Auth-guarded image upload: resize + optimise (WebP) + store in DB. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  let file: File | null = null;
  try {
    const form = await request.formData();
    file = form.get('file') as File | null;
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  if (!file || typeof file.arrayBuffer !== 'function') {
    return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image trop volumineuse (max 10 Mo)' }, { status: 400 });
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const { data, info } = await sharp(input)
      .rotate() // respecte l'orientation EXIF
      .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });

    const media = await prisma.mediaImage.create({
      data: {
        data: new Uint8Array(data),
        contentType: 'image/webp',
        width: info.width ?? 0,
        height: info.height ?? 0,
        size: data.length,
        alt: deriveAlt(file.name) || null,
      },
    });

    return NextResponse.json({
      url: `/api/media/${media.id}`,
      width: media.width,
      height: media.height,
      size: media.size,
    });
  } catch {
    return NextResponse.json({ error: 'Le traitement de l’image a échoué' }, { status: 500 });
  }
}

function deriveAlt(name: string): string {
  return name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim().slice(0, 120);
}
