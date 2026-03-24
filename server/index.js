require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./db');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Parse JSON bodies with a larger limit for Base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Image Upload Endpoint (Base64 JSON)
app.post('/api/upload', async (req, res) => {
  try {
    const { image, filename, contentType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // image is a Data URL like "data:image/png;base64,iVBORw0KGgo..."
    const base64Data = image.includes(',') ? image.split(',')[1] : image;
    if (!base64Data) {
      return res.status(400).json({ error: 'Invalid or missing base64 image data' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const fileExt = path.extname(filename || '.png');
    const newFileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('snippets')
      .upload(newFileName, buffer, {
        contentType: contentType || 'image/png'
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('snippets')
      .getPublicUrl(newFileName);

    res.json({ url: publicUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET all snippets (with search and category filter)
app.get('/api/snippets', async (req, res) => {
  const { search, category } = req.query;
  
  try {
    let query = supabase.from('snippets').select('*').order('updated_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      // Supabaseのilike検索を利用（OR検索機能）
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%,html_code.ilike.%${search}%,css_code.ilike.%${search}%,js_code.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Fetch Snippets Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET single snippet
app.get('/api/snippets/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('snippets')
      .select('*')
      .eq('id', req.params.id)
      .single();
      
    if (error) {
      // データが存在しない場合のエラーハンドリング
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Snippet not found' });
      throw error;
    }
    
    res.json(data);
  } catch (err) {
    console.error('Fetch Snippet Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST Create snippet
app.post('/api/snippets', async (req, res) => {
  const { title, description, category, tags, html_code, css_code, js_code, screenshot_url } = req.body;
  
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  try {
    const { data, error } = await supabase
      .from('snippets')
      .insert([
        { title, description, category, tags, html_code, css_code, js_code, screenshot_url }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ id: data.id });
  } catch (err) {
    console.error('Create Snippet Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT Update snippet
app.put('/api/snippets/:id', async (req, res) => {
  const { title, description, category, tags, html_code, css_code, js_code, screenshot_url } = req.body;
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('snippets')
      .update({ title, description, category, tags, html_code, css_code, js_code, screenshot_url, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Snippet not found' });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Update Snippet Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE snippet
app.delete('/api/snippets/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('snippets')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Snippet Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET VSCode Snippet JSON
app.get('/api/snippets/export/vscode/:id', async (req, res) => {
  try {
    const { data: snippet, error } = await supabase
      .from('snippets')
      .select('*')
      .eq('id', req.params.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Snippet not found' });
      throw error;
    }

    const vscodeSnippet = {
      [snippet.title]: {
        "prefix": snippet.title.toLowerCase().replace(/\s+/g, '-'),
        "body": (snippet.html_code || '').split('\n'),
        "description": snippet.description || snippet.title
      }
    };

    res.json(vscodeSnippet);
  } catch (err) {
    console.error('Export Snippet Error:', err);
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'production' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Vercel Serverless Functionsのためにappをエクスポートする
module.exports = app;
