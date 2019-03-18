var notificationModel = require('../model/notification.model');
let notificationController = {};

notificationController.addUser = function(req,res){
	console.log("notificatiion data",req.body);

	var notification = new notificationModel(req.body);
	notification.save(function(err,SavedUser){
		if (err) res.status(500).send(err);
		res.status(200).send(SavedUser);
	})
}

notificationController.getAllUsers = function(req, res){
	notificationModel.find({})
	.exec((err,users)=>{
		if (err) {
			res.status(500).send(err);
		}else if (users){
			res.status(200).send(users);
			req.session.users = users;
			console.log("response in session",req.session.users);
		}else{
			res.status(404).send( { msg : 'Users not found' });
		}
	})
}

notificationController.getUserById = function(req, res){
	userId = req.params.userId;
	notificationModel.findOne({userId:userId})
	.exec((err,users)=>{
		if (err) {
			res.status(500).send(err);
		}else if (users){
			res.status(200).send(users);
		}else{
			res.status(404).send( { msg : 'Users not found' });
		}
	})
}


module.exports = notificationController; 
