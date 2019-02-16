var express = require('express');
var router = express.Router();
var requirementController = require('./../controller/requirement.controller');

router.post('/',requirementController.addReque);
router.get('/:requeid',requirementController.getRequeById);
router.get('/',requirementController.getAllReque);
router.delete('/:requeid',requirementController.deleteRequeById);
router.put('/:requeid',requirementController.updateRequeById);


module.exports = router;
