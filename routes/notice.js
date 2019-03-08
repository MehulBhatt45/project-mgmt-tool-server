var express = require('express');
var router = express.Router();
var noticeController = require('../controller/notice.controller');

/* GET home page. */
router.post('/add-notice',noticeController.addNoticeWithoutImage);
router.post('/add-notice/file',noticeController.addNoticeWithImage);
router.post('delete-notice',noticeController.deleteNotice);
router.get('/allnotice',noticeController.getAllNotice);
router.get('/updatenotice',noticeController.updateNotice);

module.exports = router;


