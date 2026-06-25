import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Render inline **bold** within a text fragment. */
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

/**
 * Minimal, safe Markdown renderer supporting the subset used across the site:
 * ## h2, ### h3, "- " bullet lists, **bold**, and paragraphs.
 */
export function Markdown({ content, className }: { content: string; className?: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      const text = paragraph.join(' ');
      blocks.push(<p key={`p-${blocks.length}`}>{renderInline(text, `p${blocks.length}`)}</p>);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {list.map((item, i) => (
            <li key={i}>
              <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>{renderInline(item, `li${blocks.length}-${i}`)}</span>
            </li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push(<h3 key={`h3-${blocks.length}`}>{renderInline(line.slice(4), `h3${blocks.length}`)}</h3>);
    } else if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push(<h2 key={`h2-${blocks.length}`}>{renderInline(line.slice(3), `h2${blocks.length}`)}</h2>);
    } else if (/^[-•*]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-•*]\s+/, ''));
    } else if (line.trim() === '') {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return <div className={cn('prose-elbasma', className)}>{blocks}</div>;
}
