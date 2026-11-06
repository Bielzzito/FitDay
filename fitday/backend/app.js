const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API FitDay funcionando.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
});

module.exports = app;
