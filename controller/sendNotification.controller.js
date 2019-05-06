var notificationModel = require('../model/notification.model');
var sendnotificationModel = require('../model/sendNotification.model');
var projectModel = require('../model/project.model');
var userModel = require('../model/user.model');
let sendnotificationController = {};
var pushNotification = require('./../service/push-notification.service');
var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
var pushNotification = require('./../service/push-notification.service');
var maillist = [];
var obj = {};
var mailContent = {};

var transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	service: 'gmail',
	auth: {
		user: 'raoinfotechp@gmail.com',
		pass: 'raoinfotech@123'
	}
});

sendnotificationController.addNotification = function(req, res){
	var temp =  req.body.sendTo;
	temp =  temp.split(",");
	req.body.sendTo = temp;
	projectModel.findOne({_id: req.body.projectId})
	.exec((err,projectId)=>{
		if (err){
			res.status(500).send(err);
		}else{
			if (err) {
				console.log("errrr",err);
				res.status(404).send(err);
			}else{
				projectModel
				.find({_id : req.body.projectId})
				.exec((err,project)=>{					
					if(req.body.sendTo.length > 1){
						obj = {
							"subject": "You have new notification from Pmanager.",
							"content" : req.body.pmanagerName + " project manager of " +project[0].title+ " notified to all team member that "+req.body.content+ ".",
							"sendTo": req.body.sendTo,"type" : "other"
						}
						mailContent = req.body.pmanagerName+ "project manager of" +project[0].title+ "notified to you";
					}else{
						obj = {
							"subject": "You have new notification from Pmanager.","content" : req.body.pmanagerName + " project manager of " +project[0].title+ " notified to you that "+req.body.content+ ".",
							"sendTo": req.body.sendTo,"type" : "other"
						}
						mailContent = req.body.pmanagerName+ "project manager of" +project[0].title+ "notified to all team member";
					}

					var notification = sendnotificationModel(obj);
					notification.save(function(err,SavedUser){
						notificationModel
						.find({userId: SavedUser.sendTo})
						.exec((err, user)=>{
							if (err) {
								console.log("err",err);
								res.status(404).send(err);
							}else{
								req.session.user = user;
								req.session.userarray = [];
								for(i=0;i<user.length;i++){
									req.session.userarray.push(req.session.user[i].token);
								}
								pushNotification.postCode(obj.subject,obj.type,req.session.userarray);
							}
						})
						userModel
						.find({_id : req.body.sendTo})
						.exec((err,mailId)=>{
							for(i=0;i<mailId.length;i++){
								maillist.push(mailId[i].email);
							}
							console.log("maillist============>",maillist);						
						})
						
						var output = `<!doctype html><html><head><title> title111</title></head><body><div style="width:100%;margin:0 auto;border-radius: 2px;box-shadow: 0 1px 3px 0 rgba(0,0,0,.5);border: 1px solid #d3d3d3;background:#e7eaf0;"><div style="border:10px solid #3998c5;background:#fff;margin:25px;"><center><span style="font-size:30px;color:#181123;"><b>Rao Infotech</b></span></center><div style="width:85%;margin:0 auto;border-radius:4px;border:1px solid white;background-color:white;box-sizing: border-box; "><div style="margin-left:30px;padding:0;"><p style="color:black;font-size:15px;"> `+mailContent+`that `+req.body.content+`.</p></div></div></div></body></html>`;
						var mailOptions = {
							from: 'raoinfotechp@gmail.com',
							to: maillist,
							subject: 'For New Notice',
							text: 'Hi, this is a testing email from node server',
							html: output
						};

						transporter.sendMail(mailOptions, function(error, info){
							if (error) {
								console.log("Error",error);
							} else {
								console.log('Email sent: ' + info.response);
							}
						});
						res.status(200).send(SavedUser);
					})
				})
			}
		}
	})
}

sendnotificationController.getNotificationByUserId = function(req,res){
	var sendTo = req.params.id;
	sendnotificationModel
	.find({sendTo : sendTo})
	.exec((err,user)=>{
		if (err) {
			res.status(500).send(err);
		}else{

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
					unreadNotification.push(unread);
				}
			}
			res.status(200).send(unreadNotification);
		}
	})
}

sendnotificationController.updateNotificationByStatus = function(req,res){
	var leaveId = req.params.id;
	var leaveStatus = req.params.status;
	sendnotificationModel
	.findByIdAndUpdate({_id:leaveId} , {upsert:true,new:true})
	.exec((err , notification)=>{
		if (err) {
			res.status(500).send(err);
		}else{
			console.log("notification===========>",notification);
			sendnotificationModel
			.findByIdAndUpdate({})
			if(leaveStatus == 'approved') {
				notification.pmStatus[0].leaveStatus = 'approved';
				notification.save();
			}else{
				notification.pmStatus[0].leaveStatus = 'rejected';
				notification.save();
			}

			res.status(200).send(notification);
		}
	})
}

module.exports = sendnotificationController; 




