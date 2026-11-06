require('dotenv').config();

const app = require('./app');
const { testarConexao } = require('./database/connection');

const PORT = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('troque_esta_chave')) {
    throw new Error('Configure uma JWT_SECRET própria no arquivo .env antes de iniciar.');
  }

  await testarConexao();
  app.listen(PORT, () => {
    console.log(`Servidor FitDay rodando em http://localhost:${PORT}`);
  });
}

iniciarServidor().catch((erro) => {
  console.error('Não foi possível iniciar o FitDay:', erro.message);
  process.exit(1);
});
