const { Router } = require('express');

const router = Router();
const controller = require('../controllers/postsController');

router.get('/', controller.postsGet);
router.post('/', controller.addPost);
router.get('/:postId', controller.postGet);
router.put('/:postId', controller.updatePost);
router.get('/:postId/comments', controller.commentsGet);
router.post('/:postId/comments', controller.addComment);

module.exports = router;
