const { Router } = require('express');

const router = Router();
const controller = require('../controllers/indexController');

router.post('/register', controller.register);
router.post('/login', controller.login);

module.exports = router;
