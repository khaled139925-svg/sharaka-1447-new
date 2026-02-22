import express from 'express';
import path from 'path';
import fs from 'fs';
import { setupUploadRoutes } from './upload';

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(process.cwd(), 'dist');

// Middleware
app.use(express.json());
app.use(express.static(DIST_DIR));
app.use(express.static(path.join(process.cwd(), 'public')));

// Setup upload routes
setupUploadRoutes(app);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SPA fallback - serve index.html for all other routes
app.get('/', (req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found');
  }
});

// Catch-all for SPA routing
app.use((req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`[OAuth] Initialized with baseURL: https://api.manus.im`);
  console.log(`Server running on http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
