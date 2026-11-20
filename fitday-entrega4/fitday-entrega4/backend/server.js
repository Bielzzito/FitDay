require('dotenv').config();
const app = require('./app');
const db = require('./database/connection');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
    throw new Error('Configure JWT_SECRET no arquivo .env com pelo menos 24 caracteres.');
  }
  await db.query('SELECT 1');
  console.log('Conexão com MySQL estabelecida.');
  app.listen(PORT, () => console.log(`FitDay disponível em http://localhost:${PORT}`));
}

iniciar().catch(erro => {
  console.error('Não foi possível iniciar o FitDay:', erro.message);
  process.exit(1);
});
