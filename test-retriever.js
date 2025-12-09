import { generateAnswer } from './server/lib/retriever.ts';

async function testRetriever() {
  console.log('Testing AI model timeout handling...');
  
  try {
    // Test with sample documents
    const sampleDocs = [
      {
        id: 'doc_1',
        score: 0.8,
        metadata: { source: 'test.txt' },
        text: 'Tomato blight is a common fungal disease that affects tomato plants. To prevent blight: 1. Water at the base of plants, not on leaves. 2. Space plants adequately for air circulation.'
      }
    ];
    
    const question = "How do I prevent tomato blight?";
    
    console.log('Generating answer with timeout handling...');
    const result = await generateAnswer(question, sampleDocs);
    
    console.log('Answer generation result:');
    console.log('Answer length:', result.answer?.length || 0);
    console.log('Sources:', result.sources?.length || 0);
    
    if (result.answer && result.answer.length > 0) {
      console.log('✅ Answer generated successfully');
      console.log('Answer preview:', result.answer.substring(0, 100) + '...');
    } else {
      console.log('❌ Failed to generate answer');
    }
    
  } catch (error) {
    console.error('Error testing retriever:', error);
  }
}

testRetriever();