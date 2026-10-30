# FitDay

**Aluno(a):** _preencher_  
**Turma:** _preencher_

## Proposta do projeto

O FitDay é uma plataforma web de treinos em casa. A proposta é ajudar pessoas
a organizar uma rotina de exercícios, encontrar atividades adequadas ao seu
nível e manter a consistência, acompanhando as atividades realizadas e a
própria evolução.

Esta documentação descreve a **Entrega 1: problema e estrutura inicial**. Nesta
etapa, o projeto apresenta a proposta, a estrutura inicial de diretórios e
arquivos de referência. Os componentes criados são apenas esqueleto e não
implementam funcionalidades.

## Problema e contexto

Pessoas que treinam em casa podem não ter orientação para escolher exercícios
adequados, organizar uma rotina compatível com seu nível ou ajustar as
atividades às suas limitações físicas. Sem planejamento e acompanhamento, pode
ser difícil perceber a evolução e manter a motivação.

Esse contexto pode contribuir para o sedentarismo ou para a desistência precoce
da prática de exercícios. A falta de orientação também pode levar à escolha de
atividades incompatíveis com a experiência ou com as limitações informadas,
reduzindo a segurança e a confiança para continuar.

O FitDay pretende reunir organização de treinos, instruções, registro de
atividades e indicadores de progresso em uma plataforma acessível para quem
treina em casa.

## Justificativa

Um sistema que organiza treinos de acordo com o nível e os objetivos informados
pode facilitar a escolha de atividades e reduzir a dificuldade de começar ou
manter uma rotina. O registro das atividades permite consultar o histórico e
acompanhar a evolução ao longo do tempo.

Indicadores como streak e metas oferecem referências visíveis de consistência
e progresso, ajudando a manter o engajamento. A personalização por regras e o
respeito às limitações informadas também favorecem sugestões mais adequadas,
sem substituir orientação ou avaliação profissional de saúde.

## Objetivos

### Objetivo geral

Desenvolver uma plataforma web que auxilie pessoas a organizar treinos em casa
e acompanhar sua consistência e progresso.

### Objetivos específicos

1. Recomendar treinos por regras que considerem nível de experiência,
   objetivos e limitações informadas.
2. Permitir registrar e acompanhar atividades realizadas e consultar o
   histórico de treinos.
3. Motivar a continuidade da rotina por meio de streak, metas e indicadores de
   progresso.
4. Garantir acesso seguro aos dados e às funcionalidades conforme os perfis de
   usuário, instrutor e administrador.

## Público-alvo

Pessoas que desejam praticar exercícios em casa, especialmente iniciantes ou
pessoas que têm dificuldade para manter uma rotina de atividades físicas.

## Perfis de usuário

### Usuário

- Criar uma conta e realizar login.
- Preencher e atualizar o próprio perfil, informando idade, peso, altura,
  objetivo, nível de experiência e limitações físicas.
- Consultar treinos recomendados e visualizar exercícios e suas instruções.
- Registrar treinos concluídos.
- Consultar e alterar somente os próprios dados e registros de atividades.
- Acompanhar histórico, gráficos de progresso e streak.

### Instrutor

- Cadastrar, editar e excluir os próprios exercícios e treinos.
- Definir níveis de dificuldade e classificar exercícios por grupos musculares.
- Organizar treinos por objetivo e duração.

### Administrador

- Gerenciar usuários e perfis.
- Consultar estatísticas gerais e gerenciar permissões.
- Desativar ou remover qualquer exercício ou treino da plataforma.

## Funcionalidades previstas

- Cadastro e autenticação de usuários.
- Perfil individual para personalização dos treinos.
- Catálogo de exercícios.
- Treinos organizados por nível, objetivo e duração.
- Recomendação diária de treino baseada em regras.
- Registro e histórico de atividades concluídas.
- Gráficos de progresso.
- Streak de dias com atividade registrada.
- Metas pessoais e conquistas.

## Fluxo principal

1. A pessoa acessa o FitDay e cria uma conta ou realiza login.
2. Preenche o perfil com as informações necessárias para personalizar a
   experiência.
3. O sistema considera objetivos, preferências, nível de experiência e
   limitações informadas para apresentar sugestões.
4. A pessoa consulta as instruções dos exercícios e realiza as atividades por
   conta própria.
5. Registra a conclusão do treino.
6. O sistema atualiza o histórico, o streak e os indicadores de progresso.

Instrutores serão responsáveis pela criação e organização dos próprios
exercícios e treinos. Administradores serão responsáveis pelo gerenciamento
geral da plataforma e dos conteúdos.

## Regras de negócio previstas

1. A recomendação do treino do dia deverá considerar nível de experiência,
   objetivo e limitações informadas.
2. O sistema não deverá sugerir exercícios incompatíveis com as limitações
   informadas pelo usuário.
3. O streak contará dias consecutivos com ao menos um treino registrado e será
   zerado se o usuário pular um dia.
4. Não será permitido registrar um treino com data futura.
5. Cada usuário só poderá acessar seus próprios dados e registros. Essa
   autorização deverá ser validada na API, não apenas na interface.
6. Idade, peso e altura deverão ser validados conforme faixas aceitáveis
   definidas para o sistema.
7. O e-mail deverá ser único no cadastro.

## Dados de saúde, privacidade e segurança

O perfil poderá conter idade, peso, altura, objetivo, nível de experiência e
limitações físicas. Informações relacionadas à saúde são dados pessoais
sensíveis e deverão ser tratadas conforme a Lei Geral de Proteção de Dados
Pessoais (LGPD).

O sistema deverá coletar apenas os dados necessários para a finalidade
proposta, restringir o acesso ao perfil e permitir que cada usuário consulte e
altere somente os próprios dados e registros. O FitDay não substitui avaliação,
diagnóstico ou orientação médica, e suas recomendações não constituem
prescrições médicas.

## Banco de dados previsto

As tabelas previstas são:

- `usuarios`
- `perfis_saude`
- `exercicios`
- `treinos`
- `treino_exercicios`
- `registros_treino`
- `medidas`

Relacionamentos principais previstos:

- Um usuário poderá ter registros de treino e medidas ao longo do tempo
  (`usuarios` 1:N `registros_treino`; `usuarios` 1:N `medidas`).
- Usuários terão dados de perfil associados (`usuarios` 1:1 `perfis_saude`).
- Treinos poderão conter vários exercícios e um exercício poderá pertencer a
  vários treinos (`treinos` N:N `exercicios`), relação organizada por
  `treino_exercicios`.
- Um usuário poderá criar vários treinos (`usuarios` 1:N `treinos`).

O script de banco de dados final será elaborado na Entrega 2. O arquivo
`sql/schema.sql` desta etapa contém somente a criação inicial do banco e uma
referência às tabelas previstas; não implementa tabelas nem relacionamentos.

## Rotas planejadas da API

As rotas abaixo são uma proposta para etapas futuras e ainda não estão
implementadas.

| Método | Rota | Perfis com acesso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/exercicios` | Usuário, instrutor e administrador |
| POST | `/api/exercicios` | Instrutor |
| PUT | `/api/exercicios` | Instrutor (próprio conteúdo) ou administrador |
| DELETE | `/api/exercicios` | Instrutor (próprio conteúdo) ou administrador |
| GET | `/api/treinos` | Usuário, instrutor e administrador |
| POST | `/api/registros` | Usuário autenticado (registro próprio) |
| GET | `/api/registros/meus` | Usuário autenticado (registros próprios) |
| GET | `/api/usuarios` | Administrador |

## Tecnologias previstas

- **Front-end:** HTML5, CSS3, JavaScript, Fetch API e manipulação do DOM.
- **Back-end:** Node.js, Express, API REST e JWT para autenticação.
- **Banco de dados:** MySQL.

As tecnologias estão registradas como decisões para o projeto. Nesta entrega,
não há integração entre as camadas, banco funcional ou autenticação.

## Identidade visual

A interface deverá ser moderna, intuitiva e responsiva, adaptada a computadores
e celulares. São previstos cards de treino, destaque para streak, gráficos de
evolução, indicadores de metas concluídas e navegação simples. O design deverá
ter identidade própria, sem copiar diretamente outros aplicativos.

## Estrutura inicial

```text
FitDay/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── controllers/
│   │   ├── authController.js
│   │   └── exercicioController.js
│   ├── database/
│   │   └── connection.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   └── routes/
│       ├── authRoutes.js
│       └── exercicioRoutes.js
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── pages/
├── sql/
│   └── schema.sql
├── .gitignore
└── README.md
```

Os arquivos iniciais do back-end e do front-end são apenas esqueletos
documentais. As pastas estão preparadas para etapas futuras e não contêm
autenticação, rotas funcionais, CRUD ou conexão real com o banco.

## Como executar (previsto)

Nas próximas entregas, quando os componentes necessários estiverem
implementados, a execução prevista será:

1. Acessar a pasta do back-end com `cd backend`.
2. Instalar as dependências com `npm install`.
3. Copiar `.env.example` para `.env` e preencher as configurações do ambiente.
4. Iniciar o modo de desenvolvimento com `npm run dev`.

O processo será detalhado nas próximas entregas. Nesta etapa, os comandos não
iniciam uma aplicação funcional.

## Andamento das entregas

| Entrega | Tema | Situação |
|---|---|---|
| 1 | Problema e estrutura inicial | Concluída |
| 2 | A definir no planejamento do projeto | Pendente |
| 3 | A definir no planejamento do projeto | Pendente |
| 4 | A definir no planejamento do projeto | Pendente |

## Escopo da Entrega 1

Esta entrega cobre a documentação da proposta, a estrutura inicial de
diretórios e arquivos de referência e o `.gitignore`. Não fazem parte desta
etapa:

- Banco de dados funcional ou integração com MySQL.
- Cadastro, login ou autenticação JWT.
- CRUD de usuários, exercícios ou treinos.
- Rotas funcionais ou integração entre front-end e back-end.
- Funcionalidades completas da plataforma.
