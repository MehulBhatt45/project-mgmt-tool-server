var express = require('express');
var router = express.Router();
var bugController = require('./../controller/bug.controller');

router.post('/', bugController.addBug);
router.get('/', bugController.getAllBug);
router.delete('/:bugId', bugController.deleteBugById);
router.get('/:bugId', bugController.getBugById);
router.put('/:bugId', bugController.updateBugById);

module.exports = router;
