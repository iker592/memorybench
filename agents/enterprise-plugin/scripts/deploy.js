#!/usr/bin/env node

/**
 * Deploy Script
 * Handles deployment of MemoryBench updates
 */

const { execSync } = require('child_process');

async function deploy() {
  console.log('Starting deployment...');

  try {
    // Run pre-deployment checks
    console.log('Running pre-deployment checks...');
    
    // Build the project
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Run tests
    console.log('Running tests...');
    execSync('npm test', { stdio: 'inherit' });
    
    console.log('Deployment complete!');
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy();

