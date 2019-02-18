var express = require('express');
var router = express.Router();
var projectController = require('../controller/project.controller');

/* GET home page. */
router.post('/addProject', projectController.addProject);
router.get('/all', projectController.getAllProject);
router.get('/get-project-by-id/:projectId', projectController.getProjectById);
router.delete('/delete/:projectId', projectController.deleteProjectById);
router.put('/update/:projectId', projectController.updateProjectById);
router.get('/get-by-title', projectController.getAllProjectOrderByTitle);


module.exports = router;
