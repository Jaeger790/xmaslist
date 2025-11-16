const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));  // ← FIXES CORS
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
    description TEXT NOT NULL
  )
`).catch(console.error);

// Routes
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('DB error');
  }
});

app.post('/items', async (req, res) => {
  const { person, description } = req.body;
  if (!person || !description) return res.status(400).send('Missing');
  try {
    const result = await pool.query(
      'INSERT INTO items (person, description) VALUES ($1, $2) RETURNING *',
      [person, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Insert failed');
  }
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  if (!description) return res.status(400).send('Required');
  try {
    const result = await pool.query(
      'UPDATE items SET description = $1 WHERE id = $2 RETURNING *',
      [description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Update failed');
  }
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM items WHERE id = $1', [id]);
  res.json({ success: true });
});

app.listen(process.env.PORT || 3000, () => console.log('API live'));
