const { Router } = require('express');

const router = Router();
const controller = require('../controllers/usersController');

router.get('/', controller.getUsers);
router.get('/:userId', controller.getUser);

module.exports = router;
