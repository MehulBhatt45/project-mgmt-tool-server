var express = require('express');
var router = express.Router();
var notificationController = require('../controller/notification.controller');

router.post('/addData',notificationController.addData);

module.exports = router;