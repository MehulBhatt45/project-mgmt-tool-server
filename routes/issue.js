var express = require('express');
var router = express.Router();
var issueController = require('./../controller/issue.controller');
var auth = require('./auth');

router.post('/add-issue',auth.isAuthenticatedJWT, issueController.addIssue);
router.get('/get-all',auth.isAuthenticatedJWT, issueController.getAllIssue);
router.delete('/delete/:issueId',auth.isAuthenticatedJWTForManager, issueController.deleteIssueById);
router.get('/get-by-id/:issueId',auth.isAuthenticatedJWT, issueController.getIssueById);
router.put('/update/:issueId',auth.isAuthenticatedJWT, issueController.updateIssueById);
router.put('/update-status/:issueId',auth.isAuthenticatedJWT, issueController.updateIssueStatusById);
router.put('/complete/:issueId',auth.isAuthenticatedJWTForManager, issueController.updateIssueStatusToComplete);
router.get('/get-logs-of-user/:issueId',auth.isAuthenticatedJWTForManager, issueController.getUserLogsByIssueId);


module.exports = router;
