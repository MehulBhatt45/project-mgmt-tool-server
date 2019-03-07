var express = require('express');
var router = express.Router();
var commentController = require('./../controller/comment.controller');

router.post('/addComment',commentController.addComment);
router.get('/allComment',commentController.getAllComment);
router.get('/userId',commentController.getCommentByUserId);
router.get('/:id',commentController.getCommentByCommentId);
// router.delete('/userId/:id',commentController.deleteCommentByUserId);
router.delete('/:id',commentController.deleteCommentByUserId);
// router.put('/userId/:id',commentController.updateCommentByUserId);
router.put('/:id',commentController.updateCommentByCommentId);



module.exports = router;  