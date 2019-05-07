var express = require('express');
var router = express.Router();
var sendnotificationController = require('../controller/sendNotification.controller');

router.post('/addNotification',sendnotificationController.addNotification);
router.get('/get-notification-By-Id/:id',sendnotificationController.getNotificationByUserId);
router.get('/get-unread-notification/:id',sendnotificationController.getUnreadNotification);
router.get('/get-pm-notification/:id/:status',sendnotificationController.updateNotificationByStatus);
// router.get('/get-notification/:id',sendnotificationController.updateNotificationRejectedStatus);
module.exports = router;