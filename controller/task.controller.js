var taskModel = require('./../model/task.model');
var projectModel = require('../model/project.model');
var _ = require('lodash');
var nodemailer = require('nodemailer');
let taskController = {};

taskController.addTask = function(req,res){
	if(!req.body.assignTo && req.user.userRole != 'projectManager'){
		req.body['assignTo'] = req.user._id;
	}
	req.body['createdBy'] = req.user._id;
	req.body['startDate'] = Date.now()
	var task = new taskModel(req.body);
	task.save(function(err,Savedtask){
		projectModel.findOne({_id: Savedtask.projectId})
		.exec((err, resp)=>{
			if (err) res.status(500).send(err);
			resp.taskId.push(Savedtask._id);
			if(!_.includes(resp.Teams, Savedtask.assignTo))
				resp.Teams.push(Savedtask.assignTo);
			resp.save();
			res.status(200).send(Savedtask);
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'foramtrada232@gmail.com',
					// pass: 'yourpassword'
				}
			});

			var mailOptions = {
				from: 'foramtrada232@gmail.com',
				to: 'komalsakhiya21@gmail.com',
				subject: 'Sending Email using Node.js',
				text: 'That was easy!'
			};

			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});

		})
	})
}

taskController.getAllTask = function(req,res){
	taskModel.find({}).exec(function(err,tasks){
		if (err) res.status(500).send(err);
		else if(tasks) res.status(200).send(tasks);
		else res.status(404).send("Not Found");
	})
}

taskController.deleteTaskById = function(req,res){
	var taskId = req.params.taskId;
	taskModel.findOneAndDelete({_id:taskId}).exec(function(err,deletedtask){
		if (err) res.status(500).send(err);
		else if(deletedtask){
			projectModel.findOne({_id: deletedtask.projectId})
			.exec((err, resp)=>{
				if (err) res.status(500).send(err);
				else if(resp){
					resp.taskId.splice(_.findIndex(resp.taskId, deletedtask._id), 1);
					resp.save();
					res.status(200).send(deletedtask);
				}else{
					res.status(404).send("Not Found");		
				}
			})
		}else{
			res.status(404).send("Not Found");
		}
	})

}


taskController.getTaskById = function(req,res){
	var taskId = req.params.taskId;
	console.log("task ID===========>>>>>",taskId);
	taskModel.findOne({_id:taskId}).exec(function(err,singletask){
		if (err) res.status(500).send(err);
		else if(singletask) res.status(200).send(singletask);
		else res.status(404).send("Not Found");
	})

}

taskController.updateTaskById = function(req,res){
	var taskId = req.params.taskId;
	taskModel.findOneAndUpdate({_id:taskId},{$set:req.body},{upsert:true, new:true},function(err,Updatedtask){
		if (err) res.status(500).send(err);
		else if(Updatedtask) {
			projectModel.findOne({_id: Updatedtask.projectId})
			.exec((err, resp)=>{
				if (err) res.status(500).send(err);
				if(!_.includes(resp.Teams, Updatedtask.assignTo))
					resp.Teams.push(Updatedtask.assignTo);
				resp.save();
				res.status(200).send(Updatedtask);

			})
		}
		else res.status(404).send("Not Found");
	})
}

taskController.updateTaskStatusById = function(req,res){
	var taskId = req.params.taskId;
	if(req.body.status!=='complete'){
		taskModel.findOne({_id: taskId}).exec((err, task)=>{
			if (err) res.status(500).send(err);
			else if(task){
				var timelog = task.timelog;
				timelog.push({
					operation: "shifted to "+req.body.status+" from "+task.status,
					dateTime: Date.now(),
					operatedBy: req.body.operatorId
				})
				taskModel.findOneAndUpdate({_id:taskId},{$set:{status: req.body.status, timelog: timelog, startDate: req.body.status=='in progress'?Date.now():'' }},{upsert:true, new:true},function(err,Updatedtask){
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

taskController.updateTaskStatusToComplete = function(req,res){
	var taskId = req.params.taskId;
	if(req.body.status==='complete'){
		taskModel.findOne({_id: taskId}).exec((err, task)=>{
			if (err) res.status(500).send(err);
			else if(task){
				taskModel.findOneAndUpdate({_id:taskId},{$set:{status: req.body.status, completedAt: Date.now()}},{upsert:true, new:true},function(err,Updatedtask){
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

taskController.getUserLogsByTaskId = function(req,res){
	var taskId = req.params.taskId;
	taskModel.findOne({_id: taskId}).exec((err, task)=>{
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}else if(task){
			taskModel.find({ "timelog": {$elemMatch: { operatedBy: req.body.userId }}}).exec((error, taskLog)=>{
				if(error){
					console.log(error);
				}
				res.status(200).send(taskLog);
			})
		}
		else res.status(404).send("Not Found");
	})
}


module.exports = taskController;