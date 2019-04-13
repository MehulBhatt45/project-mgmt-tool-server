var notificationModel = require('../model/notification.model');
var sendnotificationModel = require('../model/sendNotification.model');
var projectModel = require('../model/project.model');
let sendnotificationController = {};
var pushNotification = require('./../service/push-notification.service');


sendnotificationController.addNotification = function(req, res){
	// var temp =  req.body.sendTo;
	// 			console.log("send to ===>" , temp);
	// 			temp =  temp.split(",");
	// 			console.log("send to after===>" , temp);
	// 			req.body.sendTo = temp;
	// 			console.log(req.body);
	console.log(req.body);
	var notification = new sendnotificationModel(req.body);
	projectModel.findOne({_id: req.body.projectId})
	.exec((err,projectId)=>{
		if (err){
			res.status(500).send(err);
		}else{

	notification.save(function(err,SavedUser){
		if (err) {
			console.log("errrr",err);
			res.status(500).send(err);
		}else{
			console.log("notification",SavedUser);
			var obj = {
				"id": SavedUser.sendTo,
				"title": SavedUser.subject,
				"desc": SavedUser.content,
			}
			console.log("saved object===>",obj);
			notificationModel
			.find({userId: SavedUser.sendTo})
			.exec((err, user)=>{
				console.log("userr====>",user);
				if (err) {
					console.log("err",err);
					res.status(500).send(err);
				}else{
					req.session.user = user;
					req.session.userarray = [];
					for(i=0;i<user.length;i++){
						req.session.userarray.push(req.session.user[i].token);
					console.log("arrayyyy===>");
					console.log("token array======>",req.session.userarray);
					}
					pushNotification.postCode(SavedUser.subject,SavedUser.content,req.session.userarray);
				}
			})
			res.status(200).send(SavedUser);
		}
	});
		}
	})

}


sendnotificationController.getNotificationByUserId = function(req,res){
	console.log("cdcdcds");
	var sendTo = req.params.id;
 sendnotificationModel.find({sendTo : sendTo})
 .populate('sendTo , projectId')
 .exec((err,user)=>{
 	if (err) {
 		res.status(500).send(err);
 	}else{
 		console.log("userrr=>>>",user);
 		res.status(200).send(user);
 	}
 })
}

	module.exports = sendnotificationController; 
