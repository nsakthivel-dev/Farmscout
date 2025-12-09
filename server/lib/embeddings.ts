import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Defer initialization of clients until they're actually needed
let openrouter: OpenAI | null = null;
let googleAI: GoogleGenerativeAI | null = null;

function initializeOpenRouter() {
  if (!openrouter) {
    console.log('Initializing OpenRouter client');
    console.log('OPENROUTER_API_KEY present:', !!process.env.OPENROUTER_API_KEY);
    if (process.env.OPENROUTER_API_KEY) {
      console.log('OPENROUTER_API_KEY length:', process.env.OPENROUTER_API_KEY.length);
    }
    
    // Validate API key before initializing
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.length < 10) {
      console.warn('Invalid or missing OPENROUTER_API_KEY');
      return null;
    }
    
    openrouter = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000', // Optional, for including your app on openrouter.ai rankings
        'X-Title': 'Crop Disease Pest Management System' // Optional, shows in rankings
      }
    });
  }
  return openrouter;
}

function initializeGoogleAI() {
  if (!googleAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      console.log('Initializing Google AI client for embeddings');
      googleAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log('Google AI client initialized successfully');
    } catch (error: any) {
      console.error('Failed to initialize Gemini AI for embeddings:', error.message);
    }
  }
  return googleAI;
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  console.log(`Generating embeddings for ${texts.length} texts`);
  
  // Initialize clients when needed
  const openrouterClient = initializeOpenRouter();
  const googleAIClient = initializeGoogleAI();
  
  // Try OpenRouter first for embeddings
  if (openrouterClient) {
    try {
      console.log('Attempting to get embeddings from OpenRouter');
      
      // texts: array of strings
      // returns array of numeric arrays
      const res = await openrouterClient.embeddings.create({ 
        model: 'openai/text-embedding-3-small', // Using OpenAI's embedding model through OpenRouter (1536 dimensions)
        input: texts 
      });
      
      if (res && res.data && res.data.length > 0) {
        console.log(`Successfully got ${res.data.length} embeddings from OpenRouter`);
        const embeddings = res.data.map(x => x.embedding);
        
        // Validate embeddings
        if (embeddings.some(emb => emb.length === 0)) {
          throw new Error('Received empty embeddings from OpenRouter');
        }
        
        return embeddings;
      } else {
        throw new Error('Received empty response from OpenRouter embeddings API');
      }
    } catch (openRouterError: any) {
      console.error('Error getting embeddings from OpenRouter:', openRouterError.message);
      console.error('OpenRouter error details:', JSON.stringify(openRouterError, null, 2));
    }
  } else {
    console.log('OpenRouter client not available, skipping');
  }
  
  // Try Gemini as fallback - use a model that produces consistent dimensions
  if (googleAIClient) {
    try {
      console.log('Attempting to get embeddings from Gemini');
      // Use text-embedding-004 which produces 768-dimensional embeddings
      // But to maintain consistency with OpenRouter, we'll use a different approach
      // For now, let's stick with OpenRouter as primary and only use Gemini for chat
      console.log('Skipping Gemini for embeddings to maintain dimension consistency');
    } catch (geminiError: any) {
      console.error('Error getting embeddings from Gemini:', geminiError.message);
    }
  } else {
    console.log('Gemini client not available, skipping');
  }
  
  // If both fail, throw an error instead of returning zero vectors
  console.error('Both OpenRouter and Gemini embedding services failed');
  throw new Error('Unable to generate embeddings: Both OpenRouter and Gemini services are unavailable');
}