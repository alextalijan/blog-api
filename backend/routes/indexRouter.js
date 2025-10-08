const { Router } = require('express');

const router = Router();
const controller = require('../controllers/indexController');

router.post('/register', controller.register);

module.exports = router;
