const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));  // ← ALLOWS ALL ORIGINS (fixes CORS)
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create table
pool.query(`
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    person VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`).catch(console.error);

// === ROUTES ===
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

app.post('/items', async (req, res) => {
  const { person, description } = req.body;
  if (!person || !description) return res.status(400).json({ error: 'Missing' });
  try {
    const result = await pool.query(
      'INSERT INTO items (person, description) VALUES ($1, $2) RETURNING *',
      [person, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Insert failed' });
  }
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Required' });
  try {
    const result = await pool.query(
      'UPDATE items SET description = $1 WHERE id = $2 RETURNING *',
      [description, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
