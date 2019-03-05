var express = require('express');
var router = express.Router();
var projectController = require('../controller/project.controller');
var auth = require('./auth');

/* GET home page. */
<<<<<<< HEAD
router.post('/add-project', auth.isAuthenticatedJWTForManager,projectController.addProject);
router.post('/add-project/simple', auth.isAuthenticatedJWTForManager,projectController.addProject2);
=======
router.post('/add-project', projectController.addProject);
>>>>>>> cd81d18b76d4867aa0fb55acfd9439e4da4c5e6b
router.get('/all', projectController.getAllProject);
router.get('/get-project-by-id/:projectId', projectController.getProjectById);
router.delete('/delete/:projectId', projectController.deleteProjectById);
router.put('/update/:projectId', projectController.updateProjectById);
router.get('/get-by-title', projectController.getAllProjectOrderByTitle);
router.post('/upload-file', projectController.uploadFilesToFolder);
router.post('/get-all-files', projectController.getAllFiles);
router.post('/delete-file', projectController.deleteFile);

module.exports = router;
