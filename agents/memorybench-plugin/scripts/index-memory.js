#!/usr/bin/env node

/**
 * Memory Indexer Script
 * Indexes memories for fast retrieval after saving.
 */

const crypto = require('crypto');

function generateEmbeddingId(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

function extractKeywords(content) {
  // Simple keyword extraction
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Count frequency
  const freq = {};
  words.forEach(word => {
    freq[word] = (freq[word] || 0) + 1;
  });
  
  // Return top keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

async function indexMemory(memoryContent) {
  console.log('Indexing memory...');
  
  const index = {
    id: generateEmbeddingId(memoryContent),
    keywords: extractKeywords(memoryContent),
    indexed_at: new Date().toISOString(),
    length: memoryContent.length
  };
  
  console.log('Index created:', JSON.stringify(index, null, 2));
  return index;
}

// Main execution
const content = process.argv[2] || 'Sample memory content';
indexMemory(content);

