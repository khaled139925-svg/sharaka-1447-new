import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['3000-i9xyjg9fsfv2qdhp6bm9i-d47e4446.us1.manus.computer', '3000-idx1lbrxsvr6p6fqomr5c-55e28937.us2.manus.computer', 'localhost', '127.0.0.1'],
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['3000-i9xyjg9fsfv2qdhp6bm9i-d47e4446.us1.manus.computer', '3000-idx1lbrxsvr6p6fqomr5c-55e28937.us2.manus.computer', 'localhost', '127.0.0.1', '.manus.computer'],
  }
})
