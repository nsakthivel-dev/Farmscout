const fs = require('fs');

async function uploadTestDocument() {
  try {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync('test-document.txt');
    const blob = new Blob([fileBuffer], { type: 'text/plain' });
    formData.append('files', blob, 'test-document.txt');

    const response = await fetch('http://localhost:3001/api/rag/ingest', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('Upload result:', result);
  } catch (error) {
    console.error('Upload error:', error);
  }
}

uploadTestDocument();