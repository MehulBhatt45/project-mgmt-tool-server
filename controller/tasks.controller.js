var tasksModel = require('../model/tasks.model');
var projectModel = require('../model/project.model');
var userModel = require('../model/user.model');
var _ = require('lodash');
let tasksController = {};
var dir = require('node-dir');
var mkdir = require('mkdirp');
var path = require('path');
var fs = require('fs');

tasksController.addTasks = function(req , res){
	console.log("cottrectt ;");

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
					fileNames.push(gotFile.fd.split('/').reverse()[2]+"/"+gotFile.fd.split('/').reverse()[1]+"/"+gotFile.fd.split('/').reverse()[0])
				})
			}
			tasksModel
			.find({projectId : req.body.projectId})
			.sort({"_id" : -1})
			.limit(1)
			.exec((err , foundTask)=>{
				if(err){
					console.log(err);
					res.status(500).send(err);
				}else if(foundTask && foundTask.length == 1){
					console.log("found Task ====>" , foundTask);
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
							console.log("found user ======>" , savedTask.assignTo);
							if(savedTask.assignTo){

								userModel.findOne({_id: savedTask.assignTo._id})
								.exec((err , foundedUser)=>{
									foundedUser.tasks.push(savedTask._id);
									foundedUser.save();
									res.status(200).send(savedTask);
								})
							}
							else{
								console.log("final task======>" , savedTask);
								res.status(200).send(savedTask);	
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
								}
								resp.save();	

								console.log("final task======>" , savedTask);
								res.status(200).send(savedTask);	
							})	
						}).catch((err)=>{
							console.log(err);
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
	.populate('assignTo createdBy')
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
			// res.send(updatedData);
		}
	} )
}
tasksController.getAllTask = function(req , res){
	tasksModel
	.find({})
	.populate('projectId assignTo')
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
