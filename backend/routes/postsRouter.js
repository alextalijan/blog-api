const { Router } = require('express');

const router = Router();
const controller = require('../controllers/postsController');

router.get('/', controller.postsGet);

module.exports = router;
