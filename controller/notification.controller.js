var notificationModel = require('../model/notification.model');
var sendnotificationModel = require('../model/sendNotification.model');

let notificationController = {};
var pushNotification = require('./../service/push-notification.service');




notificationController.addNotification = function(req, res){
	var notification = new sendnotificationModel(req.body);
	console.log(req.body);
	notification.save(function(err,SavedUser){
		if (err) {
			res.status(500).send(err);
		}else{
			console.log("notification",SavedUser);
			
			var obj = {
				"id": SavedUser.sendTo._id,
				"title": "You have new notification",
				"desc": "New notification"
			}
			console.log("saved",obj);
			notificationModel
			.findOne({userId: SavedUser.sendTo})
			.exec((err, user)=>{
				if (err) {
					res.status(500).send(err);
				}else{
					pushNotification.postCode('dynamic title','dynamic content',user.token);
				}
			})
			res.status(200).send(SavedUser);
		}
	});
}
	notificationController.addUser = function(req,res){
		console.log("notificatiion data",req.body);
		var userId = req.body.userId;
		var token = req.body.token;

		notificationModel
		.findOneAndUpdate({userId:userId}, {$set: {token:token}}, { upsert: true, new: true })
		.exec((err , user)=>{
			if (err){
				console.log(err);
				res.status(500).send(err);
			}else if(user){
				user.save();
				res.status(200).send(user);
			}else{
				var notification = new notificationModel(req.body);
				notification.save(function(err,SavedUser){
					if (err) res.status(500).send(err);
					res.status(200).send(SavedUser);
				})
			}	
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
				req.session.userarray = [];

				for(i=0;i<users.length;i++){
					req.session.userarray.push(req.session.users[i].token);
				}

				console.log("token array",req.session.userarray);

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
notificationController.sendNotificationToPmanager = function(req,res){
	var notification = new notificationModel(req.body);
	notification.save(function(err,user){
		if(err){
			res.status(500).send(err);
		}
		res.status(201).send(notification);
	})

}

notificationController.getNotificationOfPmanager = function(req,res){
	notificationModel.find({})
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
