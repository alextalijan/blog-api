const { Router } = require('express');
const isLoggedIn = require('../utils/isLoggedIn');

const router = Router();
const controller = require('../controllers/postsController');

router.get('/', controller.getPosts);
router.post('/', isLoggedIn, controller.addPost);
router.get('/:postId', controller.getPost);
// router.put('/:postId', isLoggedIn, controller.updatePost);
router.delete('/:postId', isLoggedIn, controller.deletePost);
router.get('/:postId/comments', controller.getComments);
router.post('/:postId/comments', isLoggedIn, controller.addComment);
router.delete('/postId/comments/:commentId', isLoggedIn, controller.deleteComment);

module.exports = router;
