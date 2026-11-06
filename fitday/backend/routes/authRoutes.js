const express = require('express');
const { registrar, login, meuPerfil } = require('../controllers/authController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/registrar', registrar);
router.post('/login', login);
router.get('/me', autenticar, meuPerfil);

module.exports = router;
