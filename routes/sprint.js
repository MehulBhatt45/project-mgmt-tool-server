var express = require('express');
var router = express.Router();
var sprintController = require('../controller/sprint.controller');


/* GET home page. */
router.post('/add-sprint',sprintController.addSprint);
router.put('/start-sprint',sprintController.startSprint);
router.get('/sprint-by-projects/:projectId',sprintController.getSprintByProject);
router.delete('/delete-sprint-by-id/:sprintId',sprintController.deleteSprintById);
router.put('/update-sprint-by-id/:sprintId',sprintController.updateSprintById);
router.get('/sprint-by-sprint-id/:sprintId',sprintController.sprintBySprintId);
router.get('/sprint-complete/:sprintId',sprintController.completeSprint);

module.exports = router;
