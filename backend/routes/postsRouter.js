const { Router } = require('express');
const isLoggedIn = require('../utils/isLoggedIn');

const router = Router();
const controller = require('../controllers/postsController');

router.get('/', controller.getPosts);
router.post('/', isLoggedIn, controller.addPost);
router.get('/:postId', controller.getPost);
router.put('/:postId', controller.updatePost);
router.delete('/:postId', controller.deletePost);
router.get('/:postId/comments', controller.getComments);
router.post('/:postId/comments', controller.addComment);
router.delete('/postId/comments/:commentId', controller.deleteComment);

module.exports = router;
