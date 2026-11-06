const express = require('express');
const { listarUsuarios, alterarPerfil } = require('../controllers/usuarioController');
const { autenticar } = require('../middlewares/authMiddleware');
const { permitirPerfis } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/', autenticar, permitirPerfis('administrador'), listarUsuarios);
router.patch('/:id/perfil', autenticar, permitirPerfis('administrador'), alterarPerfil);

module.exports = router;
