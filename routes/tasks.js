var express = require('express');
var router = express.Router();
var tasksController = require('./../controller/tasks.controller');
var oldToNewProject = require('./../controller/oldToNewProject.controller');
var auth = require('./auth');

router.get('/convert-project' , oldToNewProject.convertProjects);
router.get('/convert-issue/:pid' , oldToNewProject.getAllIssues);
router.get('/convert-user' , oldToNewProject.updateAllUser);
// router.get('/convert-bugs/:pid' , oldToNewProject.getAllBugs);
router.post('/add-task', tasksController.addTasks);
router.get('/all-task' , tasksController.getAllTask);
router.get('/get-task-by-id/:taskId' , tasksController.getTaskByProjectId);
router.put('/update-task-by-id/:taskId' , tasksController.updateTaskById);
router.put('/update-task-status-by-id' , tasksController.updateTaskStatusById);
router.put('/update-task-status-complete' , tasksController.updateTaskStatusCompleted);
module.exports = router;