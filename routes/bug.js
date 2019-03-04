var express = require('express');
var router = express.Router();
var bugController = require('./../controller/bug.controller');
var auth = require('./auth');

router.post('/add-bug', bugController.addBug);
router.get('/get-all', bugController.getAllBug);
router.delete('/delete/:bugId', bugController.deleteBugById);
router.get('/get-by-id/:bugId', bugController.getBugById);
router.put('/update/:bugId', bugController.updateBugById);
router.put('/update-status/:bugId', bugController.updateBugStatusById);
router.put('/complete/:bugId', bugController.updateBugStatusToComplete);
router.get('/get-logs-of-user/:bugId', bugController.getUserLogsByBugId);


module.exports = router;
