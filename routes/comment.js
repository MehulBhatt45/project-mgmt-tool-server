var express = require('express');
var router = express.Router();
var commentController = require('./../controller/comment.controller');

router.post('/',commentController.addComment);
router.delete('/:id',commentController.deleteCommentByUserId);
router.put('/:id',commentController.updateCommentByUserId);



module.exports = router;