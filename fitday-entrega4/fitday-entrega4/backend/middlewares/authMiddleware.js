const jwt = require('jsonwebtoken');
const db = require('../database/connection');

async function autenticar(req, res, next) {
  try {
    const cabecalho = req.headers.authorization || '';
    const [tipo, token] = cabecalho.split(' ');
    if (tipo !== 'Bearer' || !token) {
      return res.status(401).json({ mensagem: 'Faça login para continuar.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [usuarios] = await db.execute(
      'SELECT id, nome, email, perfil, ativo FROM usuarios WHERE id = ?',
      [payload.id]
    );

    if (!usuarios.length || !usuarios[0].ativo) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado ou desativado.' });
    }

    req.usuario = usuarios[0];
    next();
  } catch (erro) {
    if (erro.name === 'JsonWebTokenError' || erro.name === 'TokenExpiredError') {
      return res.status(401).json({ mensagem: 'Token inválido ou expirado. Entre novamente.' });
    }
    next(erro);
  }
}

module.exports = autenticar;
