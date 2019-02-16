var express = require('express');
var router = express.Router();
var issueController = require('./../controller/issue.controller');

router.post('/', issueController.addIssue);
router.get('/:issueId', issueController.getIssueById);
router.get('/', issueController.getAllIssue);


module.exports = router;
