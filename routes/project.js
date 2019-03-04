var express = require('express');
var router = express.Router();
var projectController = require('../controller/project.controller');
var auth = require('./auth');

/* GET home page. */
router.post('/add-project', auth.isAuthenticatedJWT, projectController.addProject);
router.get('/all', projectController.getAllProject);
router.get('/get-project-by-id/:projectId', projectController.getProjectById);
router.delete('/delete/:projectId',auth.isAuthenticatedJWT, projectController.deleteProjectById);
router.put('/update/:projectId',auth.isAuthenticatedJWT, projectController.updateProjectById);
router.get('/get-by-title', projectController.getAllProjectOrderByTitle);
router.post('/upload-file', projectController.uploadFilesToFolder);
router.post('/get-all-files', projectController.getAllFiles);
router.post('/delete-file', projectController.deleteFile);

module.exports = router;
