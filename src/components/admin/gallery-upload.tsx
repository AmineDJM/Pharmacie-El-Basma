'use client';

import { useRef, useState } from 'react';
import { UploadCloud, Loader2, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Multi-image uploader. Each file is sent to /api/admin/upload (resized &
 * optimised to WebP server-side); the ordered list of URLs is submitted as a
 * JSON array under `name`. The first image is the cover.
 */
export function GalleryUpload({
  name,
  defaultValue = [],
  max = 8,
}: {
  name: string;
  defaultValue?: string[];
  max?: number;
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue.filter(Boolean));
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File): Promise<string | null> {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Échec du téléversement');
    return data.url as string;
  }

  async function handleFiles(files: FileList | File[]) {
    setError('');
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const room = max - urls.length;
    if (room <= 0) {
      setError(`Maximum ${max} images.`);
      return;
    }
    const toUpload = list.slice(0, room);
    if (list.length > room) setError(`Vous pouvez ajouter au maximum ${max} images.`);
    setUploading((u) => u + toUpload.length);
    for (const file of toUpload) {
      try {
        const url = await uploadOne(file);
        if (url) setUrls((prev) => [...prev, url]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setUploading((u) => u - 1);
      }
    }
  }

  const remove = (i: number) => setUrls((prev) => prev.filter((_, idx) => idx !== i));
  const makeCover = (i: number) =>
    setUrls((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(i, 1);
      return [item, ...copy];
    });

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors',
          drag ? 'border-primary bg-primary-50 dark:bg-primary-100' : 'border-border bg-secondary/30 hover:border-primary/40',
        )}
      >
        <UploadCloud className="h-7 w-7 text-primary" />
        <p className="text-sm font-medium text-foreground">Glissez vos images ici ou cliquez pour téléverser</p>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP, GIF ou AVIF — jusqu’à 10 Mo. {max} images max. La 1ʳᵉ image sert de couverture.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {uploading > 0 && (
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Téléversement de {uploading} image(s)…
        </p>
      )}
      {error && <p className="text-xs text-rose-600">{error}</p>}

      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute start-1.5 top-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[0.6rem] font-bold text-primary-foreground">
                  Couverture
                </span>
              )}
              <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/55 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {i !== 0 ? (
                  <button type="button" onClick={() => makeCover(i)} title="Définir comme couverture" className="rounded-md bg-white/90 p-1 text-foreground hover:bg-white">
                    <Star className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" onClick={() => remove(i)} title="Retirer" className="rounded-md bg-white/90 p-1 text-rose-600 hover:bg-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
