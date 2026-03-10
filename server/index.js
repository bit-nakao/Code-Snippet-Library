const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to update updated_at
const updateSnippetDate = (id) => {
  db.prepare('UPDATE snippets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
};

// API Routes

// GET all snippets (with search and category filter)
app.get('/api/snippets', (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM snippets WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR html_code LIKE ? OR css_code LIKE ? OR js_code LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam, searchParam, searchParam);
  }

  query += ' ORDER BY updated_at DESC';

  try {
    const snippets = db.prepare(query).all(params);
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single snippet
app.get('/api/snippets/:id', (req, res) => {
  try {
    const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(req.params.id);
    if (!snippet) return res.status(404).json({ error: 'Snippet not found' });
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Create snippet
app.post('/api/snippets', (req, res) => {
  const { title, description, category, tags, html_code, css_code, js_code } = req.body;
  
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  const query = `
    INSERT INTO snippets (title, description, category, tags, html_code, css_code, js_code)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const info = db.prepare(query).run(title, description, category, tags, html_code, css_code, js_code);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Update snippet
app.put('/api/snippets/:id', (req, res) => {
  const { title, description, category, tags, html_code, css_code, js_code } = req.body;
  const { id } = req.params;

  const query = `
    UPDATE snippets 
    SET title = ?, description = ?, category = ?, tags = ?, html_code = ?, css_code = ?, js_code = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  try {
    const info = db.prepare(query).run(title, description, category, tags, html_code, css_code, js_code, id);
    if (info.changes === 0) return res.status(404).json({ error: 'Snippet not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE snippet
app.delete('/api/snippets/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM snippets WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Snippet not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET VSCode Snippet JSON
app.get('/api/snippets/export/vscode/:id', (req, res) => {
  try {
    const snippet = db.prepare('SELECT * FROM snippets WHERE id = ?').get(req.params.id);
    if (!snippet) return res.status(404).json({ error: 'Snippet not found' });

    const vscodeSnippet = {
      [snippet.title]: {
        "prefix": snippet.title.toLowerCase().replace(/\s+/g, '-'),
        "body": snippet.html_code.split('\n'),
        "description": snippet.description || snippet.title
      }
    };

    res.json(vscodeSnippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
