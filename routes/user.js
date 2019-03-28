var express = require('express');
const SALT_WORK_FACTOR = 10;
var router = express.Router();
var userController = require('./../controller/user.controller');
var auth = require('./auth');
/* GET users listing. */
router.post('/signup',userController.addUser);
router.post('/login',userController.logIn);
router.put('/update-details/:id', userController.updateUserById);

// router.get('/get-logs/:userId', userController.getUserWorkLogs);
// router.put('/change-profile/:id', userController.changeProfileByUserId);
// router.get('/get-logs/:userId', userController.getUserWorkLogs);
router.get('/get-all-developers', userController.getAllUsers);
router.put('/reset-password',userController.resetPassword);
// router.post('/send-email',userController.sendEmail);

// router.get('/get-logs/:userId', userController.getUserWorkLogs);
// router.get('/get-all-developers', userController.getAllUsers);
router.post('/get-all-developers-by-project-manager', userController.getAllUsersByProjectManager);
router.put('/change-profile/:id', userController.changeProfileByUserId);

router.get('/get-user-by-id/:userId',userController.getSingleUser);
router.get('/get-user-not-in-project-team/:projectId',userController.getDevelpoersNotInProjectTeam);

// router.post('/signup_without_file',userController.addUser_without_file);
module.exports = router;
