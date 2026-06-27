'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useLocale } from '@/i18n/provider';
import { tField } from '@/lib/localize';
import { cn } from '@/lib/utils';

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  category?: string;
  translations?: unknown;
}

export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const locale = useLocale();

  return (
    <div className={cn('divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const question = tField({ translations: item.translations }, locale, 'question', item.question);
        const answer = tField({ translations: item.translations }, locale, 'answer', item.answer);
        return (
          <div key={item.id ?? i}>
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/50 sm:px-6"
              >
                <span className="font-semibold text-foreground">{question}</span>
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary transition-transform dark:bg-primary-100',
                    isOpen && 'rotate-45',
                  )}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-pretty leading-relaxed text-muted-foreground sm:px-6">{answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
