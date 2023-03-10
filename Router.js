const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController');
const friendsController = require('./controllers/friendsController');
const postController = require('./controllers/PostController');
const commentsController = require('./controllers/commentsController');

router.post('/createNewUser', userController.createNewUser);
router.post('/deleteUser', userController.deleteUser);
router.post('/searchUsers', userController.searchUsers);
router.post('/loginUser', userController.loginUser);
router.post('/userProfile', userController.userProfile);
router.post('/getPosts', postController.getPosts);
router.post('/getFriends', friendsController.getFriends);
router.post('/addFriend', friendsController.addFriend);
router.post('/removeFriend', friendsController.removeFriend);
router.post('/newPost', postController.newPost);
router.post('/likePost', postController.likePost);
router.post('/deletePost', postController.deletePost);
router.post('/getCommentsByPost', commentsController.getCommentsByPost);
router.post('/newComment', commentsController.newComment);
router.post('/editComment', commentsController.editComment);
router.post('/editPost', postController.editPost);

module.exports = router
