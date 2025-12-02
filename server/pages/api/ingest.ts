import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { nanoid } from 'nanoid';
import { extractTextFromFile } from '../../utils/textExtractors';
import { chunkText } from '../../scripts/chunker';
import { getEmbeddings } from '../../lib/embeddings';
import { upsertVectors } from '../../lib/vectorstore';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to handle multipart/form-data
const uploadMiddleware = upload.array('files');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Wrap multer middleware in a promise
  const multerPromise = new Promise((resolve, reject) => {
    uploadMiddleware(req as any, res as any, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });

  try {
    await multerPromise;
    
    const files = (req as any).files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const fileList = Array.isArray(files) ? files : [files];
    const allChunks: Array<{ id: string; text: string; metadata: Record<string, any> }> = [];

    for (const file of fileList) {
      const id = nanoid();
      const buffer = fs.readFileSync(file.path);
      const { text } = await extractTextFromFile(buffer, file.originalname);
      const chunks = chunkText(text, { chunkSize: 800, chunkOverlap: 120 });
      
      // Attach metadata
      const chunksWithMeta = chunks.map((c, i) => ({
        id: `${id}_${i}`,
        text: c,
        metadata: { 
          source: file.originalname, 
          page: null 
        }
      }));
      
      allChunks.push(...chunksWithMeta);
      
      // Clean up uploaded file
      fs.unlinkSync(file.path);
    }

    // Create embeddings in batches
    const texts = allChunks.map(c => c.text);
    const embeddings = await getEmbeddings(texts);
    
    const items = allChunks.map((c, i) => ({
      id: c.id,
      values: embeddings[i],
      metadata: c.metadata,
      text: c.text
    }));

    await upsertVectors(items);
    
    res.json({ 
      ok: true, 
      inserted: items.length,
      message: `Successfully ingested ${items.length} document chunks`
    });
  } catch (error: any) {
    console.error('Ingestion error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to ingest documents',
      message: 'Document ingestion failed'
    });
  }
}