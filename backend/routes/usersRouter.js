const { Router } = require('express');

const router = Router();
const controller = require('../controllers/usersController');

router.get('/', controller.usersGet);
router.get('/:userId', controller.userGet);

module.exports = router;
