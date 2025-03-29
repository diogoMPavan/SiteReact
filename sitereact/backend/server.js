require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000; // Porta 

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
console.log(process.env.DB_PASS)

app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Erro ao conectar no banco:', err);
    } else {
      console.log('Conexão bem-sucedida! Hora atual do DB:', res.rows[0]);
    }
  });

app.get('/tarefas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
