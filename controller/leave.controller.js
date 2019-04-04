var leaveModel = require ('../model/leave.model');
var userModel = require('../model/user.model');
var projectModel = require('../model/project.model');
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





leaveController.applyLeave = function(req,res){
	console.log("fun ma jay che ke nai ============>",req.body);
	// userModel.find({userRole: ''})
	// userModel.find({email: req.body.email})
	// console.log("ave che kai=========>",req.body)
	var leave = new leaveModel(req.body);
	console.log("nthi mdtu ke mde che", leave);
	leave.save(function(err,leave){
		if(err) res.status(500).send(err)

			else{	
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
								<p style="color:black;font-size:20px;">You have a new Leave Application from <span style="font-weight:bold;">`+req.body.name+`</span></p>

								<table style="color:black;">
								<tr style="height: 50px;">
								<td><b>Duration</b></td>
								<td style="padding-left: 50px;">`+req.body.leaveDuration+`</td></tr>

								<tr style="height: 50px;">
								<td><b>Duration</b></td>
								<td style="padding-left: 50px;">`+req.body.noOfDays+`</td></tr>

								<tr style="height: 50px;width: 100%;">
								<td><b>Leave Date</b></td>
								<td style="padding-left: 50px;">`+req.body.startingDate+`</td></tr>

								<tr style="height: 50px;width: 100%;">
								<td><b>Leave Date</b></td>
								<td style="padding-left: 50px;">`+req.body.endingDate+`</td></tr>


								<tr  style="height: 50px;">
								<td><b>Type of leave</b></td>
								<td style="padding-left: 50px;">`+req.body.typeOfLeave+`</td></tr>


								<tr style="height: 50px;">
								<td><b>Reason</b></td>
								<td style="padding-left: 50px;">`+req.body.reasonForLeave+`</td></tr>

								</table>
								</div>
								</body>
								</html>
								`;

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


								var mailOptions = {
									from: 'raoinfotechp@gmail.com',
									to: 'foramtrada232@gmail.com',
									subject: 'Testing Email',
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
								pushNotification.postCode('dynamic title','dynamic content',req.session.userarray);
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
			console.log("response=====>",resp);

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

// leaveController.myLeaves = function(req,res){
// 	var userId = req.params.id
// 	console.log("userId is -------------======>",userId);
// 	userModel.findByIdAndUpdate({_id:userId})
// 	.exec((err,status)=>{
// 		if(err){
// 			res.status(500).send(err);
// 		}else{
// 			leaveModel.find({status:'approved'}, {status:'rejected'}), function(err,respond){
// 				if(err){
// 					res.status(500).send(err);
// 				}else{
// 					console.log("ressssssssssp",respond)
// 				}
// 			}		
// 		}
// 	})
// }
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

// leaveController.getAllLeavesByProjectManager = function(req,res){
// 	leaveModel.find({})
// 	.exec((err,listOfLeaves)=>{
// 		if (err) 
// 		{
// 			console.log("error",err);
// 			res.status(500).send(err)
// 		}

// }

leaveController.updateLeaves = function(req,res){
	console.log("req boddy =======++>" , req.body);
	console.log("req boddy =======++>" , req.params);
	leaveModel.findOneAndUpdate({_id: req.params.id},req.body,{upsert:true , new: true},function(err,update){
		console.log("Updated ==================>" , update);
		var status = update.status;
		var email = update.email;
		console.log("email===>",email);
		console.log("status====>",status);
		

		if(status == "approved"){
			console.log("Leave Accepted");
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
			<p style="color:black;font-size:20px;">Your leave is <span style="color:#28B463;font-weight:bold;">APPROVED.</span></p>
			</div>
			</body>
			</html>
			`;

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


			var mailOptions = {
				from: 'raoinfotechp@gmail.com',
				to: email,
				subject: 'Testing Email',
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
			res.status(200).send(update);
		}else if(status == "rejected"){
			console.log("Leave Rejected");
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
			<p style="color:black;font-size:20px;">Your leave is <span style="color:#E74C3C;font-weight:bold;">REJECTED.</p>


			</div>
			</body>
			</html>
			`;

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


			var mailOptions = {
				from: 'raoinfotechp@gmail.com',
				to: email,
				subject: 'Testing Email',
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
			res.status(200).send(update)
		}
		else{
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
			res.status(200).send(comments);
		}
	})
}

module.exports = leaveController;
