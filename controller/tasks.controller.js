
var tasksModel = require('../model/tasks.model');
var projectModel = require('../model/project.model');
var userModel = require('../model/user.model');
var notificationModel = require('../model/notification.model');
var sendnotificationModel = require('../model/sendNotification.model');
var sprintModel = require('../model/sprint.model');
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
		user: 'raoinfotechp@gmail.com',
		pass: 'raoinfotech@123'
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
			res.status(415).send(err);
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
					res.status(404).send(err);
				}else if(foundTask && foundTask.length == 1){
					var projectId = foundTask[0].projectId;

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
							for(var i = 0;i< resp.Teams.length ; i++){
								var p = JSON.stringify(resp.Teams[i]);
								flag = p.localeCompare(q);
								console.log("flag ===>" , flag);
								if(flag == 0){
									final = 0;
								}
							}
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

									var color = req.body.color;
									var color;

									if(priority1 == '1'){
										prior = "Highest";
										color = "#ff0000";
									}else if(priority1 == '2'){
										prior = "High";
										color = "#ff8100";
									}else if(priority1 == '3'){
										color = "#cabb08";
										prior = "Medium";
									}else{
										color="#0087ff";
										prior = "Low";
									}
									tasksModel.findOne({_id: savedTask._id})
									.populate('assignTo projectId createdBy')
									.exec((err,foundTask)=>{
										var name = foundTask.assignTo.name;
										console.log("name of assign usersssssss>>>>><<<<<<<",name);
										var email = foundTask.assignTo.email;
										var sprint = foundTask.sprint;
			
										sprintModel
										.find({_id : sprint})
										.exec((err,sprint)=>{
											console.log("sprint============>",sprint);
											var output = `<!doctype html><html><head><title> title111</title></head><body><div style="width:100%;margin:0 auto;border-radius: 2px;box-shadow: 0 1px 3px 0 rgba(0,0,0,.5);border: 1px solid #d3d3d3;background:#e7eaf0;"><div style="border:10px solid #3998c5;background:#fff;margin:25px;"><center><span style="font-size:30px;color:#181123;"><b>Rao Infotech</b></span></center><div style="width:85%;margin:0 auto;border-radius:4px;background:#fff;"><div style="margin-left:30px;padding:0;"><p style="color:black;font-size:14px;"><b>`+foundTask.createdBy.name+` created a task: </b><span style="color:black;font-size:17px;"><b style="color:#bf4444;">`+req.body.title+`</b> in <span style="color:black;font-size:14px;"><b><u>`+foundTask.projectId.title+`.</u></b></span></span></p><table style="color:black;"><tr style="height: 50px;width: 100<td style="font-size:15px;color:#444;font-family:Helvetica Neue,Helvetica,sans-serif;width:65%;"><b>Sprint: </b><span >`+sprint[0].title+`</span></td><td style="font-size:15px;color:#444;font-family:Helvetica Neue,Helvetica,sans-serif;width:50%"><b>Due date: </b><span>`+req.body.dueDate+`</span></td></tr><tr style="height: 50px;"><td style="font-size:15px;color:#444;font-family:Helvetica Neue,Helvetica,sans-serif;width:65%;"><b>Priority: </b><span style="color:`+color+`">`+prior+`</span></td><td style="font-size:15px;color:#444;font-family:Helvetica Neue,Helvetica,sans-serif;"><b>Estimated time: </b><span>`+foundTask.estimatedTime+`</span></td></tr></table><div style="border-bottom:1px solid #ccc;margin:5px 0 10px;height:1px"></div><div class="m_-7949690059544268696content" style="font-family:'Trebuchet MS',Arial,Helvetica,sans-serif;color:#444;line-height:1.6em;font-size:15px"><p><b>Description: </b>`+req.body.desc+`</p><center><a href="http://localhost:4200/#/project-details/`+foundTask.projectId._id+`"><button style="background-color: #3998c5;border: none;color: white;padding: 10px 25px;text-align: center;text-decoration: none;display: inline-block;border-radius: 4px;margin-bottom: 20px;font-size: 16px;">View Item</button></a></center></div></div></div></div></body></html>`;
											var mailOptions = {
												from: 'tnrtesting2394@gmail.com',
												to: 'foramtrada232@gmail.com',
												subject: 'For New Task',
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
										})
										var obj = {
											"subject" :" You have been assigned a new task","content" : "A new task in <strong>" +foundTask.projectId.title + " </strong> is been created by  and assigned to you.",
											"sendTo" : foundTask.assignTo._id,"type" : "task","priority" : foundTask.priority,"projectId" : projectId,
											"createdAt":foundTask.createdAt,
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
													if(user == null){
														res.status(404).send({msg : "token not generated"})
													}
													res.status(400).send(err);
												}else{
													if(user == null){
														res.status(200).send(foundTask);
													}else{
														console.log("savedNotification======>>>>>",user);
														pushNotification.postCode(obj.subject,obj.type,[user.token]);

														res.status(200).send(foundTask);
													}

													
													// console.log("savedNotification======>>>>>",user);


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
			sprintModel
			.find({_id : sprint})
			.exec((err,sprint)=>{

				var output = `<!doctype html><html><head><title> title111</title></head><body><div style="width:100%;margin:0 auto;border-radius: 2px;box-shadow: 0 1px 3px 0 rgba(0,0,0,.5);border: 1px solid #d3d3d3;background:#e7eaf0;"><div style="border:10px solid #3998c5;background:#fff;margin:25px;"><center><span style="font-size:30px;color:#181123;"><b>Rao Infotech</b></span></center><div style="width:85%;margin:0 auto;border-radius:4px;background:#fff;"><div style="margin-left:30px;padding:0;"><p style="color:black;font-size:14px;"><b>`+foundTask.createdBy.name+` created a task: </b><span style="color:black;font-size:17px;"><b style="color:#bf4444;">`+req.body.title+`</b> in <span style="color:black;font-size:14px;"><b><u>`+foundTask.projectId.title+`.</u></b></span></span></p><table style="color:black;"><tr style="height: 50px;width: 100<td style="font-size:15px;color:#444;font-family:Helvetica Neue,Helvetica,sans-serif;width:65%;"><b>Sprint: </b><span >`+sprint[0].title+`</span></td><td style="font-size:15px;color:#444;font-family:Helvetica Neue,Helvetica,sans-serif;width:50%"><b>Due date: </b><span>`+req.body.dueDate+`</span></td></tr><tr style="height: 50px;"><td style="font-size:15px;color:#444;font-family:Helvetica Neue,Helvetica,sans-serif;width:65%;"><b>Priority: </b><span style="color:`+color+`">`+prior+`</span></td><td style="font-size:15px;color:#444;font-family:Helvetica Neue,Helvetica,sans-serif;"><b>Estimated time: </b><span>`+foundTask.estimatedTime+`</span></td></tr></table><div style="border-bottom:1px solid #ccc;margin:5px 0 10px;height:1px"></div><div class="m_-7949690059544268696content" style="font-family:'Trebuchet MS',Arial,Helvetica,sans-serif;color:#444;line-height:1.6em;font-size:15px"><p><b>Description: </b>`+req.body.desc+`</p><center><a href="http://localhost:4200/#/project-details/`+foundTask.projectId._id+`"><button style="background-color: #3998c5;border: none;color: white;padding: 10px 25px;text-align: center;text-decoration: none;display: inline-block;border-radius: 4px;margin-bottom: 20px;font-size: 16px;">View Item</button></a></center></div></div></div></div></body></html>`;
				var mailOptions = {
					from: 'tnrtesting2394@gmail.com',
					to: email,
					subject: 'For new task',
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
			});
			var obj = {
				"subject" :" You have been assigned a new task","content" : "A new task in " +foundTask.projectId.title + " project is been created by " +foundTask.createdBy.name + " and assigned to you.",
				"sendTo" : foundTask.assignTo._id,"type" : "task","priority" : foundTask.priority,"createdAt":foundTask.createdAt,
			} 
			console.log("obj==================>",obj);
			var notification = new sendnotificationModel(obj);
			notification.save(function(err,savedNotification){
				if(err){
					res.status(406).send(err);		
				}
				var assignTo = foundTask.assignTo._id;
				notificationModel
				.findOne({userId : assignTo})
				.exec((err, user)=>{
					if (err) {
						res.status(404).send(err);
					}else{
						if(user == null){
							res.status(200).send(savedTask);
						}else{
							console.log("savedNotification======>>>>>",user);
							pushNotification.postCode(obj.subject,obj.type,[user.token]);
							res.status(200).send(savedTask);
						}
					}
				})

			}) 
		})
	})

	}
	})
}
	})
}

tasksController.getTaskByProjectId = function(req , res){
	console.log("req.parasm :" , req.params);
	var projectId = req.params.taskId;
	tasksModel.find({projectId : projectId})

	.populate('assignTo createdBy timelog1 sprint')

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
			res.status(415).send(err);
		}else{
			console.log("files of updated task", files);
			tasksModel.findOne({_id: taskId}, function(err , task){

				var fileNames=req.body.images;
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
	.populate('projectId assignTo createdBy timelog1 sprint')
	.exec((err , allTasks)=>{
		if(err) res.send('err');
		else res.send(allTasks);
	})
}
tasksController.updateTaskStatusById = function(req , res){
	var taskId = req.body._id;
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
	}
	else{
		res.status(403).send("Bad Request");
	}
}
tasksController.updateTaskStatusCompleted = function(req , res){
	console.log("hey it works");
	var taskId = req.body._id;
	console.log("req . body of complete ======>" , req.body);
	if(req.body.status ==='complete'){
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

