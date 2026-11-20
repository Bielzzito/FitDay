const db = require('../database/connection');

async function listar(req, res, next) {
  try {
    const [rows] = await db.execute(
      `SELECT id, exercicio_id, nome_exercicio, duracao_minutos, observacao, data_treino
       FROM registros_treino WHERE usuario_id = ? ORDER BY data_treino DESC, id DESC`,
      [req.usuario.id]
    );
    res.json(rows);
  } catch (erro) { next(erro); }
}

async function criar(req, res, next) {
  try {
    const { exercicio_id, duracao_minutos, observacao, data_treino } = req.body;
    if (!Number.isInteger(Number(duracao_minutos)) || Number(duracao_minutos) < 1 || Number(duracao_minutos) > 600) {
      return res.status(400).json({ mensagem: 'Informe uma duração entre 1 e 600 minutos.' });
    }
    const data = data_treino || new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return res.status(400).json({ mensagem: 'Data do treino inválida.' });
    }

    let nome = 'Treino livre';
    let idExercicio = null;
    if (exercicio_id) {
      const [exercicios] = await db.execute('SELECT id, nome FROM exercicios WHERE id = ?', [exercicio_id]);
      if (!exercicios.length) return res.status(404).json({ mensagem: 'Exercício não encontrado.' });
      nome = exercicios[0].nome;
      idExercicio = exercicios[0].id;
    }

    const [result] = await db.execute(
      `INSERT INTO registros_treino
       (usuario_id, exercicio_id, nome_exercicio, duracao_minutos, observacao, data_treino)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.usuario.id, idExercicio, nome, Number(duracao_minutos), (observacao || '').trim().slice(0, 500), data]
    );
    res.status(201).json({ mensagem: 'Treino registrado.', id: result.insertId });
  } catch (erro) { next(erro); }
}

async function excluir(req, res, next) {
  try {
    const [result] = await db.execute(
      'DELETE FROM registros_treino WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensagem: 'Registro não encontrado.' });
    res.json({ mensagem: 'Registro removido.' });
  } catch (erro) { next(erro); }
}

async function resumo(req, res, next) {
  try {
    const [totais] = await db.execute(
      `SELECT COUNT(*) AS treinos, COALESCE(SUM(duracao_minutos),0) AS minutos,
       COUNT(DISTINCT data_treino) AS dias_ativos
       FROM registros_treino WHERE usuario_id = ?`,
      [req.usuario.id]
    );
    const [dias] = await db.execute(
      'SELECT DISTINCT data_treino FROM registros_treino WHERE usuario_id = ? ORDER BY data_treino DESC',
      [req.usuario.id]
    );
    res.json({ ...totais[0], dias: dias.map(x => x.data_treino) });
  } catch (erro) { next(erro); }
}

module.exports = { listar, criar, excluir, resumo };
