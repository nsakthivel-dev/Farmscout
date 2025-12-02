import { Request, Response } from 'express';
import { getEmbeddings } from '../../lib/embeddings';
import { queryVectors } from '../../lib/vectorstore';
import { generateAnswer } from '../../lib/retriever';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { query, topK = 5 } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }
  
  try {
    const qEmb = await getEmbeddings([query]);
    
    // Check if we got embeddings successfully
    if (!qEmb || qEmb.length === 0) {
      throw new Error('Failed to generate embeddings for the query');
    }
    
    const nearest = await queryVectors(qEmb[0], topK);
    
    // nearest: [{ id, score, metadata, text }]
    const answerObj = await generateAnswer(query, nearest);
    
    res.json(answerObj);
  } catch (error: any) {
    console.error('QA error:', error);
    
    // Provide more specific error messages based on the type of error
    let userMessage = "Sorry, I'm having trouble answering your question right now.";
    
    if (error.message && error.message.includes('quota')) {
      userMessage = 'The AI service is temporarily unavailable due to usage limits. Please try again later or ask a different question.';
    } else if (error.message && error.message.includes('API key')) {
      userMessage = 'The AI service is not properly configured. Please contact the administrator.';
    } else if (error.message) {
      userMessage = `I encountered an issue: ${error.message}`;
    }
    
    res.status(500).json({ 
      error: error.message || 'Failed to generate answer',
      message: userMessage
    });
  }
}