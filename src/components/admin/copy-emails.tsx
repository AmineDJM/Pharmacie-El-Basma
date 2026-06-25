'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyEmails({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(emails.join(', ')).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      disabled={emails.length === 0}
      className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
    >
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copié !' : 'Copier les e-mails'}
    </button>
  );
}
