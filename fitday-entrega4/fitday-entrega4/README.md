# FitDay — Entrega 4

Sistema web para organizar exercícios em casa, registrar atividades e acompanhar a constância do usuário.

## Problema e solução
O FitDay busca facilitar a organização de atividades físicas em casa. O usuário consulta exercícios, registra o que realizou e acompanha o total de atividades, minutos e dias ativos.

> O sistema é informativo e organizacional. Não substitui avaliação, prescrição ou acompanhamento de profissionais de saúde/educação física.

## Tecnologias
- Front-end: HTML, CSS e JavaScript (DOM e Fetch)
- Back-end: Node.js e Express
- Banco: MySQL
- Segurança: bcryptjs para hash de senha e JWT para autenticação

## Perfis e permissões
- `usuario`: consulta exercícios, registra atividades e gerencia somente o próprio histórico.
- `instrutor`: tudo de usuário e cadastro/edição de exercícios.
- `admin`: tudo de instrutor e exclusão de exercícios.

Novas contas são criadas sempre como `usuario`. Isso impede que alguém se torne instrutor/admin escolhendo o perfil no formulário.

## Estrutura
```text
fitday/
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── css/style.css
│   ├── js/main.js
│   └── index.html
├── sql/fitday.sql
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Instalação
1. Instale Node.js e MySQL.
2. No MySQL Workbench, execute todo o arquivo `sql/fitday.sql`.
3. Copie `.env.example` para `.env`.
4. Preencha as configurações do MySQL e crie um `JWT_SECRET` longo (mínimo 24 caracteres).
5. No terminal, dentro da pasta do projeto:
   ```bash
   npm install
   npm run dev
   ```
6. Abra `http://localhost:3000`.

Não envie o arquivo `.env` ao GitHub. Ele contém configurações locais e segredos.

## Como criar um instrutor ou administrador
1. Cadastre normalmente uma conta pela tela.
2. No MySQL Workbench, execute uma atualização usando o e-mail da conta:
   ```sql
   USE fitday;
   UPDATE usuarios SET perfil = 'instrutor' WHERE email = 'email-da-conta';
   ```
   Para administrador, use `admin` no lugar de `instrutor`. Faça isso apenas para contas autorizadas.

## Rotas principais
### Autenticação
- `POST /api/auth/cadastro`
- `POST /api/auth/login`
- `GET /api/auth/me` — requer Bearer token

### Exercícios — todas requerem autenticação
- `GET /api/exercicios`
- `GET /api/exercicios/:id`
- `POST /api/exercicios` — instrutor/admin
- `PUT /api/exercicios/:id` — instrutor/admin
- `DELETE /api/exercicios/:id` — admin

### Registros — todas requerem autenticação
- `GET /api/registros` — lista somente registros do usuário autenticado
- `POST /api/registros` — registra atividade para o usuário autenticado
- `DELETE /api/registros/:id` — remove somente registro pertencente ao usuário
- `GET /api/registros/resumo` — totais do usuário autenticado

## Regras de negócio e validações
- E-mail único e senha com pelo menos 8 caracteres.
- Senhas armazenadas com hash bcrypt.
- Novas contas começam como `usuario`.
- Token JWT é validado no back-end em cada rota protegida.
- Permissões são verificadas na API, não apenas na interface.
- Duração de exercício entre 1 e 180 minutos.
- Duração de atividade entre 1 e 600 minutos.
- Usuário só consulta e remove os próprios registros.
- Registros guardam o nome do exercício para manter o histórico mesmo se o exercício for removido.

## Testes sugeridos
1. Cadastre uma conta e faça login.
2. Consulte `/api/auth/me` com o token.
3. Tente criar exercício como `usuario`: deve retornar 403.
4. Altere uma conta de teste para `instrutor` pelo SQL e faça login novamente; crie e edite exercício.
5. Altere uma conta de teste para `admin`; teste exclusão de exercício.
6. Registre uma atividade e confirme que aparece no histórico e nos totais.
7. Crie duas contas e confirme que uma não consegue consultar/remover os registros da outra.
8. Teste dados inválidos e acesso sem token.

## Observação
O script SQL cria as tabelas e alguns exercícios iniciais. A primeira conta cadastrada será usuário comum; não existe senha administrativa padrão.
