var leaveModel = require ('../model/leave.model');
var tasksModel = require('../model/tasks.model');
var userModel = require('../model/user.model');
var projectModel = require('../model/project.model');
var notificationModel = require('../model/notification.model'); 
var sendnotificationModel = require('../model/sendNotification.model');
var nodemailer = require ('nodemailer');
const smtpTransport = require ('nodemailer-smtp-transport');
let leaveController = {};
var nodemailer = require('nodemailer');
var mkdir = require('mkdirp');
var path = require('path');
var fs = require('fs');
var dir = require('node-dir');
var _ = require('lodash');
var pushNotification = require('./../service/push-notification.service');
var mongoose = require('mongoose');
var maillist = [];
var mailContent = "";
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


leaveController.applyLeave = function(req,res){
	console.log("nthi mdtu ke mde che", req.body);
	var leave = new leaveModel(req.body);
	var duration = leave.leaveDuration;
	leave.save(function(err,leave){
		if(err) {
			res.status(500).send(err)
		}else{	
			console.log("APPLY LEAVE++++++===================>", leave);
			var uploadPath = path.join(__dirname, "../uploads/"+leave._id+"/");
			console.log("upload path=======<",uploadPath);
			req.file('attechment').upload({
				maxBytes: 50000000,
				dirname: uploadPath,
				saveAs: function (__newFileStream, next){
					dir.files(uploadPath, function(err,files){
						if (err){
							mkdir(uploadPath, 0775);
							return next(undefined, __newFileStream.filename);
						}else {
							return next(undefined, __newFileStream.filename);
						}
					});
				}
			}, function(err,files){
				if(err){
					console.log(err);
					res.status(500).send(err);
				}else{
					console.log(files);
					var fileNames = [];
					if (files.length>0){
						_.forEach(files, (gotFile)=>{
							fileNames.push(gotFile.fd.split('/uploads/').reverse()[0]);
						})
					}
					leave['attechment'] = fileNames;
					leaveModel.findOneAndUpdate({_id:leave._id}, {$set:{attechment:fileNames}},{upsert:true, new:true} )
					.exec((err,uploadFile)=>{
						if(err){
							console.log(err);
							res.status(500).send(err);
						}else{
							projectModel
							.find({Teams : mongoose.Types.ObjectId(leave.id)})
							.populate('pmanagerId')
							.exec((err,project)=>{
								console.log("projects=========>",project);
								console.log("uniqueId==============================>",project.uniqueId)
								var projects = [];
								for(i=0;i<project.length;i++){
									projects.push(...project[i].pmanagerId);
								}
								var object = [];
								console.log("pmanagerId array======>",typeof projects);
								_.forEach(projects, pro=>{
									object.push({ pmanagerId: pro });
								})
								userModel
								.findOne({userRole : "admin"})
								.exec((err, user)=>{
									if (err) {
										res.status(500).send(err);
									}else{
										admin = [];
										admin.push(user);
										console.log("admin array------------->",admin);
										var output = [];
										_.forEach(object, ob=>{
											output.push(ob.pmanagerId._id)
										})
										output.push(admin[0]._id);
										console.log("output=================>",output);
										userModel
										.find({_id : output})
										.exec((err,mailId)=>{
											console.log("mailId---------",mailId)
											for(i=0;i<mailId.length;i++){
												maillist.push(mailId[i].email);
											}
											console.log("maillist=================>",maillist);
										})
										console.log("output length=========================>",output.length);
										console.log("OBJECT========>",object);
										var pmName = [];
										pmName.join({});
										for(i=0;i<object.length;i++){
											var pmanagerId = object[i].pmanagerId.name;
											pmName.push({pmanagerId});
										}
										
										if(duration == "0.5" || duration == "1"){
											var obj = {
												"subject" :"Your Team member has applied for leave .",
												"contentForPm" : "Your teamMate <strong>" +leave.name+ "</strong> has applied for " + req.body.leaveDuration+ " day leave (" +req.body.startingDate+ ")",
												"contentForAdmin" : leave.name+" Team member of <strong>" +project[0].title+ "</strong> has applied for 1 day leave (" +req.body.startingDate+ ")",
												"sendTo" : output,
												"type" : "leave",
												"pmStatus": pmName
											} 
										}else{
											var obj = {
												"subject" :"Your Team member has applied for leave .",
												"contentForPm" : "Your teammate <strong>" +leave.name+ "</strong> has applied for " +req.body.leaveDuration+ " days leave (" +req.body.startingDate+ " to " +req.body.endingDate+ ")",
												"contentForAdmin" : leave.name+" Team member of <strong>" +project[0].title+ "</strong> has applied for "+ req.body.leaveDuration+ " days leave (" +req.body.startingDate+ " to " +req.body.endingDate+ ")",
												"sendTo" : output,
												"type" : "leave",
												"pmStatus": pmName
											} 
										}
										console.log("obj==================>",obj);
										var notification = new sendnotificationModel(obj);
										notification.save(function(err,SavedUser){
											if(err){
												console.log("err==========================================>",err);
											}else{
												console.log("saveData=========================------->",SavedUser);
												notificationModel
												.find({userId: output})
												.exec((err, user)=>{
													console.log("userr====>",user);
													if (err) {
														console.log("err",err);
														res.status(500).send(err);
													}else{
														req.session.user = user;
														req.session.userarray = [];
														console.log("length===>",user.length);
														for(i=0;i<user.length;i++){
															req.session.userarray.push(req.session.user[i].token);
														}
														console.log("token array======>",req.session.userarray);
														pushNotification.postCode(obj.subject,obj.type,req.session.userarray);
													}
												})
											}

										})
									}
								})
							})
							var type =req.body.typeOfLeave;
							if(type == 'Sick_Leave'){
								leaveType = "Sick leave";
							}else if(type == 'Emergency_Leave'){
								leaveType = "Emergency leave";
							}else if(type == 'Leave_WithoutPay'){
								leaveType = "Without pay";
							}else{
								leaveType = "Personal leave";
							}
							if(req.body.leaveDuration == 0.5 || req.body.leaveDuration == 1){
								if(req.body.leaveDuration == 0.5){
									leaveDuration = "Half Day"
								}else{
									leaveDuration = "Full Day"
								}
								
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
								<div style="width:85%;margin:0 auto;border-radius:4px;border:1px solid white;background:white;box-sizing: border-box; ">
								<div style="margin-left:30px;padding:0;">
								<p style="color:black;font-size:20px;">You have a new Leave Application from <span style="font-weight:bold;">`+req.body.name+`</span></p>
								<table style="color:black;">
								<tr style="height: 50px;">
								<td><b>Duration</b></td>
								<td style="padding-left: 50px;">`+leaveDuration+`</td></tr>
								<tr style="height: 50px;width: 100%;">
								<td><b>Starting Date</b></td>
								<td style="padding-left: 50px;color:#3998c5;">`+req.body.startingDate+`</td></tr>
								<tr  style="height: 50px;">
								<td><b>Type of leave</b></td>
								<td style="padding-left: 50px;">`+leaveType+`</td></tr>
								<tr style="height: 50px;">
								<td><b>Reason</b></td>
								<td style="padding-left: 50px;">`+req.body.reasonForLeave+`</td></tr>
								</table>
								</div>
								</div>
								</div>
								</body>
								</html>
								`;

							}else{
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
								<div style="width:85%;margin:0 auto;border-radius:4px;border:1px solid white;background-color:white;box-sizing: border-box; ">
								<div style="margin-left:30px;padding:0;">
								<p style="color:black;font-size:20px;">You have a new Leave Application from <span style="font-weight:bold;">`+req.body.name+`</span></p>
								<table style="color:black;">
								<tr style="height: 50px;">
								<td><b>No. of days</b></td>
								<td style="padding-left: 50px;">`+req.body.leaveDuration+` days</td></tr>
								<tr style="height: 50px;width: 100%;">
								<td><b>Starting Date</b></td>
								<td style="padding-left: 50px;color:#3998c5;">`+req.body.startingDate+`</td></tr>
								<tr style="height: 50px;width: 100%;">
								<td><b>Ending Date</b></td>
								<td style="padding-left: 50px;color:#3998c5;">`+req.body.endingDate+`</td></tr>
								<tr  style="height: 50px;">
								<td><b>Type of leave</b></td>
								<td style="padding-left: 50px;">`+leaveType+`</td></tr>
								<tr style="height: 50px;">
								<td><b>Reason</b></td>
								<td style="padding-left: 50px;">`+req.body.reasonForLeave+`</td></tr>
								</table>
								</div>
								</div>
								</div>
								</body>
								</html>
								`;

							}

							var mailOptions = {
								from: 'raoinfotechp@gmail.com',
								to: maillist,
								subject: 'New Leave Application',
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
							res.status(200).send(leave)
						}
					})
}
})
}
})
}


leaveController.getTeamsByPmanagerId = function(req, res){
	var pmanagerId = req.params.pmanagerId;
	projectModel
	.find({pmanagerId :pmanagerId})
	.select('projects Teams')
	.exec((err , found)=>{
		if( err) res.send(err);
		else{
			res.send(found);
		}
	})
}
leaveController.getLeaves = function(req,res){
	leaveModel.find({status: "pending"})
	.exec((err,resp)=>{
		if(err){ 
			console.log("error======>",err);
			res.status(500).send(err) 
		}
		else{
			res.status(200).send(resp)
		}
	})
}


leaveController.getLeavesById = function(req,res){
	leaveModel.find({email:req.body.email})
	.exec((err,respond)=>{
		if(err){
			console.log("error",err);
			res.status(500).send(err)
		}
		else{
			console.log("response============<<<<<<<<<<<<<",respond);
			res.status(200).send(respond);
		}
	})
}
leaveController.getAllLeaves = function(req,res){
	leaveModel.find({})
	.exec((err,respond)=>{
		if(err){
			console.log("error",err);
			res.status(500).send(err)
		}
		else{
			console.log("response============<<<<<<<<<<<<<",respond);
			res.status(200).send(respond);
		}
	})
}

leaveController.getByUserId = function(req,res){
	useremail = req.params.useremail;
	console.log("userid==========>>>>",useremail);
	leaveModel.find({email:useremail})
	.exec((err,respond)=>{
		if(err){
			console.log("error",err);
			res.status(500).send(err)
		}
		else{
			console.log("response============<<<<<<<<<<<<<",respond);
			res.status(200).send(respond);
		}
	})
}

leaveController.getById = function(req,res){
	leaveId = req.params.leaveId;

	leaveModel.find({_id:leaveId})
	.exec((err,respond)=>{
		if(err){
			console.log("error",err);
			res.status(500).send(err)
		}
		else{
			console.log("response============<<<<<<<<<<<<<",respond);
			res.status(200).send(respond);
		}
	})
}


leaveController.getApprovedLeaves = function(req,res){
	leaveModel.find({status:'approved'})
	.exec((err,respond)=>{
		if(err){
			console.log("error",err);
			res.status(500).send(err);
		}
		else{
			console.log("respnose of approved",respond);
			res.status(200).send(respond);
		}
	})
}



leaveController.getRejectedLeaves = function(req,res){
	leaveModel.find({status: 'rejected'})
	.exec((err,negative)=>{
		if(err){
			console.log("errrrrrr",err);
			res.status(500).send(err);
		}
		else{
			console.log("negative response=======>",negative);
			res.status(200).send(negative);
		}
	})
}

leaveController.getAllLeavesApps = function(req,res){
	leaveModel.find({})
	.exec((err,listOfLeaves)=>{
		if(err){
			console.log("error",err);
			res.status(500).send(err)
		}
		else{
			console.log("list of all leaves application",listOfLeaves);
			res.status(200).send(listOfLeaves);
		}
	})
}

leaveController.updateLeaves = function(req,res){
	console.log("req boddy =======++>" , req.body);
	console.log("req boddy1 =======++>" , req.params);
	console.log("final date=============>",req.body.startingDate);
	leaveModel.findOneAndUpdate({_id: req.params.id},req.body,{upsert:true , new: true},function(err,update){
		console.log("Updated ==================>" , update);
		var status = update.status;
		var email = update.email;
		var duration = update.leaveDuration;
		console.log("email=======>",email);
		console.log("Duration===================>",duration);
		if(status == "approved"){
			projectModel
			.find({Teams : update.id})
			.exec((err,project)=>{
				console.log("projects=========>",project);
				projects = [];
				for(i=0;i<project.length;i++){
					console.log("push");
					projects.push(project[i].pmanagerId);
				}
				console.log("pmanagerId array======>",projects);
				var object = [].concat.apply([],projects);
				console.log("USERRRRR========>",object);
				notificationModel
				.find({userId: object})
				.exec((err, user)=>{
					if (err) {
						res.status(500).send(err);
					}else{
						console.log("userrrrrrrrrrrrrrrr====>",user);
						projects = [];
						for(i=0;i<user.length;i++){
							console.log("push");
							projects.push(user[i].userId);
						}
						console.log("pmanagerId array======>",projects);
						userModel
						.find({_id : projects})
						.exec((err,users)=>{
							if(err){
								console.log("ERROR====>",err);
							}else{
								console.log("userRole========>",users);
								userrole = [];
								for(i=0;i<users.length;i++){
									userrole.push(users[i].userRole)
									console.log("projectManager=======>",userrole);
								}
								if( duration == "1" || duration == "0.5"){
									var obj2 = {
										"subject" : "approved leave", 
										"content" : "<strong>" +update.name+ "</strong> has applied for leave on " +req.body.startingDate+ " and it's approved.",
										"sendTo" : projects,
										"type" : "leaveAccepted",
									}
									mailContent = update.name+ " has applied for leave on " +req.body.startingDate+ " and it's ";
									// console.log("type of====>481", mailContent);
								}else{
									var obj2 = {
										"subject" : "approved leave", 
										"content" : "<strong>" +update.name+ "</strong> has applied for leave on " +req.body.startingDate+ " to " + req.body.endingDate+ " and it's ",
										"sendTo" : projects,
										"type" : "leaveAccepted",
									}

									mailContent = update.name+ " has applied for leave on " +req.body.startingDate+ " to " + req.body.endingDate+ " and it's approved.";
									// console.log("type of====>491", mailContent);

								}
								console.log("mailcontent===========>",mailContent);
								if(duration == "0.5" || duration == "1"){
									var	obj1 = {
										"subject" :"Congratulations! Your leave has been approved.",
										"content" : "Hello <span style='color:red;'>"+update.name+"</span>, your leave application for " +req.body.startingDate+ " is <strong> approved </strong>.", 
										"sendTo" : update.id,
										"type" : "leave-accepted"
									}
									console.log("obj=======>",obj1);
								}else{
									var	obj1 = {
										"subject" :"Congratulations! Your leave has been approved.",
										"content" : "Hello <span style='color:red;'>"+update.name+"</span>, your leave application form " +req.body.startingDate+ " to "+ req.body.endingDate+ " is <strong> approved </strong>.", 
										"sendTo" : update.id,
										"type" : "leave-accepted"
									}
									
									console.log("obj=======>",obj1);
								}
								var notification = new sendnotificationModel(obj1);
								notification.save(function(err,SavedUser){
									notificationModel
									.findOne({userId: update.id})
									.exec((err, user)=>{
										if (err) {
											res.status(500).send(err);
										}else{
											console.log("useer==>",user);
											pushNotification.postCode(obj1.subject,obj1.type,[user.token]);
										}
									})
									console.log("Leave Accepted");
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
									<div style="width:85%;margin:0 auto;border-radius:4px;border:1px solid white;background-color:white;box-sizing: border-box; ">
									<div style="margin-left:30px;padding:0;">
									<p style="color:black;font-size:20px;">Congratulation!` +req.body.name+` Your leave for ` + req.body.noOfDays+` on `+req.body.startingDate+` is <span style="color:#28B463;font-weight:bold;">APPROVED.</span></p>
									</div>
									</div>
									</div>
									</body>
									</html>
									`;

									var mailOptions = {
										from: 'raoinfotechp@gmail.com',
										to: email,
										subject: 'Leave Approval',
										text: 'Hi, this is a testing email from node server',
										html: output
									};
									transporter.sendMail(mailOptions, function(error, info){
										if (error) {
											console.log("Error",error);
										} else {
											console.log('Email sent: 586' + info.response);
										}
									});
									console.log("just before mail ============>",mailContent);
									console.log("before email===============>",email);
									var output1 = `<!doctype html>
									<html>
									<head>
									<title> title111</title>
									</head>
									<body>
									<div style="width:100%;margin:0 auto;border-radius: 2px;box-shadow: 0 1px 3px 0 rgba(0,0,0,.5); 
									border: 1px solid #d3d3d3;background:#e7eaf0;">
									<div style="border:10px solid #3998c5;background:#fff;margin:25px;">
									<center><span style="font-size:30px;color:#181123;"><b>Rao Infotech</b></span></center>	
									<div style="width:85%;margin:0 auto;border-radius:4px;border:1px solid white;background-color:white;box-sizing: border-box; ">
									<div style="margin-left:30px;padding:0;">
									<p style="color:black;font-size:20px;">Your teammate `+mailContent+` <span style="color:#35b139;"> Approved</span>.</p>
									</div>
									</div>
									</div>
									</body>
									</html>
									`;
									var mailOptions1 = {
										from: 'raoinfotechp@gmail.com',
										to: maillist,
										subject: 'Leave Approval',
										text: 'Hi, this is a testing email from node server',
										html: output1
									};
									transporter.sendMail(mailOptions1, function(error, info){
										if (error) {
											console.log("Error",error);
										} else {
											console.log('Email sent: 618' + info.response);
										}
									});
								})
								var notification = new sendnotificationModel(obj2);
								notification.save(function(err,SavedUser){
									notificationModel
									.findOne({userId: projects})
									.exec((err, user)=>{
										if (err) {
											res.status(500).send(err);
										}else{
											console.log("admin===========>",user);

											pushNotification.postCode(obj2.subject,obj2.content,[user.token]);
											res.status(200).send(update);
										}

									})

								})
								userModel
								.find({_id : projects})
								.exec((err,mailId)=>{
									console.log("mailId=======>",mailId);
									for(i=0;i<mailId.length;i++){
										maillist.push(mailId[i].email);
									}
									console.log("maillist===========>",maillist);
								})
							}
						})
}

})
})

}else if(status == "rejected"){
	projectModel
	.find({Teams : update.id})
	.exec((err,project)=>{
		console.log("projects=========>",project);
		projects = [];
		for(i=0;i<project.length;i++){
			console.log("push");
			projects.push(project[i].pmanagerId);
		}
		console.log("pmanagerId array======>",projects);
		var object = [].concat.apply([],projects);
		console.log("USERRRRR========>",object);
		notificationModel
		.find({userId: object})
		.exec((err, user)=>{
			if (err) {
				res.status(500).send(err);
			}else{
				console.log("userrrrrrrrrrrrrrrr====>",user);
				projects = [];
				for(i=0;i<user.length;i++){
					console.log("push");
					projects.push(user[i].userId);
				}
				console.log("pmanagerId array======>",projects);
				if(duration == "1" || duration == "0.5"){
					var obj2 = {
						"subject" : "rejected leave", 
						"content" : "" +update.name+ " has applied for leave on " +req.body.startingDate+ " and it's <strong> rejected </strong>.",
						"sendTo" : projects,
						"type" : "leaveAccepted",
					}
				}else{
					var obj2 = {
						"subject" : "rejected leave ", 
						"content" : "" +update.name+ " has applied for leave on " +req.body.startingDate+ " to " + req.body.endingDate+ "and it's <strong> rejected </strong>.",
						"sendTo" : projects,
						"type" : "leaveAccepted",
					}
				}
			}
			userModel
			.find({_id : projects})
			.exec((err,mailId)=>{
				console.log("mailId=======>",mailId);
				for(i=0;i<mailId.length;i++){
					maillist.push(mailId[i].email);
				}
				console.log("maillist===========>",maillist);
			})
			var notification = new sendnotificationModel(obj2);
			notification.save(function(err,SavedUser){

				notificationModel
				.findOne({userId: projects})
				.exec((err, user)=>{
					if (err) {
						res.status(500).send(err);
					}else{
						console.log("admin===========>",user);
						pushNotification.postCode(obj2.subject,obj2.type,[user.token]);
					}
				})
				if(duration == "1" || duration == "0.5"){
					var	obj1 = {
						"subject" :"Sorry! Your leave has been rejected.",
						"content" : "Sorry "+update.name+", your leave application for " +req.body.startingDate+ " is <strong> rejected </strong>.", 
						"sendTo" : update.id,
						"type" : "leave-rejected"
					}
					mailContent = update.name+ " has applied for leave on " +req.body.startingDate+ " and it's";
				}else{
					var	obj1 = {
						"subject" :"Sorry! Your leave has been rejected.",
						"content" : "Sorry "+update.name+", your leave application form " +req.body.startingDate+ " to "+ req.body.endingDate+ " is <strong> rejected </strong>.", 
						"sendTo" : update.id,
						"type" : "leave-rejected"
					}
					mailContent = update.name+ " has applied for leave on " +req.body.startingDate+ " to " + req.body.endingDate+ " and it's";
				}
				var notification = new sendnotificationModel(obj1);
				notification.save(function(err,SavedUser){
					notificationModel
					.findOne({userId: update.id})
					.exec((err, user)=>{
						console.log("useer==>",user);
						if (err) {
							res.status(500).send(err);
						}else{

							console.log("sucess");
							pushNotification.postCode(obj1.subject,obj1.type,[user.token]);
						}
					})
				})
				console.log("Leave Rejected");
				console.log("before email===============>",email);
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
				<div style="width:85%;margin:0 auto;border-radius:4px;border:1px solid white;background-color:white;box-sizing: border-box; ">
				<div style="margin-left:30px;padding:0;">
				<p style="color:black;font-size:20px;">Sorry!` +req.body.name+` Your leave for ` + req.body.noOfDays+` on `+req.body.startingDate+` is <span style="color:#E74C3C;font-weight:bold;">REJECTED.</p>
				</div>
				</div>
				</div>
				</body>
				</html>
				`;
				var mailOptions = {
					from: 'raoinfotechp@gmail.com',
					to: email,
					subject: 'Leave Reject',
					text: 'Hi, this is a testing email from node server',
					html: output
				};
				transporter.sendMail(mailOptions, function(error, info){
					if (error) {
						console.log("Error",error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				})
				console.log("before mail===========>",mailContent);
				var output1 = `<!doctype html>
				<html>
				<head>
				<title> title111</title>
				</head>
				<body>
				<div style="width:100%;margin:0 auto;border-radius: 2px;box-shadow: 0 1px 3px 0 rgba(0,0,0,.5); 
				border: 1px solid #d3d3d3;background:#e7eaf0;">
				<div style="border:10px solid #3998c5;background:#fff;margin:25px;">
				<center><span style="font-size:30px;color:#181123;"><b>Rao Infotech</b></span></center>	
				<div style="width:85%;margin:0 auto;border-radius:4px;border:1px solid white;background-color:white;box-sizing: border-box; ">
				<div style="margin-left:30px;padding:0;">
				<p style="color:black;font-size:20px;">Your teammate `+mailContent+`<span style="color:#dc5871;"> Rejected</span>.</p>
				</div>
				</div>
				</div>
				</body>
				</html>
				`;

				var mailOptions1 = {
					from: 'raoinfotechp@gmail.com',
					to: maillist,
					subject: 'Leave Rejection',
					text: 'Hi, this is a testing email from node server',
					html: output1
				};
				transporter.sendMail(mailOptions1, function(error, info){
					if (error) {
						console.log("Error",error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});

				res.status(200).send(update)

			})
})
})

}else{
	console.log("mail not send");
	console.log("mail not send");
}
})

}
leaveController.AddComments = function(req,res){
	leaveId = req.body.leaveId;
	comment = req.body.comment;
	console.log("leaveid====>>",leaveId);
	console.log("comment",comment);
	leaveModel.findOneAndUpdate({_id:leaveId},{$set:{comment:comment}},{upsert:true, new:true})
	.exec((err,comments)=>{
		if(err){
			console.log("error",err);
			res.status(500).send(err)
		}
		else{
			console.log("id==============>",comments.id)
			res.status(200).send(comments);
		}
	})
}

module.exports = leaveController;