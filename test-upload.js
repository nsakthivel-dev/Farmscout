// Simple test to verify our fixes work
console.log('Testing the RAG system fixes...');

// First, let's check if the health endpoint works
fetch('http://localhost:3001/api/rag/health')
  .then(response => response.json())
  .then(data => {
    console.log('Health check:', data);
    
    if (data.ok) {
      console.log('✅ Server is healthy');
    } else {
      console.log('❌ Server health check failed');
    }
  })
  .catch(error => {
    console.error('Health check error:', error);
  });