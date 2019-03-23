var express = require('express');
var router = express.Router();
var noticeController = require('../controller/notice.controller');

/* GET home page. */
router.post('/add-notice',noticeController.addNotice);
router.delete('/delete-notice-by-id/:noticeId',noticeController.deleteNoticeById);
router.put('/update-notice-by-id/:noticeId',noticeController.updateNoticeById);
router.get('/allnotice',noticeController.getAllNotice);
router.get('/updatenotice',noticeController.updateNotice);
router.put('/change-photo/:noticeId',noticeController.changePhotoById);

module.exports = router;


