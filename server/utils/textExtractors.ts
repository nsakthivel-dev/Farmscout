import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

export async function extractTextFromFile(buffer: Buffer, filename: string): Promise<{ text: string; pages: any }> {
  try {
    if (filename.endsWith('.pdf')) {
      const data = await (pdfParse as any)(buffer);
      return { text: data.text, pages: null };
    } else if (filename.endsWith('.docx')) {
      // For DOCX files, we need to write to a temporary file first
      const result = await mammoth.extractRawText({ buffer });
      return { text: result.value, pages: null };
    } else {
      // fallback: treat as UTF-8 text
      return { text: buffer.toString('utf8'), pages: null };
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Failed to extract text from ${filename}: ${error instanceof Error ? error.message : String(error)}`);
  }
}