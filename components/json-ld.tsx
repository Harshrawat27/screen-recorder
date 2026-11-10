// Structured data for search engines (schema.org JSON-LD). Rendered as a plain script tag.
// "<" is escaped so text in the data can never close the script early.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
