var tasksModel = require('../model/tasks.model');
var projectModel = require('../model/project.model');
var userModel = require('../model/user.model');
var _ = require('lodash');
let tasksController = {};

tasksController.addTasks = function(req , res){
	console.log("cottrectt ;");
	tasksModel
	.find({projectId : req.body.projectId})
	.sort({"_id" : -1})
	.limit(1)
	.exec((err , foundTask)=>{
		if(err){
			console.log(err);
			res.status(500).send(err);
		}
		else if(foundTask && foundTask.length == 1){
			console.log("found Task ====>" , foundTask);
			console.log("errTask ====>" , err);
			foundTask = foundTask[0].uniqueId.split("-");
		// foundTask = foundTask[1];
		var count = +foundTask[1]+ +1;
		console.log("found Task ====>" , +foundTask[1]+ +1);
		req.body['uniqueId'] = foundTask[0]+"-" + count;
		req.body['startDate'] = Date.now();
		console.log("req.body ====>" , req.body);
		var saveTask = new tasksModel(req.body);
		saveTask.save((err , savedTask)=>{
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
	}
	else{
		projectModel.find({_id: req.body.projectId})
		.exec((err , foundProject)=>{
			foundProject = foundProject[0].uniqueId.split("-");
			var txt = foundProject[0];
			req.body['uniqueId'] = txt +"-" + 1;
			req.body['startDate'] = Date.now();
			console.log("first task of the project =====>" , req.body);
			var saveTask = new tasksModel(req.body);
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

tasksController.getTaskByProjectId = function(req , res){
	console.log("req.parasm :" , req.params);
	var projectId = req.params.taskId;
	tasksModel.find({projectId : projectId})
	.populate('assignTo')
	.exec((err , foundTask)=>{
		if(err) res.send("err");
		else res.send(foundTask);
	})
}

tasksController.updateTaskById = function(req , res){
	var userId;
	var taskId = req.params.taskId;
	var lastTask = false;
	/*tasksModel.findOne({_id: taskId})
	.exec((err , foundTask)=>{
		userId = foundTask.assignTo;
		userModel.findOne({_id: userId})
		.exec((err , foundUser)=>{
			console.log("foundUser ====>" , foundUser);
			if(foundUser.tasks.length == 1){
				foundUser.tasks.pop();
				lastTask = true;
			}else{
				var index;
				var flag = 5;
				var final = 1;
				var q = JSON.stringify(taskId);
				for(var i = 0;i < foundUser.tasks.length; i++){
					var p = JSON.stringify(foundUser.tasks[i]);
					flag = p.localeCompare(q);
					if(flag == 0){
						index = i;
						final = 0;
					}
				}
				console.log("FInal of updated Data ===>" , final , index);
				foundUser.tasks.splice(index , 1);
				foundUser.save();
			}
		})
	})*/
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
				res.status(200).send(updatedData);	
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
	var taskId = req.body;
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
module.exports = tasksController;


































		/*else{
			var count = +foundTask[1]+ +1;
			console.log("found Task ====>" , +foundTask[1]+ +1);
			req.body['uniqueId'] = foundTask[0]+"-" + count;
			req.body['startDate'] = Date.now();
			console.log("req.body ====>" , req.body);
			var saveTask = new tasksModel(req.body);
		}*/
		/*console.log("saved Task in unique id ==========>" , savedTask.uniqueId);
		console.log("saved Tasked ======>" , savedTask);
		projectModel.findOne({_id: savedTask.projectId})
		.exec((err , resp)=>{
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
			
		})*/