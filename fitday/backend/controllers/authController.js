const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database/connection');

function gerarToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

async function registrar(req, res, next) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Informe nome, e-mail e senha.' });
    }
    if (String(nome).trim().length < 2) {
      return res.status(400).json({ mensagem: 'O nome deve ter pelo menos 2 caracteres.' });
    }
    if (String(senha).length < 8) {
      return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const [existentes] = await pool.execute(
      'SELECT id FROM usuarios WHERE email = ? LIMIT 1',
      [emailNormalizado]
    );
    if (existentes.length) {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 12);
    const [resultado] = await pool.execute(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil_id)
       VALUES (?, ?, ?, (SELECT id FROM perfis WHERE nome = 'usuario'))`,
      [String(nome).trim(), emailNormalizado, senhaHash]
    );

    const [perfis] = await pool.execute(
      `SELECT p.nome AS perfil FROM usuarios u
       INNER JOIN perfis p ON p.id = u.perfil_id WHERE u.id = ?`,
      [resultado.insertId]
    );

    const usuario = {
      id: resultado.insertId,
      nome: String(nome).trim(),
      email: emailNormalizado,
      perfil: perfis[0].perfil
    };

    return res.status(201).json({
      mensagem: 'Conta criada com sucesso.',
      usuario,
      token: gerarToken(usuario)
    });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }
    next(erro);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
    }

    const [usuarios] = await pool.execute(
      `SELECT u.id, u.nome, u.email, u.senha_hash, u.ativo, p.nome AS perfil
       FROM usuarios u
       INNER JOIN perfis p ON p.id = u.perfil_id
       WHERE u.email = ? LIMIT 1`,
      [String(email).trim().toLowerCase()]
    );

    if (!usuarios.length || !usuarios[0].ativo) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const usuarioBanco = usuarios[0];
    const senhaCorreta = await bcrypt.compare(senha, usuarioBanco.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const usuario = {
      id: usuarioBanco.id,
      nome: usuarioBanco.nome,
      email: usuarioBanco.email,
      perfil: usuarioBanco.perfil
    };

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      usuario,
      token: gerarToken(usuario)
    });
  } catch (erro) {
    next(erro);
  }
}

async function meuPerfil(req, res) {
  return res.json({ usuario: req.usuario });
}

module.exports = { registrar, login, meuPerfil };
