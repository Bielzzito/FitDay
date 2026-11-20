const router = require('express').Router();
const controller = require('../controllers/exercicioController');
const autenticar = require('../middlewares/authMiddleware');
const permitir = require('../middlewares/roleMiddleware');

router.use(autenticar);
router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.post('/', permitir('instrutor', 'admin'), controller.criar);
router.put('/:id', permitir('instrutor', 'admin'), controller.atualizar);
router.delete('/:id', permitir('admin'), controller.excluir);

module.exports = router;
