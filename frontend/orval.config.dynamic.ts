import { createOrvalConfig } from '@npl/frontend/orval-config-factory';

// Use the factory function to create orval configuration
export default createOrvalConfig({
  apiClientPath: './src/lib/api-client.ts',
  prettier: true,
});
