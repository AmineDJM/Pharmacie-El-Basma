'use client';

import { Field, Input, Textarea } from '@/components/admin/ui';

const LOCALES = [
  { code: 'en', label: 'English', rtl: false },
  { code: 'ar', label: 'العربية', rtl: true },
] as const;

interface TrField {
  name: string;
  label: string;
  textarea?: boolean;
  rows?: number;
}

/**
 * Renders English + Arabic inputs for the given fields. Values submit under
 * `tr_<locale>_<field>` and are merged into the record's `translations` JSON.
 */
export function TranslationFields({ fields, value }: { fields: TrField[]; value?: unknown }) {
  const tr = (value as Record<string, Record<string, string>>) || {};
  return (
    <div className="space-y-6">
      {LOCALES.map((loc) => (
        <div key={loc.code} className="rounded-xl border border-border bg-secondary/30 p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">{loc.label}</p>
          <div className="space-y-3" dir={loc.rtl ? 'rtl' : 'ltr'}>
            {fields.map((f) => (
              <Field key={f.name} label={f.label}>
                {f.textarea ? (
                  <Textarea name={`tr_${loc.code}_${f.name}`} rows={f.rows ?? 3} defaultValue={tr?.[loc.code]?.[f.name] ?? ''} />
                ) : (
                  <Input name={`tr_${loc.code}_${f.name}`} defaultValue={tr?.[loc.code]?.[f.name] ?? ''} />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
