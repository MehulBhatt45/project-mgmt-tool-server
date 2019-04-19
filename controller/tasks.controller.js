var tasksModel = require('../model/tasks.model');
var projectModel = require('../model/project.model');
var userModel = require('../model/user.model');
var notificationModel = require('../model/notification.model');
var sendnotificationModel = require('../model/sendNotification.model');
var _ = require('lodash');
let tasksController = {};
var dir = require('node-dir');
var mkdir = require('mkdirp');
var path = require('path');
var fs = require('fs');
var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

var pushNotification = require('./../service/push-notification.service');
var transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	service: 'gmail',
	auth: {
		user: 'tnrtesting2394@gmail.com',
		pass: 'raoinfotech09'
	}
});
var uniqueId;

tasksController.addTasks = function(req , res){
	
	var uploadPath = path.join(__dirname, "../uploads/"+req.body.projectId+"/");
	console.log(uploadPath);
	req.file('fileUpload').upload({
		maxBytes: 50000000000000,
		dirname: uploadPath,
		saveAs: function (__newFileStream, next) {
			dir.files(uploadPath, function(err, files) {
				if (err){
					mkdir(uploadPath, 0775);
					return next(undefined, __newFileStream.filename);
				}else {
					return next(undefined, __newFileStream.filename);
				}
			});
		}
	}, function(err, files){
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}else{
			console.log(files)
			var fileNames=[];
			if(files.length>0){
				_.forEach(files, (gotFile)=>{
					fileNames.push(gotFile.fd.split('/uploads/').reverse()[0])
				})
			}
			tasksModel
			.find({projectId : req.body.projectId})
			.populate('createdBy ')
			.sort({"_id" : -1})
			.limit(1)
			.exec((err , foundTask)=>{
				if(err){
					console.log(err);
					res.status(500).send(err);
				}else if(foundTask && foundTask.length == 1){
					var projectId = foundTask[0].projectId;
					console.log("FINAL PROJECT ID====>",projectId);
					console.log("found Task =================================>" , foundTask);
					console.log("pID====>",foundTask[0].projectId);
					console.log("pmanager=============>", foundTask.createdBy);
					console.log("errTask ====>" , err);
					foundTask = foundTask[0].uniqueId.split("-");
					var count = +foundTask[1]+ +1;
					console.log("found Task ====>" , +foundTask[1]+ +1);
					req.body['uniqueId'] = foundTask[0]+"-" + count;
					req.body['startDate'] = Date.now();
					if(req.body.dueDate=='undefined')
						delete req.body['dueDate'];
					console.log("req.body ====>" , req.body);
					var saveTask = new tasksModel(req.body);
					saveTask['images']=fileNames;
					saveTask.save((err , savedTask)=>{
						console.log(err, savedTask);
						if(err) res.status(500).send(err);
						projectModel.findOne({_id: savedTask.projectId})
						.exec((err , resp)=>{
							resp.tasks.push(savedTask._id);
							var flag = 5;
							var final = 1
							var q = JSON.stringify(savedTask.assignTo);
							console.log("type of ==>", typeof q);
							for(var i = 0;i< resp.Teams.length ; i++){
								var p = JSON.stringify(resp.Teams[i]);
								flag = p.localeCompare(q);
								console.log("flag ===>" , flag);
								if(flag == 0){
									final = 0;
								}
							}
							console.log("final ===>" , final);
							if(final == 1){
								resp.Teams.push(savedTask.assignTo);
							}
							resp.save();
							if(savedTask.assignTo){
								userModel.findOne({_id: savedTask.assignTo._id})
								.exec((err , foundedUser)=>{
									foundedUser.tasks.push(savedTask._id);
									foundedUser.save();
									console.log("resp1 receive");

									var priority1 = req.body.priority;
									var color = req.body.color;;
									var color;
									if(priority1 == '1'){
										prior = "Highest";
										color = "#ff0000";
									}else if(priority1 == '2'){
										prior = "High";
										color = "#ff8100";
									}else if(priority1 == '3'){
										color = "#ffee21";
										prior = "Medium";
									}else{
										color="#0087ff";
										prior = "Low";
									}
									tasksModel.findOne({_id: savedTask._id})
									.populate('assignTo createdBy projectId')
									.exec((err,foundTask)=>{
										console.log(' found email send===>',foundTask);
										console.log("cretedby======>",foundTask.createdBy.name);
										console.log("project title=============>",foundTask.projectId.title);
										console.log("final----->>>",foundTask.assignTo.email);
										console.log("priority================================>",foundTask.priority);
										var email = foundTask.assignTo.email;
										console.log("email===>>>>>",email);

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
										<p style="color:black;font-size:20px;">You have been assigned a <span style="text-transform:uppercase;color:`+color+`">`+prior+`</span> priority task.</p>
										<p style="color:black;font-size:16px;">Please,Complete Your Task before deadline.</p>
										<table style="color:black;">
										<tr style="height: 50px;width: 100%;">
										<td><b>Title</b></td>
										<td style="padding-left: 50px;">`+req.body.title+`</td></tr>

										<tr style="height: 50px;">
										<td><b>Description</b></td>
										<td style="padding-left: 50px;">`+req.body.desc+`</td></tr>


										<tr  style="height: 50px;">
										<td><b>Priority</b></td>
										<td style="padding-left: 50px;">`+prior+`</td></tr>


										</table>
										</div>
										</body>
										</html>
										`;
										var mailOptions = {
											from: 'tnrtesting2394@gmail.com',
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
										var obj = {
											"subject" :" You have been assigned a new task",
											"content" : "A new task in <strong>" +foundTask.projectId.title + " </strong> is been created by <strong>" +foundTask.createdBy.name + " </strong> and assigned to you.",
											"sendTo" : foundTask.assignTo._id,
											"type" : "task",
											"priority" : foundTask.priority,
											"projectId" : projectId,
										} 
										console.log("obj==================>",obj);
										var notification = new sendnotificationModel(obj);
										notification.save(function(err,savedNotification){
											if(err){
												res.status(500).send(err);		
											}
											var assignTo = foundTask.assignTo._id;
											notificationModel
											.findOne({userId : assignTo})
											.exec((err, user)=>{
												if (err) {
													res.status(500).send(err);
												}else{
													console.log("savedNotification======>>>>>",user);
													pushNotification.postCode(obj.subject,obj.type,[user.token]);
													res.status(200).send(savedTask);
												}
											})

											
										}) 
									})
								})
}
})
})
}else{
	projectModel.find({_id: req.body.projectId})
	.exec((err , foundProject)=>{
		foundProject = foundProject[0].uniqueId.split("-");
		var txt = foundProject[0];
		req.body['uniqueId'] = txt +"-" + 1;
		req.body['startDate'] = Date.now();
		console.log("first task of the project =====>" , req.body);
		var saveTask = new tasksModel(req.body);
		saveTask['images']=fileNames;
		console.log(saveTask);
		saveTask.save().then((savedTask)=>{
			console.log("savd Tsk ===> " , savedTask);
			projectModel.findOne({_id: savedTask.projectId})
			.exec((err , resp)=>{
				resp.tasks.push(savedTask._id);
				var flag = 5;
				var final = 1
				var q = JSON.stringify(savedTask.assignTo);
				console.log("type of ==>", typeof q);
				for(var i = 0;i< resp.Teams.length ; i++){
					var p = JSON.stringify(resp.Teams[i]);
					flag = p.localeCompare(q);
					console.log("flag ===>" , flag);
					if(flag == 0){
						final = 0;
					}
				}
				console.log("final ===>" , final);
				if(final == 1){
					resp.Teams.push(savedTask.assignTo);
					console.log("resp received");
				}
				resp.save();	
				console.log("final task======>" , savedTask);
				var priority1 = req.body.priority;
				var color = req.body.color;
				if(priority1 == '1'){
					prior = "Highest";
					color = "#ff0000";
				}else if(priority1 == '2'){
					prior = "High";
					color = "#ff8100";
				}else if(priority1 == '3'){
					color = "#ffee21";
					prior = "Medium";
				}else{
					color="#0087ff";
					prior = "Low";
				}
			});


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
			<p style="color:black;font-size:20px;">You have been assigned a <span style="text-transform:uppercase;color:`+req.body.color+`">`+prior+`</span> priority task.</p>
			<p style="color:black;font-size:16px;">Please,Complete Your Task before deadline.</p>
			<table style="color:black;">
			<tr style="height: 50px;width: 100%;">
			<td><b>Title</b></td>
			<td style="padding-left: 50px;">`+req.body.title+`</td></tr>

			<tr style="height: 50px;">
			<td><b>Description</b></td>
			<td style="padding-left: 50px;">`+req.body.desc+`</td></tr>


			<tr  style="height: 50px;">
			<td><b>Priority</b></td>
			<td style="padding-left: 50px;">`+prior+`</td></tr>


			</table>
			</div>
			</body>
			</html>
			`;


			var mailOptions = {
				from: 'tnrtesting2394@gmail.com',
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
			var obj = {
				"subject" :" You have been assigned anew task",
				"content" : "A new task in " +foundTask.projectId.title + " project is been created by " +foundTask.createdBy.name + " and assigned to you.",
				"sendTo" : foundTask.assignTo._id,
				"type" : "task",
				"priority" : foundTask.priority,
			} 
			console.log("obj==================>",obj);
			var notification = new sendnotificationModel(obj);
			notification.save(function(err,savedNotification){
				if(err){
					res.status(500).send(err);		
				}
				var assignTo = foundTask.assignTo._id;
				notificationModel
				.findOne({userId : assignTo})
				.exec((err, user)=>{
					if (err) {
						res.status(500).send(err);
					}else{

						console.log("savedNotification======>>>>>",user);
						pushNotification.postCode('dynamic title','dynamic content',[user.token]);
						res.status(200).send(savedTask);
					}
				})

			}) 
		})
	})

}
})
}
})
// })
}

tasksController.getTaskByProjectId = function(req , res){
	console.log("req.parasm :" , req.params);
	var projectId = req.params.id;
	tasksModel.find({projectId : projectId})
	.populate('assignTo createdBy ')
	.exec((err , foundTask)=>{
		if(err) res.send("err");
		else res.send(foundTask);
	})
}


tasksController.updateTaskById = function(req , res){
	var userId;
	var taskId = req.params.taskId;
	var lastTask = false;
	console.log("taskId ======+>" , taskId);
	console.log("req. body =====+>" , req.body);
	req.body.images = req.body.images?req.body.images.split(','):[];
	console.log("req. body =====+>" , req.body);
	var uploadPath = path.join(__dirname, "../uploads/"+req.body.projectId+"/");
	console.log(uploadPath);
	req.file('fileUpload').upload({
		maxBytes: 50000000000000,
		dirname: uploadPath,
		saveAs: function (__newFileStream, next) {
			dir.files(uploadPath, function(err, files) {
				if (err){
					mkdir(uploadPath, 0775);
					return next(undefined, __newFileStream.filename);
				}else {
					return next(undefined, __newFileStream.filename);
				}
			});
		}
	}, function(err, files){
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}else{
			console.log(files);
			tasksModel.findOne({_id: taskId}, function(err , task){

				var fileNames=req.body.images;
			// fileNames.push(req.body.images);

			if(files.length>0){
				_.forEach(files, (gotFile)=>{
					fileNames.push(gotFile.fd.split('/uploads/').reverse()[0])
				})
			}
			console.log(fileNames);
			req.body['images'] = fileNames;
			console.log("req. body =====+>" , req.body);
			tasksModel.findOneAndUpdate({_id: taskId} , req.body , {upsert: true , new: true}, function(err , updatedData){
				if(err) res.send("err");
				else{
					projectModel.findOne({_id: updatedData.projectId})
					.exec((err , resp)=>{
						var flag = 5;
						var final = 1
						var q = JSON.stringify(updatedData.assignTo);
						console.log("type of ==>", typeof q);
						for(var i = 0;i< resp.Teams.length ; i++){
							var p = JSON.stringify(resp.Teams[i]);
							flag = p.localeCompare(q);
							console.log("flag ===>" , flag);
							if(flag == 0){
								final = 0;
							}
						}
						console.log("final ===>" , final);
						if(final == 1){
							resp.Teams.push(updatedData.assignTo);
						}
						resp.save();	

						console.log("final task======>" , updatedData);
						userModel.findOne({_id: updatedData.assignTo})
						.exec((err , user)=>{
							user.tasks.push(updatedData._id);
							user.save();	
							console.log("final task======>" , updatedData);
							res.status(200).send(updatedData);	
						})
					})
				}
			})
		})
		}
	});
}
tasksController.getAllTask = function(req , res){
	tasksModel
	.find({})
	.populate('projectId assignTo createdBy')
	.exec((err , allTasks)=>{
		if(err) res.send('err');
		else res.send(allTasks);
	})
}
tasksController.updateTaskStatusById = function(req , res){
	var taskId = req.body._id;
	console.log("taskID ========>" , taskId);
	if(req.body.status!=='complete'){
		tasksModel.findOne({_id: taskId}).exec((err, task)=>{
			if (err) res.status(500).send(err);
			else if(task){
				var timelog = task.timelog;
				timelog.push({
					operation: "shifted to "+req.body.status+" from "+task.status,
					dateTime: Date.now(),
					operatedBy: req.body.operatorId
				})
				tasksModel.findOneAndUpdate({_id:taskId},{$set:{status: req.body.status, timelog: timelog, startDate: req.body.status=='in progress'?Date.now():'' }},{upsert:true, new:true},function(err,Updatedtask){
					if (err) res.status(500).send(err);
					else if(Updatedtask) res.status(200).send(Updatedtask);
					else res.status(404).send("Not Found");
				})
			}
			else res.status(404).send("Not Found");
		})
	}else{
		res.status(403).send("Bad Request");
	}
}
tasksController.updateTaskStatusCompleted = function(req , res){
	console.log("hey it works");
	var taskId = req.body._id;
	console.log("req . body of complete ======>" , req.body);
	if(req.body.status==='complete'){
		tasksModel.findOne({_id: taskId}).exec((err, task)=>{
			if (err) res.status(500).send(err);
			else if(task){
				tasksModel.findOneAndUpdate({_id:taskId},{$set:{status: req.body.status, completedAt: Date.now()}},{upsert:true, new:true},function(err,Updatedtask){
					if (err) res.status(500).send(err);
					else if(Updatedtask) res.status(200).send(Updatedtask);
					else res.status(404).send("Not Found");
				})
			}
			else res.status(404).send("Not Found");
		})
	}else{
		res.status(403).send("Bad Request");
	}
}
tasksController.deleteTaskById = function(req  , res){
	taskId = req.params.taskId;
	console.log("taskID =====> ", taskId);
	tasksModel.deleteOne({_id : taskId} , function(err , removed){
		if(err) res.send(err);
		else res.status(200).send(removed);
	});
}
module.exports = tasksController;







        