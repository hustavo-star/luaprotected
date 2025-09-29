// Simple Pastebin-style server (Node/Express)
// Usage: npm install && node server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const STORAGE_DIR = path.join(__dirname, 'pastes');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));

// Serve frontend files (index.html etc.)
app.use('/', express.static(path.join(__dirname, 'web')));

// Create a paste - expects form field "code" (raw Lua)
app.post('/paste', (req, res) => {
  const code = (req.body.code || '').toString();
  if (!code.trim()) return res.status(400).json({ error: 'empty code' });

  const id = Date.now().toString() + '-' + crypto.randomBytes(8).toString('hex');
  const filename = id + '.lua';
  const filepath = path.join(STORAGE_DIR, filename);

  // sanitize: ensure it's a plain text file
  fs.writeFile(filepath, code, { encoding: 'utf8' }, (err) => {
    if (err) return res.status(500).json({ error: 'failed to write' });
    // Return the public URL (assumes the server is reachable at the request's host)
    const host = req.get('host');
    const proto = req.protocol;
    const rawUrl = `${proto}://${host}/pastes/${filename}`;
    const downloadUrl = `${proto}://${host}/download/${filename}`;
    res.json({ id, filename, raw: rawUrl, download: downloadUrl });
  });
});

// Serve raw paste
app.get('/pastes/:file', (req, res) => {
  const f = path.basename(req.params.file);
  const p = path.join(STORAGE_DIR, f);
  if (!fs.existsSync(p)) return res.status(404).send('Not found');
  res.type('text/plain; charset=utf-8');
  res.sendFile(p);
});

// Serve as attachment (download)
app.get('/download/:file', (req, res) => {
  const f = path.basename(req.params.file);
  const p = path.join(STORAGE_DIR, f);
  if (!fs.existsSync(p)) return res.status(404).send('Not found');
  res.download(p, f);
});

app.listen(PORT, () => {
  console.log(`Paste server running on http://localhost:${PORT}`);
});