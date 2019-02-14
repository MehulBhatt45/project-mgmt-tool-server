var taskModel = require('./../model/task.model');
let taskController = {};

taskController.addTask = function(req,res){

	var task = new taskModel(req.body);

	task.save(function(err,SavedTask){
		console.log("err==========>>>",err);
		res.status(200).send(SavedTask);
		console.log("saved console",SavedTask);
	})

}
taskController.getTaskById = function(req,res){

	var taskId = req.params.taskId;
	taskModel.findOne({_id:taskId}).exec(function(err,Task){
		console.log("err==========>>>",err);
		res.status(200).send(Task);
		console.log("saved console",Task);
	})
}

taskController.getAllTask = function(req,res){

	taskModel.find({}).exec(function(err,tasks){
		console.log("err==========>>>",err);
		res.status(200).send(tasks);
		console.log("saved console",tasks);
	})

}

taskController.deleteTaskById = function(req,res){

	var taskId = req.params.taskId;
	taskModel.findOneAndDelete({_id:projectId}).exec(function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console",projects);
	})

}

taskController.updateTaskById = function(req,res){

	var taskId = req.params.taskId;

	taskModel.findOneAndUpdate({_id:taskId},{$set:req.body},{upsert:true},function(err,UpdatedTask){
		console.log("err==========>>>",err);
		res.status(200).send(UpdatedTask);
		console.log("saved console",UpdatedTask);
	})

}


module.exports = taskController;