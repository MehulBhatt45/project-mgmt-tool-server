var express = require('express');
var router = express.Router();
var bugController = require('./../controller/bug.controller');
var auth = require('./auth');

router.post('/add-bug',auth.isAuthenticatedJWT, bugController.addBug);
router.get('/get-all',auth.isAuthenticatedJWT, bugController.getAllBug);
router.delete('/delete/:bugId',auth.isAuthenticatedJWTForManager, bugController.deleteBugById);
router.get('/get-by-id/:bugId',auth.isAuthenticatedJWT, bugController.getBugById);
router.put('/update/:bugId',auth.isAuthenticatedJWT, bugController.updateBugById);
router.put('/update-status/:bugId',auth.isAuthenticatedJWT, bugController.updateBugStatusById);
router.put('/complete/:bugId',auth.isAuthenticatedJWTForManager, bugController.updateBugStatusToComplete);



module.exports = router;
