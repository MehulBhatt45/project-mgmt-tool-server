var express = require('express');
var router = express.Router();
var taskController = require('./../controller/task.controller');

router.post('/', taskController.addTask);
router.get('/task-by-duedate', taskController.getAllTaskOrderByDueDate);
router.get('/task-by-title', taskController.getAllTaskOrderByTitle);
router.get('/task-by-startdate', taskController.getAllTaskOrderByStartDate);
router.get('/:taskId', taskController.getTaskById);
router.get('/', taskController.getAllTask);
router.delete('/:taskId', taskController.deleteTaskById);
router.put('/:taskId', taskController.updateTaskById);




module.exports = router;
