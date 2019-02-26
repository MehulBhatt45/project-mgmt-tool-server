var express = require('express');
const SALT_WORK_FACTOR = 10;
var router = express.Router();
var userController = require('./../controller/user.controller');
var auth = require('./auth');
/* GET users listing. */
router.post('/signup',userController.addUser);
router.post('/login',userController.logIn);
router.put('/update-details/:id', auth.isAuthenticatedJWT, userController.updateUserById);
router.get('/get-logs/:userId', auth.isAuthenticatedJWTForManager, userController.getUserWorkLogs);

module.exports = router;
