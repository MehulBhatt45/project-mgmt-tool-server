var express = require('express');
const SALT_WORK_FACTOR = 10;
var router = express.Router();
var userController = require('./../controller/user.controller');
var auth = require('./auth');
/* GET users listing. */
router.post('/signup',userController.addUser);
router.post('/login',userController.logIn);
router.put('/update-details/:id', userController.updateUserById);
<<<<<<< HEAD
router.get('/get-logs/:userId',  userController.getUserWorkLogs);
router.get('/get-all-developers',  userController.getAllUsers);
=======
router.get('/get-logs/:userId', userController.getUserWorkLogs);
router.get('/get-all-developers', userController.getAllUsers);
>>>>>>> 8c73e675a177e1ad1cf881163245c80dfeef84b6
router.post('/get-all-developers-by-project-manager', userController.getAllUsersByProjectManager);

module.exports = router;
