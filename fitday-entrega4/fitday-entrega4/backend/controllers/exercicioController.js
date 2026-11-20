const db = require('../database/connection');

const niveis = ['iniciante', 'intermediario', 'avancado'];

function validar(dados) {
  const { nome, descricao, grupo_muscular, nivel, duracao_minutos } = dados;
  if (!nome || !descricao || !grupo_muscular || !nivel || duracao_minutos === undefined) {
    return 'Preencha todos os campos do exercício.';
  }
  if (String(nome).trim().length < 2 || String(descricao).trim().length < 5) {
    return 'Nome ou descrição muito curtos.';
  }
  if (!niveis.includes(nivel)) return 'Nível inválido.';
  if (!Number.isInteger(Number(duracao_minutos)) || Number(duracao_minutos) < 1 || Number(duracao_minutos) > 180) {
    return 'A duração deve ser um número entre 1 e 180 minutos.';
  }
  return null;
}

async function listar(req, res, next) {
  try {
    const [rows] = await db.execute(
      'SELECT id, nome, descricao, grupo_muscular, nivel, duracao_minutos FROM exercicios ORDER BY nome'
    );
    res.json(rows);
  } catch (erro) { next(erro); }
}

async function buscar(req, res, next) {
  try {
    const [rows] = await db.execute('SELECT * FROM exercicios WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ mensagem: 'Exercício não encontrado.' });
    res.json(rows[0]);
  } catch (erro) { next(erro); }
}

async function criar(req, res, next) {
  try {
    const erroValidacao = validar(req.body);
    if (erroValidacao) return res.status(400).json({ mensagem: erroValidacao });

    const { nome, descricao, grupo_muscular, nivel, duracao_minutos } = req.body;
    const [result] = await db.execute(
      `INSERT INTO exercicios (nome, descricao, grupo_muscular, nivel, duracao_minutos, criado_por)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome.trim(), descricao.trim(), grupo_muscular.trim(), nivel, Number(duracao_minutos), req.usuario.id]
    );
    res.status(201).json({ mensagem: 'Exercício cadastrado.', id: result.insertId });
  } catch (erro) { next(erro); }
}

async function atualizar(req, res, next) {
  try {
    const erroValidacao = validar(req.body);
    if (erroValidacao) return res.status(400).json({ mensagem: erroValidacao });

    const { nome, descricao, grupo_muscular, nivel, duracao_minutos } = req.body;
    const [result] = await db.execute(
      `UPDATE exercicios SET nome=?, descricao=?, grupo_muscular=?, nivel=?, duracao_minutos=?
       WHERE id=?`,
      [nome.trim(), descricao.trim(), grupo_muscular.trim(), nivel, Number(duracao_minutos), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensagem: 'Exercício não encontrado.' });
    res.json({ mensagem: 'Exercício atualizado.' });
  } catch (erro) { next(erro); }
}

async function excluir(req, res, next) {
  try {
    const [result] = await db.execute('DELETE FROM exercicios WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensagem: 'Exercício não encontrado.' });
    res.json({ mensagem: 'Exercício excluído.' });
  } catch (erro) { next(erro); }
}

module.exports = { listar, buscar, criar, atualizar, excluir };
