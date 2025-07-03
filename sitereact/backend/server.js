require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5000;

const startServer = async () => {
  const maxRetries = 10;
  let retries = 0;
  let pool;

  while (retries < maxRetries) {
    try {
      pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
      });

      await pool.query('SELECT NOW()');
      console.log('✅ Conexão com o banco estabelecida!');
      break;
    } catch (err) {
      retries++;
      console.error(`❌ Tentativa ${retries} - Erro ao conectar no banco: ${err.message}`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  if (retries === maxRetries) {
    console.error('❌ Não foi possível conectar ao banco após várias tentativas. Encerrando.');
    process.exit(1);
  }

  // Configurações do Express
  app.use(cors());
  app.use(express.json());
  app.locals.pool = pool;

  // Rotas

  app.get('/tarefas', async (req, res) => {
    const pool = req.app.locals.pool;
    try {
      const result = await pool.query('SELECT * FROM tarefas ORDER BY id');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro no servidor');
    }
  });

  app.get('/tarefas/:id', async (req, res) => {
    const pool = req.app.locals.pool;
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

  app.put('/tarefas/:id', async (req, res) => {
    const pool = req.app.locals.pool;
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

  app.delete('/tarefas/:id', async (req, res) => {
    const pool = req.app.locals.pool;
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

  app.post('/tarefas', async (req, res) => {
    const pool = req.app.locals.pool;
    const { descricao, data_criacao, data_prevista, data_encerramento, situacao } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO tarefas (descricao, data_criacao, data_prevista, data_encerramento, situacao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [descricao, data_criacao, data_prevista, data_encerramento, situacao]
      );
      res.json({ message: 'Tarefa criada com sucesso!', tarefa: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro no servidor');
    }
  });

  app.post('/login', async (req, res) => {
    const pool = req.app.locals.pool;
    const { username, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      const user = result.rows[0];
      if (user.password !== password) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }

      res.json({ message: 'Login bem-sucedido', user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro no servidor');
    }
  });

  app.get('/user/:username', async (req, res) => {
    const pool = req.app.locals.pool;
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

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      res.status(500).json({ message: 'Erro ao enviar e-mail', error });
    }
  });

  // Iniciar o servidor
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  });
};

startServer();

module.exports = app;
