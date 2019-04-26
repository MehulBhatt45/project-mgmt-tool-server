var notificationModel = require('../model/notification.model');
var sendnotificationModel = require('../model/sendNotification.model');
var projectModel = require('../model/project.model');
var userModel = require('../model/user.model');
let sendnotificationController = {};
var pushNotification = require('./../service/push-notification.service');

sendnotificationController.addNotification = function(req, res){
	var temp =  req.body.sendTo;
	console.log("send to ===>" , temp);
	temp =  temp.split(",");
	console.log("send to after===>" , temp);
	req.body.sendTo = temp;
	console.log("bodyyyyyyyyyy=====>",req.body);
	projectModel.findOne({_id: req.body.projectId})
	.exec((err,projectId)=>{
		if (err){
			res.status(500).send(err);
		}else{
			console.log("project name=========>",projectId);
			console.log("pmanagerIdpmanagerId====>",projectId.pmanagerId);
			console.log("req.body.sendTo.length=======>",req.body.sendTo.length);
			if (err) {
				console.log("errrr",err);
				res.status(404).send(err);
			}else{
				if(req.body.sendTo.length > 1){
					console.log("first============================>");
					var obj = {
						"subject": "You have new notification from Pmanager.",
						"content": projectId.uniqueId +" team," +req.body.content+".Regards " + req.body.pmanagerName+ ".",
						"sendTo": req.body.sendTo,
						"type" : "other"
					}
				}else{
					console.log("Second=========================================>");
					var obj = {
						"subject": "You have new notification from Pmanager.",
						"content": "You have new notice from " +req.body.pmanagerName+ ".",
						"sendTo": req.body.sendTo,
						"type" : "other"
					}
				}
				console.log("saved object===>",obj);
				var notification = sendnotificationModel(obj);
				notification.save(function(err,SavedUser){
					console.log("objj===========>",SavedUser);
					notificationModel
					.find({userId: SavedUser.sendTo})
					.exec((err, user)=>{
						console.log("userr====>",user);
						if (err) {
							console.log("err",err);
							res.status(404).send(err);
						}else{
							req.session.user = user;
							req.session.userarray = [];
							console.log("length===>",user.length);
							for(i=0;i<user.length;i++){
								req.session.userarray.push(req.session.user[i].token);
								console.log("arrayyyy===>");
								console.log("token array======>",req.session.userarray);
							}
							pushNotification.postCode(obj.subject,obj.content,req.session.userarray);
						}
					})
					res.status(200).send(SavedUser);
				})
			}
		}
	})
}

sendnotificationController.getNotificationByUserId = function(req,res){
	var sendTo = req.params.id;
	sendnotificationModel
	.find({sendTo : sendTo})
	.populate('sendTo , projectId')
	.exec((err,user)=>{
		if (err) {
			res.status(500).send(err);
		}else{
			console.log("userrr=>>>",user);
			console.log("length==========>",user.length);
			for(i=0;i<user.length;i++){
			sendnotificationModel
			.findOneAndUpdate({_id:user[i]._id} , {upsert:true,new:true})
			.exec((err , updatedFlag)=>{
				if(err){
					res.status(500).send(err);
				}
				else{
					updatedFlag.seenFlag = true;
					updatedFlag.save();
				}
			})	
				}
			res.status(200).send(user);
		}
	})
}

sendnotificationController.getUnreadNotification = function(req,res){
	var seenFlag = 'false';
	var unreadNotification = [];
	var sendTo = req.params.id;
	sendnotificationModel
	.find({sendTo : sendTo})
	.exec((err,unread)=>{
		if(err){
			res.status(500).send(err);
		}else{
		for(i=0;i<unread.length;i++){
			if (unread[i].seenFlag == false) {
				console.log("data=======>",unread);
				unreadNotification.push(unread);
			}
		}
		console.log("length===============>",unreadNotification.length);
		res.status(200).send(unreadNotification);
		}
	})
}
module.exports = sendnotificationController; 






