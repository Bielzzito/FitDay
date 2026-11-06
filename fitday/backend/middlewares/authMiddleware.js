const jwt = require('jsonwebtoken');
const { pool } = require('../database/connection');

async function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token de acesso não informado.' });
  }

  const token = cabecalho.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [usuarios] = await pool.execute(
      `SELECT u.id, u.nome, u.email, u.ativo, p.nome AS perfil
       FROM usuarios u
       INNER JOIN perfis p ON p.id = u.perfil_id
       WHERE u.id = ? LIMIT 1`,
      [payload.sub]
    );

    if (!usuarios.length || !usuarios[0].ativo) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado ou inativo.' });
    }

    req.usuario = {
      id: usuarios[0].id,
      nome: usuarios[0].nome,
      email: usuarios[0].email,
      perfil: usuarios[0].perfil
    };

    next();
  } catch (erro) {
    if (erro.name === 'JsonWebTokenError' || erro.name === 'TokenExpiredError') {
      return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }
    next(erro);
  }
}

module.exports = { autenticar };
