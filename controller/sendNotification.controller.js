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
			if (err) {
				console.log("errrr",err);
				res.status(404).send(err);
			}else{
				projectModel
				.find({_id : req.body.projectId})
				.exec((err,project)=>{
					console.log("project-------->",project);
					
					if(req.body.sendTo.length > 1){
						obj = {
							"subject": "You have new notification from Pmanager.",
							"content": projectId.uniqueId +" team," +req.body.content+".Regards " + req.body.pmanagerName+ ".",
							"sendTo": req.body.sendTo,
							"type" : "other"
						}
						mailContent = req.body.pmanagerName+ "project manger of" +project[0].title+ "notified to you.";
					}else{
						obj = {
							"subject": "You have new notification from Pmanager.",
							"content": "You have new notice from " +req.body.pmanagerName+ ".",
							"sendTo": req.body.sendTo,
							"type" : "other"
						}
						mailContent = req.body.pmanagerName+ "project manager of" +project[0].title+ "notified to all team member.";
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
					userModel
					.find({_id : req.body.sendTo})
					.exec((err,mailId)=>{

						console.log("mailId========>",mailId);
						for(i=0;i<mailId.length;i++){
												maillist.push(mailId[i].email);
											}
											console.log("maillist=================>",maillist);
					})
				
					var output = `<!doctype html>
										<html>
										<head>
										<title> title111</title>
										</head>
										<body>
										<div style="width:75%;margin:0 auto;border-radius: 6px;
										box-shadow: 0 1px 3px 0 rgba(0,0,0,.5); 
										border: 1px solid #d3d3d3;">
										<center>
										<img src="https://raoinformationtechnology.com/wp-content/uploads/2018/12/logo-median.png"></center>
										<div style="margin-left:30px;padding:0;">
										<p style="color:black;font-size:20px;">`+mailContent+`</p>
									
										</div>
										</body>
										</html>
										`;
										var mailOptions = {
											from: 'tnrtesting2394@gmail.com',
											to: maillist,
											subject: 'For New Notice',
											text: 'Hi, this is a testing email from node server',
											html: output
										};


						var output = `<!doctype html>
						<html>
						<head>
						<title> title111</title>
						</head>
						<body>
						<div style="width:100%;margin:0 auto;border-radius: 2px;box-shadow: 0 1px 3px 0 rgba(0,0,0,.5); 
						border: 1px solid #d3d3d3;background:#e7eaf0;">
						<div style="border:10px solid #3998c5;background:#fff;margin:25px;">
						<center><span style="font-size:30px;color:#181123;"><b>Rao Infotech</b></span></center>	
						<background img>
						<div style="width:85%;margin:0 auto;border-radius:4px;border:1px solid white;background-color:white;box-sizing: border-box; ">
						<div style="margin-left:30px;padding:0;">
						<p style="color:black;font-size:20px;"> `+req.body.pmanagerName+` project manger of ` +project[0].title+` notified to all team member that `+req.body.content+`.</p>
						</div>
						</div>
						</div>
						</body>
						</html>
						`;
						var mailOptions = {
							from: 'tnrtesting2394@gmail.com',
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
	.populate('sendTo projectId')
	.exec((err,user)=>{
		if (err) {
			res.status(500).send(err);
		}else{
			pmArray = [];
			for(i=0;i<user.length;i++){
				userModel
				.find({_id:user[i].pmId})
				.populate('pmId')
			}
			console.log("userrr=>>>",user);
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

sendnotificationController.updateNotificationApprovedStatus = function(req,res){
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
				console.log("sxdsdxsdx----",notification.pmStatus[0].leaveStatus);
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




