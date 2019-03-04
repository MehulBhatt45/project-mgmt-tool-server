var express = require('express');
var router = express.Router();
var requirementController = require('./../controller/requirement.controller');
var auth = require('./auth');

router.post('/add-requirement', requirementController.addRequirement);
router.get('/get-all', requirementController.getAllRequirement);
router.delete('/delete/:requirementId', requirementController.deleteRequirementById);
router.get('/get-by-id/:requirementId', requirementController.getRequirementById);
router.put('/update/:requirementId', requirementController.updateRequirementById);
router.put('/update-status/:requirementId', requirementController.updateRequirementStatusById);
router.put('/complete/:requirementId', requirementController.updateRequirementStatusToComplete);



module.exports = router;
