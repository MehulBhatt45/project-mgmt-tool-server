var express = require('express');
var router = express.Router();
var taskController = require('./../controller/task.controller');
var auth = require('./auth');

router.post('/add-task', taskController.addTask);
router.get('/get-all', taskController.getAllTask);
router.delete('/delete/:taskId', taskController.deleteTaskById);
router.get('/get-by-id/:taskId', taskController.getTaskById);
router.put('/update/:taskId', taskController.updateTaskById);
router.put('/update-status/:taskId', taskController.updateTaskStatusById);
router.put('/complete/:taskId', taskController.updateTaskStatusToComplete);
router.get('/get-logs-of-user/:taskId', taskController.getUserLogsByTaskId);



module.exports = router;
