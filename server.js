import express from 'express';
import Database from '@replit/database';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const db = new Database();

app.use(express.json({ limit: '5mb' }));
app.use(express.static(join(__dirname, 'dist')));

// GET key — db.get returns { ok, value } or { ok: false, error }
app.get('/api/storage/:key', async (req, res) => {
  try {
    const result = await db.get(req.params.key);
    if (!result.ok || result.value === null || result.value === undefined) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ key: req.params.key, value: result.value });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// SET key — db.set returns { ok } or { ok: false, error }
app.post('/api/storage/:key', async (req, res) => {
  try {
    const result = await db.set(req.params.key, req.body.value);
    if (!result.ok) return res.status(500).json({ error: result.error });
    res.json({ key: req.params.key, value: req.body.value });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE key
app.delete('/api/storage/:key', async (req, res) => {
  try {
    const result = await db.delete(req.params.key);
    if (!result.ok) return res.status(500).json({ error: result.error });
    res.json({ key: req.params.key, deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// LIST keys by prefix — db.list returns { ok, value: [...] }
app.get('/api/storage', async (req, res) => {
  try {
    const result = await db.list(req.query.prefix || '');
    if (!result.ok) return res.status(500).json({ error: result.error });
    res.json({ keys: result.value });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// SPA fallback
app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server on :${PORT}`));
