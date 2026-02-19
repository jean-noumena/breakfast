#!/usr/bin/env node
import { generateAll } from '@npl/frontend/generate';

generateAll()
  .then(() => {
    console.log('✅ Generation complete');
  })
  .catch((error) => {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  });