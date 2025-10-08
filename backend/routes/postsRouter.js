const { Router } = require('express');

const router = Router();
const controller = require('../controllers/postsController');

router.get('/', controller.postsGet);
router.get('/:postId', controller.postGet);
router.get('/:postId/comments', controller.postCommentsGet);

module.exports = router;
