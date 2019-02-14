var projectModel = require('./../model/project.model');
let projectController = {};

projectController.addProject = function(req,res){

	var project = new projectModel(req.body);

	project.save(function(err,savedProject){
		console.log("err==========>>>",err);
		res.status(200).send(savedProject);
		console.log("saved console",savedProject);
	})

}

projectController.getAllProject = function(req,res){

	projectModel.find({}).exec(function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console",projects);
	})

}

projectController.getProjectById = function(req,res){

	var projectId = req.params.projectId;
	projectModel.findOne({_id:projectId}).exec(function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console",projects);
	})

}

projectController.deleteProjectById = function(req,res){

	var projectId = req.params.projectId;
	projectModel.findOneAndDelete({_id:projectId}).exec(function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console",projects);
	})

}

projectController.updateProjectById = function(req,res){

	var projectId = req.params.projectId;

	projectModel.findOneAndUpdate({_id:projectId},{$set:req.body},{upsert:true},function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console",projects);
	})

}



module.exports = projectController;