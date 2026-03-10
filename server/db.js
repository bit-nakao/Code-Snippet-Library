const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'snippets.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    tags TEXT,
    html_code TEXT,
    css_code TEXT,
    js_code TEXT,
    screenshot_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_snippets_category ON snippets(category);
  CREATE INDEX IF NOT EXISTS idx_snippets_title ON snippets(title);
`);

module.exports = db;
