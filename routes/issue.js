var express = require('express');
var router = express.Router();
var issueController = require('./../controller/issue.controller');
var auth = require('./auth');

router.post('/add-issue', issueController.addIssue);
router.get('/get-all', issueController.getAllIssue);
router.delete('/delete/:issueId', issueController.deleteIssueById);
router.get('/get-by-id/:issueId', issueController.getIssueById);
router.put('/update/:issueId', issueController.updateIssueById);
router.put('/update-status/:issueId', issueController.updateIssueStatusById);
router.put('/complete/:issueId', issueController.updateIssueStatusToComplete);
router.get('/get-logs-of-user/:issueId', issueController.getUserLogsByIssueId);


module.exports = router;
