# FitDay

**Aluno(a):** preencher  
**Turma:** preencher

Plataforma web para ajudar pessoas a organizar treinos em casa e acompanhar a consistência das atividades.

## Entregas contempladas

Este repositório contém a documentação e estrutura da **Entrega 1**, além da estrutura SQL e da autenticação/autorização inicial da **Entrega 2**. A interface completa e o CRUD de exercícios ficam para a Entrega 3.

## 1. Problema e justificativa

Pessoas que desejam treinar em casa podem ter dificuldade para escolher atividades, organizar uma rotina compatível com sua experiência e manter a consistência. O FitDay pretende reunir um catálogo de exercícios, treinos organizados, registro de atividades e indicadores de progresso.

O sistema apresentará sugestões por regras simples com base nas informações fornecidas pelo usuário. Essas sugestões são informativas e não substituem avaliação ou orientação profissional. O projeto deve coletar apenas dados necessários e restringir o acesso às informações pessoais.

## 2. Público-alvo

Pessoas que desejam praticar exercícios em casa, especialmente iniciantes ou pessoas que têm dificuldade para manter uma rotina.

## 3. Perfis e permissões

- **Usuário:** cria conta, consulta treinos, registra atividades e acompanha seus próprios dados.
- **Instrutor:** poderá cadastrar e organizar exercícios e treinos nas próximas etapas.
- **Administrador:** gerencia usuários e perfis. Nesta etapa, somente o administrador pode listar usuários e alterar perfis.

O cadastro público sempre cria uma conta com perfil `usuario`. Isso impede que alguém se cadastre diretamente como administrador ou instrutor.

## 4. Funcionalidades previstas

- Cadastro e login.
- Perfil individual e preferências de treino.
- Catálogo de exercícios e treinos.
- Sugestões de treinos por regras.
- Registro e histórico de atividades.
- Gráficos, metas e sequência de dias ativos (streak).
- Controle de acesso por perfil.

## 5. Fluxo principal

1. O usuário cria uma conta ou realiza login.
2. Informa preferências necessárias para personalizar a experiência.
3. Consulta sugestões e instruções de treinos.
4. Registra as atividades concluídas.
5. Acompanha histórico e indicadores de consistência.

## 6. Tecnologias

- Frontend planejado: HTML, CSS e JavaScript, com DOM e Fetch.
- Backend: Node.js e Express, com API REST.
- Banco de dados: MySQL.
- Autenticação: senha protegida com bcryptjs e token JWT.
- Controle de acesso: middleware de autenticação e middleware por perfil.

## 7. Estrutura do projeto

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
│   ├── css/
│   ├── js/
│   └── pages/
├── sql/
│   └── fitday.sql
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 8. Banco de dados

O script `sql/fitday.sql` cria o banco `fitday` e as tabelas `perfis`, `usuarios`, `perfis_usuario`, `exercicios`, `treinos`, `treino_exercicios` e `registros_treino`, com chaves primárias e estrangeiras.

## 9. Como configurar e executar

1. Instale o Node.js e tenha o MySQL em execução.
2. No MySQL Workbench, execute o arquivo `sql/fitday.sql`.
3. Na raiz do projeto, instale as dependências:

   ```bash
   npm install
   ```

4. Copie `.env.example` para `.env`.
5. Confira os dados de conexão do MySQL no `.env`. Para o ambiente local informado no desenvolvimento: host `localhost`, porta `3306`, usuário `root` e senha `admin` no seu ambiente local. No `.env`, substitua `DB_PASSWORD=coloque_sua_senha_local` por `DB_PASSWORD=admin`.
6. Altere `JWT_SECRET` para uma chave longa e aleatória. Não compartilhe esse valor.
7. Inicie a API:

   ```bash
   npm run dev
   ```

A API ficará disponível em `http://localhost:3000`.

## 10. Rotas implementadas na Entrega 2

| Método | Rota | Acesso | Finalidade |
|---|---|---|---|
| GET | `/` | Público | Verificar se a API está funcionando |
| POST | `/api/auth/registrar` | Público | Criar conta comum |
| POST | `/api/auth/login` | Público | Autenticar e receber JWT |
| GET | `/api/auth/me` | Token válido | Consultar o usuário autenticado |
| GET | `/api/usuarios` | Administrador | Listar usuários |
| PATCH | `/api/usuarios/:id/perfil` | Administrador | Alterar perfil de usuário |

Para rotas protegidas, envie o cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

### Como criar o primeiro administrador

1. Registre uma conta normalmente pela rota `/api/auth/registrar`.
2. No MySQL Workbench, execute o comando abaixo, substituindo o e-mail pelo e-mail cadastrado:

```sql
UPDATE usuarios
SET perfil_id = (SELECT id FROM perfis WHERE nome = 'administrador')
WHERE email = 'seu-email@exemplo.com';
```

Faça logout/login novamente para receber um token com o perfil atualizado. A partir daí, esse administrador poderá alterar perfis pela rota protegida.

Para promover um instrutor, o administrador pode usar a mesma lógica, trocando `administrador` por `instrutor` no perfil de destino.

## 11. Testes rápidos

Use Postman ou Thunder Client:

**Cadastro**
`POST http://localhost:3000/api/auth/registrar`

```json
{
  "nome": "Usuário Teste",
  "email": "teste@email.com",
  "senha": "senha12345"
}
```

**Login**
`POST http://localhost:3000/api/auth/login`

```json
{
  "email": "teste@email.com",
  "senha": "senha12345"
}
```

Copie o `token` retornado e teste `GET http://localhost:3000/api/auth/me` com `Authorization: Bearer SEU_TOKEN`.

## 12. Segurança e privacidade

- As senhas são armazenadas como hash com bcryptjs, nunca em texto puro.
- O JWT é assinado no servidor e tem validade configurável.
- O perfil é definido pelo servidor no cadastro público.
- Rotas administrativas exigem autenticação e perfil autorizado.
- O arquivo `.env` não deve ser enviado ao GitHub; somente `.env.example` deve ser versionado.
- Informações relacionadas a saúde ou limitações devem ser minimizadas e protegidas, com acesso restrito.

## 13. Limites desta versão

A Entrega 2 implementa banco de dados, cadastro, login, senha criptograficamente protegida, JWT e controle de acesso por perfil. O CRUD completo de exercícios, a interface integrada e os gráficos serão desenvolvidos nas próximas etapas.
