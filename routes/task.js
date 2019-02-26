var express = require('express');
var router = express.Router();
var taskController = require('./../controller/task.controller');
var auth = require('./auth');

router.post('/add-task',auth.isAuthenticatedJWT, taskController.addTask);
router.get('/get-all',auth.isAuthenticatedJWT, taskController.getAllTask);
router.delete('/delete/:taskId',auth.isAuthenticatedJWTForManager, taskController.deleteTaskById);
router.get('/get-by-id/:taskId',auth.isAuthenticatedJWT, taskController.getTaskById);
router.put('/update/:taskId',auth.isAuthenticatedJWT, taskController.updateTaskById);
router.put('/update-status/:taskId',auth.isAuthenticatedJWT, taskController.updateTaskStatusById);
router.put('/complete/:taskId',auth.isAuthenticatedJWTForManager, taskController.updateTaskStatusToComplete);
router.get('/get-logs-of-user/:taskId',auth.isAuthenticatedJWTForManager, taskController.getUserLogsByTaskId);



module.exports = router;
