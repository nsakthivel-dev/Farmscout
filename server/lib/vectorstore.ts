// Simple in-memory vector store for development
// In production, you would replace this with Pinecone, Chroma, or another vector database

interface VectorItem {
  id: string;
  values: number[];
  metadata: Record<string, any>;
  text: string;
}

// In-memory storage
let vectorStore: VectorItem[] = [];

export async function upsertVectors(items: VectorItem[]): Promise<void> {
  try {
    // For simplicity, we're just replacing items with the same ID
    // In a real implementation, you'd want to properly upsert
    for (const item of items) {
      const existingIndex = vectorStore.findIndex(v => v.id === item.id);
      if (existingIndex >= 0) {
        vectorStore[existingIndex] = item;
      } else {
        vectorStore.push(item);
      }
    }
    
    console.log(`Upserted ${items.length} vectors. Total vectors: ${vectorStore.length}`);
  } catch (error) {
    console.error('Error upserting vectors:', error);
    throw new Error(`Failed to upsert vectors: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Simple cosine similarity calculation
function cosineSimilarity(a: number[], b: number[]): number {
  // Handle edge cases
  if (!a || !b || a.length === 0 || b.length === 0) {
    return 0;
  }
  
  if (a.length !== b.length) {
    console.warn('Vectors have different lengths:', a.length, b.length);
    // Use the minimum length to avoid errors
    const minLength = Math.min(a.length, b.length);
    a = a.slice(0, minLength);
    b = b.slice(0, minLength);
  }
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function queryVectors(embedding: number[], topK: number = 5): Promise<Array<{ id: string; score: number; metadata: Record<string, any>; text: string }>> {
  try {
    // Handle case when vector store is empty
    if (vectorStore.length === 0) {
      return [];
    }
    
    // Calculate similarity scores for all vectors
    const similarities = vectorStore.map(item => ({
      item,
      score: cosineSimilarity(embedding, item.values)
    }));
    
    // Sort by score descending and take topK
    similarities.sort((a, b) => b.score - a.score);
    const topMatches = similarities.slice(0, topK);
    
    // Return the formatted results
    return topMatches.map(({ item, score }) => ({
      id: item.id,
      score,
      metadata: item.metadata,
      text: item.text
    }));
  } catch (error) {
    console.error('Error querying vectors:', error);
    throw new Error(`Failed to query vectors: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Utility function to clear the vector store (useful for testing)
export function clearVectorStore(): void {
  vectorStore = [];
}