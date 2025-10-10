const { Router } = require('express');
const isLoggedIn = require('../utils/isLoggedIn');

const router = Router();
const controller = require('../controllers/usersController');

router.get('/:userId', controller.getUser);
router.put('/:userId/password', isLoggedIn, controller.updatePassword);
router.get('/:userId/posts', controller.getPostsFromUser);

module.exports = router;
