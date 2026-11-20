const router = require('express').Router();
const controller = require('../controllers/authController');
const autenticar = require('../middlewares/authMiddleware');

router.post('/cadastro', controller.cadastro);
router.post('/login', controller.login);
router.get('/me', autenticar, controller.perfilAtual);

module.exports = router;
