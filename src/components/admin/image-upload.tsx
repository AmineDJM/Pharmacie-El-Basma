'use client';

import { useRef, useState } from 'react';
import { UploadCloud, Loader2, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Image uploader: sends the file to /api/admin/upload (server resizes &
 * optimises to WebP), then stores the returned URL in a hidden input so it is
 * submitted with the form under `name`.
 */
export function ImageUpload({
  name,
  defaultValue,
  label = 'Image',
  hint = 'JPG, PNG ou WebP — redimensionnée automatiquement.',
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec du téléversement');
      setUrl(data.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="flex items-start gap-4">
        <div className={cn('relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary/40')}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Aperçu" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-7 w-7 text-muted-foreground" />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/70">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600 disabled:opacity-60"
            >
              <UploadCloud className="h-4 w-4" /> {url ? 'Changer l’image' : 'Téléverser une image'}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                <X className="h-4 w-4" /> Retirer
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = '';
            }}
          />
          <p className="text-xs text-muted-foreground">{hint}</p>
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="…ou collez une URL d’image"
            className="mt-1 h-9 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
