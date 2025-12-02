export function chunkText(text: string, options: { chunkSize?: number; chunkOverlap?: number } = {}): string[] {
  const { chunkSize = 800, chunkOverlap = 120 } = options;
  const out: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    out.push(text.slice(start, end));
    start = end - chunkOverlap;
    if (start < 0) start = 0;
  }
  
  return out;
}