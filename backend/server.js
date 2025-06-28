require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}
process.env.DB_HOST = getLocalIP();

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

// listar todas as tarefas
app.get('/tarefas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Listar tarefa por ID
app.get('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Tarefa não encontrada');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

//atualizar tarefa
app.put('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, data_criacao, data_prevista, data_encerramento, situacao } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tarefas SET descricao = $1, data_criacao = $2, data_prevista = $3, data_encerramento = $4, situacao = $5 WHERE id = $6 RETURNING *',
      [descricao, data_criacao, data_prevista, data_encerramento, situacao, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Tarefa não encontrada');
    }
    res.json({ message: 'Tarefa atualizada com sucesso!', tarefa: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

//apagar tarefa
app.delete('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Tarefa não encontrada');
    }
    res.json({ message: 'Tarefa excluída com sucesso!', tarefa: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

//inserir nova tarefa
app.post('/tarefas', async (req, res) => {
  const { descricao, data_criacao, data_prevista, data_encerramento, situacao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tarefas (descricao, data_criacao, data_prevista, data_encerramento, situacao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [descricao, data_criacao, data_prevista, data_encerramento, situacao]
    );
    console.log(result.rows[0])
    res.json({ message: 'Tarefa criada com sucesso!', tarefa: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

//login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const user = result.rows[0];

    // Verifica se a senha está correta
    if (user.password !== password) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    res.json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

//retorna email do usuario logado
app.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query('SELECT email FROM usuarios WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

const nodemailer = require('nodemailer');

app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };
    console.log(mailOptions)

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ message: 'Erro ao enviar e-mail', error });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;