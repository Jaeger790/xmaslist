const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'dpg-d4d02k4hg0os73daf5rg-a',
  port: 5432,
  database: 'xmaslist_jlbp',
  user: 'brit',
  password: '6G4bKPZVrGJpQ3YcUKwNcSUk0WFVblI8',
  ssl: { rejectUnauthorized: false }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    person VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`).catch(console.error);

// Routes: GET /items, POST /items, PUT /items/:id, DELETE /items/:id
// (Same as previous response – copy-paste)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on ${PORT}`));
