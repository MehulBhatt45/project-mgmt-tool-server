var express = require('express');
var router = express.Router();
var sendnotificationController = require('../controller/sendNotification.controller');

router.post('/addNotification',sendnotificationController.addNotification);
router.get('/get-notification-By-Id/:id',sendnotificationController.getNotificationByUserId);

module.exports = router;