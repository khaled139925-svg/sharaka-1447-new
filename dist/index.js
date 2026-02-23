#!/usr/bin/env node
/**
 * Server entry point for Manus deployment
 * Runs the Express server from server/_core/index.ts
 */

// Load TypeScript support
import('tsx/esm').then(tsx => {
  tsx.register();
  // Import and run the server
  import('../server/_core/index.ts').catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('Failed to load tsx:', err);
  process.exit(1);
});
