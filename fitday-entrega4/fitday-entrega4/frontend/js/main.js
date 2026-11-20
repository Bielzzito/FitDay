const API = '/api';
let token = localStorage.getItem('fitday_token');
let usuario = JSON.parse(localStorage.getItem('fitday_usuario') || 'null');
let exercicios = [];

const $ = (id) => document.getElementById(id);
const authView = $('auth-view');
const appView = $('app-view');

function mensagem(id, texto, sucesso = false) {
  const el = $(id);
  el.textContent = texto || '';
  el.style.color = sucesso ? '#246b50' : '#b43d3d';
}

async function api(caminho, opcoes = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opcoes.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const resposta = await fetch(`${API}${caminho}`, { ...opcoes, headers });
  const dados = resposta.status === 204 ? null : await resposta.json().catch(() => ({}));
  if (resposta.status === 401 && token) sair();
  if (!resposta.ok) throw new Error(dados?.mensagem || 'Não foi possível concluir a operação.');
  return dados;
}

function alternarAba(aba) {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === aba));
  $('login-form').classList.toggle('hidden', aba !== 'login');
  $('register-form').classList.toggle('hidden', aba !== 'register');
  mensagem('auth-message', '');
}
document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => alternarAba(b.dataset.tab)));

$('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const dados = await api('/auth/login', { method: 'POST', body: JSON.stringify({
      email: $('login-email').value, senha: $('login-password').value
    })});
    token = dados.token; usuario = dados.usuario;
    localStorage.setItem('fitday_token', token);
    localStorage.setItem('fitday_usuario', JSON.stringify(usuario));
    await abrirPainel();
  } catch (erro) { mensagem('auth-message', erro.message); }
});

$('register-form').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    const dados = await api('/auth/cadastro', { method: 'POST', body: JSON.stringify({
      nome: $('register-name').value, email: $('register-email').value, senha: $('register-password').value
    })});
    mensagem('auth-message', dados.mensagem, true);
    alternarAba('login');
    $('login-email').value = $('register-email').value;
  } catch (erro) { mensagem('auth-message', erro.message); }
});

function sair() {
  token = null; usuario = null; exercicios = [];
  localStorage.removeItem('fitday_token'); localStorage.removeItem('fitday_usuario');
  authView.classList.remove('hidden'); appView.classList.add('hidden'); $('user-area').classList.add('hidden');
}
$('logout').addEventListener('click', sair);

async function abrirPainel() {
  try {
    const dados = await api('/auth/me');
    usuario = dados.usuario;
    localStorage.setItem('fitday_usuario', JSON.stringify(usuario));
    authView.classList.add('hidden'); appView.classList.remove('hidden');
    $('user-area').classList.remove('hidden');
    $('welcome').textContent = `Olá, ${usuario.nome}`;
    $('role-pill').textContent = usuario.perfil;
    await Promise.all([carregarExercicios(), carregarRegistros(), carregarResumo()]);
  } catch (erro) { mensagem('auth-message', erro.message); }
}

async function carregarExercicios() {
  exercicios = await api('/exercicios');
  const lista = $('exercise-list');
  lista.innerHTML = '';
  $('log-exercise').innerHTML = '<option value="">Treino livre</option>';
  exercicios.forEach(ex => {
    const option = document.createElement('option');
    option.value = ex.id; option.textContent = ex.nome;
    $('log-exercise').appendChild(option);

    const card = document.createElement('article');
    card.className = 'exercise-card';
    const top = document.createElement('div'); top.className = 'exercise-top';
    const title = document.createElement('h3'); title.textContent = ex.nome;
    const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = ex.nivel;
    top.append(title, tag);
    const desc = document.createElement('p');
    desc.textContent = `${ex.descricao} • ${ex.grupo_muscular} • ${ex.duracao_minutos} min`;
    card.append(top, desc);
    if (['instrutor', 'admin'].includes(usuario.perfil)) {
      const actions = document.createElement('div'); actions.className = 'exercise-actions';
      const edit = document.createElement('button'); edit.className = 'small-btn'; edit.textContent = 'Editar';
      edit.addEventListener('click', () => editarExercicio(ex));
      actions.append(edit);
      if (usuario.perfil === 'admin') {
        const del = document.createElement('button'); del.className = 'small-btn danger'; del.textContent = 'Excluir';
        del.addEventListener('click', () => excluirExercicio(ex.id));
        actions.append(del);
      }
      card.append(actions);
    }
    lista.append(card);
  });
  if (!exercicios.length) lista.innerHTML = '<p class="empty">Ainda não há exercícios cadastrados.</p>';
  $('exercise-form-wrap').classList.toggle('hidden', !['instrutor', 'admin'].includes(usuario.perfil));
}

function editarExercicio(ex) {
  $('exercise-form-wrap').classList.remove('hidden');
  $('exercise-form-title').textContent = 'Editar exercício';
  $('exercise-id').value = ex.id;
  $('exercise-name').value = ex.nome;
  $('exercise-group').value = ex.grupo_muscular;
  $('exercise-level').value = ex.nivel;
  $('exercise-duration').value = ex.duracao_minutos;
  $('exercise-description').value = ex.descricao;
  $('exercise-form-wrap').scrollIntoView({ behavior: 'smooth' });
}
$('cancel-exercise').addEventListener('click', limparFormularioExercicio);
function limparFormularioExercicio() {
  $('exercise-form').reset(); $('exercise-id').value = '';
  $('exercise-form-title').textContent = 'Adicionar exercício';
}
$('exercise-form').addEventListener('submit', async e => {
  e.preventDefault();
  const id = $('exercise-id').value;
  const corpo = {
    nome: $('exercise-name').value, grupo_muscular: $('exercise-group').value,
    nivel: $('exercise-level').value, duracao_minutos: Number($('exercise-duration').value),
    descricao: $('exercise-description').value
  };
  try {
    await api(id ? `/exercicios/${id}` : '/exercicios', {
      method: id ? 'PUT' : 'POST', body: JSON.stringify(corpo)
    });
    limparFormularioExercicio(); await carregarExercicios();
  } catch (erro) { alert(erro.message); }
});

async function excluirExercicio(id) {
  if (!confirm('Deseja realmente excluir este exercício?')) return;
  try { await api(`/exercicios/${id}`, { method: 'DELETE' }); await carregarExercicios(); }
  catch (erro) { alert(erro.message); }
}

$('log-date').value = new Date().toISOString().slice(0, 10);
$('log-form').addEventListener('submit', async e => {
  e.preventDefault();
  try {
    await api('/registros', { method: 'POST', body: JSON.stringify({
      exercicio_id: $('log-exercise').value || null,
      duracao_minutos: Number($('log-duration').value),
      data_treino: $('log-date').value,
      observacao: $('log-note').value
    })});
    $('log-form').reset(); $('log-date').value = new Date().toISOString().slice(0, 10);
    mensagem('log-message', 'Atividade registrada com sucesso!', true);
    await Promise.all([carregarRegistros(), carregarResumo()]);
  } catch (erro) { mensagem('log-message', erro.message); }
});

async function carregarRegistros() {
  const registros = await api('/registros');
  const lista = $('history-list'); lista.innerHTML = '';
  if (!registros.length) { lista.innerHTML = '<p class="empty">Suas atividades registradas aparecerão aqui.</p>'; return; }
  registros.forEach(reg => {
    const item = document.createElement('div'); item.className = 'history-item';
    const info = document.createElement('div');
    const nome = document.createElement('strong'); nome.textContent = reg.nome_exercicio;
    const detalhe = document.createElement('small');
    detalhe.textContent = `${formatarData(reg.data_treino)}${reg.observacao ? ' • ' + reg.observacao : ''}`;
    info.append(nome, detalhe);
    const direita = document.createElement('div'); direita.className = 'history-right';
    const tempo = document.createElement('span'); tempo.textContent = `${reg.duracao_minutos} min`;
    const del = document.createElement('button'); del.className = 'small-btn danger'; del.textContent = 'Remover';
    del.addEventListener('click', async () => {
      if (!confirm('Remover este registro do histórico?')) return;
      try { await api(`/registros/${reg.id}`, { method: 'DELETE' }); await Promise.all([carregarRegistros(), carregarResumo()]); }
      catch (erro) { alert(erro.message); }
    });
    direita.append(tempo, del); item.append(info, direita); lista.append(item);
  });
}

async function carregarResumo() {
  const r = await api('/registros/resumo');
  $('stat-workouts').textContent = r.treinos;
  $('stat-minutes').textContent = r.minutos;
  $('stat-days').textContent = r.dias_ativos;
}
function formatarData(data) {
  const [ano, mes, dia] = String(data).slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

if (token) abrirPainel();
