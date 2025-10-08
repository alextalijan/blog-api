const { Router } = require('express');

const router = Router();
const controller = require('../controllers/usersController');

router.get('/:userId', controller.getUser);
router.put('/:userId/password', controller.updatePassword);

module.exports = router;
