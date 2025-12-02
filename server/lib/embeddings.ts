import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize OpenRouter client for embeddings (uses OpenAI-compatible API)
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Optional, for including your app on openrouter.ai rankings
    'X-Title': 'Crop Disease Pest Management System' // Optional, shows in rankings
  }
});

let googleAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
  try {
    googleAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (error: any) {
    console.error('Failed to initialize Gemini AI for embeddings:', error.message);
  }
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  // Try OpenRouter first for embeddings
  try {
    // texts: array of strings
    // returns array of numeric arrays
    const res = await openrouter.embeddings.create({ 
      model: 'text-embedding-3-small', // Using OpenAI's embedding model through OpenRouter
      input: texts 
    });
    return res.data.map(x => x.embedding);
  } catch (openRouterError: any) {
    console.error('Error getting embeddings from OpenRouter:', openRouterError.message);
    
    // Try Gemini as fallback
    if (googleAI) {
      try {
        // Try the correct embedding model
        const modelNames = ['text-embedding-004', 'embedding-001'];
        
        for (const modelName of modelNames) {
          try {
            const model = googleAI.getGenerativeModel({ model: `models/${modelName}` });
            const embeddings = [];
            
            for (const text of texts) {
              const result = await model.embedContent(text);
              embeddings.push(result.embedding.values);
            }
            
            console.log(`Successfully got embeddings from Gemini model: ${modelName}`);
            return embeddings;
          } catch (modelError: any) {
            console.log(`Failed with Gemini embedding model ${modelName}:`, modelError.message);
            // Continue to next model
          }
        }
        
        throw new Error('All Gemini embedding models failed');
      } catch (geminiError: any) {
        console.error('Error getting embeddings from Gemini:', geminiError.message);
      }
    }
    
    // If both fail, return zero vectors as fallback
    // This allows the system to continue functioning with reduced capability
    console.warn('Falling back to zero vectors for embeddings');
    return texts.map(() => Array(768).fill(0)); // Gemini embeddings are 768-dimensional
  }
}