/** Render a JSON-LD structured-data block. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated server-side from trusted content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
