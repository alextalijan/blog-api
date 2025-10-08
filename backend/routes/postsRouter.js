const { Router } = require('express');

const router = Router();
const controller = require('../controllers/postsController');

router.get('/', controller.postsGet);
router.post('/', controller.addPost);
router.get('/:postId', controller.postGet);
router.put('/:postId', controller.updatePost);
router.delete('/:postId', controller.deletePost);
router.get('/:postId/comments', controller.commentsGet);
router.post('/:postId/comments', controller.addComment);
router.delete('/postId/comments/:commentId', controller.deleteComment);

module.exports = router;
