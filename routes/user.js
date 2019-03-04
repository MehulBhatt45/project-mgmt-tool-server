var express = require('express');
const SALT_WORK_FACTOR = 10;
var router = express.Router();
var userController = require('./../controller/user.controller');
var auth = require('./auth');
/* GET users listing. */
router.post('/signup',userController.addUser);
router.post('/login',userController.logIn);
router.put('/update-details/:id', auth.isAuthenticatedJWT, userController.updateUserById);
router.get('/get-logs/:userId', auth.isAuthenticatedJWT, userController.getUserWorkLogs);
router.get('/get-all-developers', auth.isAuthenticatedJWT, userController.getAllUsers);
router.post('/get-all-developers-by-project-manager', userController.getAllUsersByProjectManager);

module.exports = router;
