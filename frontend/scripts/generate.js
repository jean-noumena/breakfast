#!/usr/bin/env node
import { generateAll } from '@npl/frontend/generate';

generateAll({
  configFile: './openapi-specs.json',
  specDir: 'openapi',
})
  .then(() => {
    console.log('✅ Generation complete');
  })
  .catch((error) => {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  });