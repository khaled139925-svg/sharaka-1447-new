import express from 'express';
import path from 'path';
import fs from 'fs';
import { setupUploadRoutes } from './upload';
import { scrapeStoreFromUrl } from './scrapeStore';
import { cloneFullWebsite, getClonedSite } from './fullSiteClone';

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

// API لاستنساخ الموقع
app.post('/api/scrape-store', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'يرجى إدخال رابط الموقع' });
    }

    const store = await scrapeStoreFromUrl(url);
    res.json({ success: true, store });
  } catch (error) {
    console.error('خطأ في استنساخ الموقع:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'خطأ في استنساخ الموقع'
    });
  }
});

// API لنسخ الموقع كاملاً
app.post('/api/clone-full-site', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'يرجى إدخال رابط الموقع' });
    }

    const clonedSite = await cloneFullWebsite(url);
    res.json({ success: true, siteId: clonedSite.id, site: clonedSite });
  } catch (error) {
    console.error('خطأ في نسخ الموقع:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'خطأ في نسخ الموقع'
    });
  }
});

// API للحصول على الموقع المستنسخ
app.get('/api/cloned-site/:siteId', (req, res) => {
  const { siteId } = req.params;
  const site = getClonedSite(siteId);
  
  if (!site) {
    return res.status(404).json({ error: 'الموقع غير موجود' });
  }
  
  res.json({ success: true, site });
});

// SPA fallback - serve index.html for all other routes
// يجب أن يكون هذا آخر route
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
