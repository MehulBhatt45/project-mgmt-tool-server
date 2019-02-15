var express = require('express');
var router = express.Router();
var taskController = require('./../controller/task.controller');

router.post('/', taskController.addTask);
router.get('/:taskId', taskController.getTaskById);
router.get('/', taskController.getAllTask);
router.delete('/:taskId', taskController.deleteTaskById);
router.put('/:taskId', taskController.updateTaskById);

module.exports = router;
