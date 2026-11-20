const router = require('express').Router();
const controller = require('../controllers/registroController');
const autenticar = require('../middlewares/authMiddleware');

router.use(autenticar);
router.get('/', controller.listar);
router.post('/', controller.criar);
router.delete('/:id', controller.excluir);
router.get('/resumo', controller.resumo);

module.exports = router;
