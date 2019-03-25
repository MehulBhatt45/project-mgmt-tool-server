var express = require('express');
var router = express.Router();
var notificationController = require('../controller/notification.controller');

router.post('/addUser',notificationController.addUser);
router.get('/allUsers',notificationController.getAllUsers);
router.get('/userById/:userId',notificationController.getUserById);



module.exports = router;