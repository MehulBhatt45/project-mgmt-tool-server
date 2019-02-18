var express = require('express');
var router = express.Router();
var projectController = require('./../controller/project.controller');

/* GET home page. */
router.post('/addProject', projectController.addProject);
router.get('/all', projectController.getAllProject);
router.get('/:projectId', projectController.getProjectById);
router.delete('/:projectId', projectController.deleteProjectById);
router.put('/:projectId', projectController.updateProjectById);


module.exports = router;
