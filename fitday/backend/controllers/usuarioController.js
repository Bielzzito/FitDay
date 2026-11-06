const { pool } = require('../database/connection');

async function listarUsuarios(req, res, next) {
  try {
    const [usuarios] = await pool.execute(
      `SELECT u.id, u.nome, u.email, p.nome AS perfil, u.ativo, u.criado_em
       FROM usuarios u INNER JOIN perfis p ON p.id = u.perfil_id
       ORDER BY u.id DESC`
    );
    res.json(usuarios);
  } catch (erro) {
    next(erro);
  }
}

async function alterarPerfil(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { perfil } = req.body;
    const perfisValidos = ['usuario', 'instrutor', 'administrador'];

    if (!Number.isInteger(id) || id <= 0 || !perfisValidos.includes(perfil)) {
      return res.status(400).json({ mensagem: 'ID ou perfil informado é inválido.' });
    }

    const [resultado] = await pool.execute(
      `UPDATE usuarios SET perfil_id = (SELECT id FROM perfis WHERE nome = ?)
       WHERE id = ?`,
      [perfil, id]
    );

    if (!resultado.affectedRows) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    res.json({ mensagem: 'Perfil atualizado com sucesso.' });
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listarUsuarios, alterarPerfil };
