const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api', (req, res) => res.json({ mensagem: 'API FitDay funcionando.' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/exercicios', require('./routes/exercicioRoutes'));
app.use('/api/registros', require('./routes/registroRoutes'));

app.use('/api', (req, res) => res.status(404).json({ mensagem: 'Rota da API não encontrada.' }));
app.use((erro, req, res, next) => {
  console.error(erro);
  if (erro.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensagem: 'Este dado já está cadastrado.' });
  res.status(500).json({ mensagem: 'Erro interno. Tente novamente mais tarde.' });
});

module.exports = app;
