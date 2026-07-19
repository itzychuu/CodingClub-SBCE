import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const DB_PATH = path.resolve('data/db.json');
const UPLOADS_DIR = path.resolve('data/uploads');

// Ensure directories exist
async function ensureDirs() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directories:', err);
  }
}

// Read database
async function readDb() {
  try {
    if (!existsSync(DB_PATH)) {
      return null;
    }
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database, using fallback:', err);
    return null;
  }
}

// Write database
async function writeDb(data: any) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

async function startServer() {
  await ensureDirs();

  const app = express();
  
  // Increase payload limit for base64 image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Static serving of uploaded files
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Authentication validation middleware helper
  const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    if (token !== 'admin-session-sbce-coding-club') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    next();
  };

  // --- API ROUTES ---

  // Auth: Login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await readDb();
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    if (email === db.admin.email && password === db.admin.password) {
      return res.json({
        success: true,
        token: 'admin-session-sbce-coding-club',
        email: db.admin.email,
      });
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  });

  // Auth: Check status
  app.get('/api/auth/check', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer admin-session-sbce-coding-club') {
      const db = await readDb();
      return res.json({ authenticated: true, email: db?.admin?.email });
    }
    return res.json({ authenticated: false });
  });

  // Events: GET
  app.get('/api/events', async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });
    res.json(db.events || []);
  });

  // Events: POST (Create)
  app.post('/api/events', requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });

    const newEvent = {
      id: 'e' + Date.now(),
      title: req.body.title || 'Untitled Event',
      description: req.body.description || '',
      banner: req.body.banner || 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop&q=80',
      venue: req.body.venue || '',
      date: req.body.date || '',
      time: req.body.time || '',
      speaker: req.body.speaker || '',
      status: req.body.status || 'Upcoming',
      registration_link: req.body.registration_link || '',
      certificate_link: req.body.certificate_link || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.events = db.events || [];
    db.events.push(newEvent);
    await writeDb(db);
    res.status(201).json(newEvent);
  });

  // Events: PUT (Update)
  app.put('/api/events/:id', requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });

    const { id } = req.params;
    const index = db.events.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updatedEvent = {
      ...db.events[index],
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    db.events[index] = updatedEvent;
    await writeDb(db);
    res.json(updatedEvent);
  });

  // Events: DELETE
  app.delete('/api/events/:id', requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });

    const { id } = req.params;
    db.events = db.events.filter((e: any) => e.id !== id);
    await writeDb(db);
    res.json({ success: true, id });
  });

  // Executive Committee Members: GET
  app.get('/api/members', async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });
    const members = db.members || [];
    members.sort((a: any, b: any) => (a.display_order || 99) - (b.display_order || 99));
    res.json(members);
  });

  // Executive Committee Members: POST
  app.post('/api/members', requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });

    const newMember = {
      id: 'm' + Date.now(),
      name: req.body.name || 'Anonymous',
      position: req.body.position || 'Member',
      bio: req.body.bio || '',
      image: req.body.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
      linkedin: req.body.linkedin || '',
      github: req.body.github || '',
      instagram: req.body.instagram || '',
      email: req.body.email || '',
      display_order: req.body.display_order ? parseInt(req.body.display_order, 10) : 99,
    };

    db.members = db.members || [];
    db.members.push(newMember);
    await writeDb(db);
    res.status(201).json(newMember);
  });

  // Executive Committee Members: PUT
  app.put('/api/members/:id', requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });

    const { id } = req.params;
    const index = db.members.findIndex((m: any) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const updatedMember = {
      ...db.members[index],
      ...req.body,
      display_order: req.body.display_order ? parseInt(req.body.display_order, 10) : db.members[index].display_order,
    };

    db.members[index] = updatedMember;
    await writeDb(db);
    res.json(updatedMember);
  });

  // Executive Committee Members: DELETE
  app.delete('/api/members/:id', requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });

    const { id } = req.params;
    db.members = db.members.filter((m: any) => m.id !== id);
    await writeDb(db);
    res.json({ success: true, id });
  });

  // Gallery: GET
  app.get('/api/gallery', async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });
    res.json(db.gallery || []);
  });

  // Gallery: POST
  app.post('/api/gallery', requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });

    const newPhoto = {
      id: 'g' + Date.now(),
      event_id: req.body.event_id || 'all',
      image_url: req.body.image_url || '',
      caption: req.body.caption || '',
    };

    db.gallery = db.gallery || [];
    db.gallery.push(newPhoto);
    await writeDb(db);
    res.status(201).json(newPhoto);
  });

  // Gallery: DELETE
  app.delete('/api/gallery/:id', requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });

    const { id } = req.params;
    db.gallery = db.gallery.filter((g: any) => g.id !== id);
    await writeDb(db);
    res.json({ success: true, id });
  });

  // Settings: GET
  app.get('/api/settings', async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });
    res.json(db.settings || {});
  });

  // Settings: PUT
  app.put('/api/settings', requireAdmin, async (req, res) => {
    const db = await readDb();
    if (!db) return res.status(500).json({ error: 'DB error' });

    db.settings = {
      ...db.settings,
      ...req.body,
    };

    await writeDb(db);
    res.json(db.settings);
  });

  // Upload endpoint (handles Base64 images)
  app.post('/api/upload', requireAdmin, async (req, res) => {
    try {
      const { name, type, data } = req.body;
      if (!name || !data) {
        return res.status(400).json({ error: 'Missing name or content data' });
      }

      // Strip metadata if present in base64 string
      const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const fileName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      await fs.writeFile(filePath, buffer);
      
      const fileUrl = `/uploads/${fileName}`;
      res.json({ url: fileUrl });
    } catch (err: any) {
      console.error('Upload handling error:', err);
      res.status(500).json({ error: 'Upload failed: ' + err.message });
    }
  });

  // Database Backup Export (Admin only)
  app.get('/api/db/export', requireAdmin, async (req, res) => {
    const db = await readDb();
    res.json(db);
  });

  // Database Backup Import (Admin only)
  app.post('/api/db/import', requireAdmin, async (req, res) => {
    try {
      const { backupData } = req.body;
      if (!backupData || !backupData.admin || !backupData.events) {
        return res.status(400).json({ error: 'Invalid database backup data structure' });
      }
      await writeDb(backupData);
      res.json({ success: true, message: 'Database imported successfully!' });
    } catch (err: any) {
      res.status(500).json({ error: 'Import failed: ' + err.message });
    }
  });

  // --- SERVING ASSETS & ROUTING ---

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    // Development Mode: Vite runs programmatically
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CSE SBCE Coding Club platform server is active on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot failure:', err);
});
