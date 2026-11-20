const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/connection');

async function cadastro(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha nome, e-mail e senha.' });
    }
    if (nome.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ mensagem: 'Informe um nome e um e-mail válidos.' });
    }
    if (senha.length < 8) {
      return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    const [existente] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email.toLowerCase().trim()]);
    if (existente.length) return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });

    const hash = await bcrypt.hash(senha, 12);
    const [resultado] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, "usuario")',
      [nome.trim(), email.toLowerCase().trim(), hash]
    );

    res.status(201).json({ mensagem: 'Cadastro realizado. Agora faça login.', id: resultado.insertId });
  } catch (erro) { next(erro); }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });

    const [rows] = await db.execute(
      'SELECT id, nome, email, senha, perfil, ativo FROM usuarios WHERE email = ?',
      [email.toLowerCase().trim()]
    );
    if (!rows.length || !rows[0].ativo || !(await bcrypt.compare(senha, rows[0].senha))) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const usuario = rows[0];
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }
    });
  } catch (erro) { next(erro); }
}

async function perfilAtual(req, res) {
  res.json({ usuario: req.usuario });
}

module.exports = { cadastro, login, perfilAtual };
