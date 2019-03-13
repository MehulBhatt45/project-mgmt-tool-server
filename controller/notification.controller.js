var notificationModel = require('../model/notice.model');
let notificationController = {};

notificationController.addData = function(req,res){
	console.log("notificatiion data",req.body);

	var notification = new notificationModel(req.body);
	notification.save(function(err,SavedUser){
		if (err) res.status(500).send(err);
		res.status(200).send(SavedUser);
	})
}

module.exports = notificationController; 
