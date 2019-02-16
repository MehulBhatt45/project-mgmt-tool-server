var express = require('express');
var router = express.Router();
var commentController = require('./../controller/comment.controller');

router.post('/',commentController.addComment);
router.get('/allComment',commentController.getAllComment);
router.get('/',commentController.getCommentByUserId);
router.delete('/:id',commentController.deleteCommentByUserId);
router.put('/:id',commentController.updateCommentByUserId);



module.exports = router;