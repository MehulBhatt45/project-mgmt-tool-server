var express = require('express');
var router = express.Router();
var requirementController = require('./../controller/requirement.controller');
var auth = require('./auth');

router.post('/add-requirement',auth.isAuthenticatedJWT, requirementController.addRequirement);
router.get('/get-all',auth.isAuthenticatedJWT, requirementController.getAllRequirement);
router.delete('/delete/:requirementId',auth.isAuthenticatedJWTForManager, requirementController.deleteRequirementById);
router.get('/get-by-id/:requirementId',auth.isAuthenticatedJWT, requirementController.getRequirementById);
router.put('/update/:requirementId',auth.isAuthenticatedJWT, requirementController.updateRequirementById);
router.put('/update-status/:requirementId',auth.isAuthenticatedJWT, requirementController.updateRequirementStatusById);
router.put('/complete/:requirementId',auth.isAuthenticatedJWTForManager, requirementController.updateRequirementStatusToComplete);



module.exports = router;
