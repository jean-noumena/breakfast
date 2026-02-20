#!/usr/bin/env node
import { discoverOpenapiSpecs } from '@npl/frontend/discover';

discoverOpenapiSpecs({
  specDir: 'openapi',
  // root: "openapi",
  // configFile: './openapi/openapi-specs.json',
})
  .then(() => {
    console.log('✅ Discovery complete');
  })
  .catch((error) => {
    console.error('❌ Discovery failed:', error);
    process.exit(1);
  });