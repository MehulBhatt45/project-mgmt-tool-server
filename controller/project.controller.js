var projectModel = require('../model/project.model');
let projectController = {};
var dir = require('node-dir');
var mkdir = require('mkdirp');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
projectController.addProject = function(req,res){
	// console.log("req files =============>" , req.files);
	req.body.Teams = req.body.Teams.split(',');
	console.log("req body",req.body);
	var flag = 5;
	projectModel.find({}).exec((err , allProjects)=>{
		for(var i = 0; i < allProjects.length; i++){
			if(allProjects[i].uniqueId == req.body.uniqueId){
				flag = 4;
			}
		}
		if(flag != 5){
			res.status(500).send({errMgsg: "project alias is duplicate"});
		}
		else{
			var newProject = new projectModel(req.body);
			newProject.save(function(err , savedProject){
				if(err) res.status(500).send(err);
				else {
					var uploadPath = path.join(__dirname, "../uploads/"+savedProject._id+"/avatar/");
					console.log(uploadPath);
					req.file('uploadfile').upload({
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
							var fileNames = savedProject.avatar;
							if(files.length>0){
								_.forEach(files, (gotFile)=>{
									fileNames = gotFile.fd.split('/').reverse()[3]+"/"+gotFile.fd.split('/').reverse()[2]+"/"+gotFile.fd.split('/').reverse()[1]+"/"+gotFile.fd.split('/').reverse()[0];
								})
							}
							projectModel
							.findOneAndUpdate({_id: savedProject._id}, {$set: {avatar: fileNames}}, { upsert: true, new: true })
							.exec((err , project)=>{
								if (err) {
									console.log(err);
									res.status(500).send(err);
								}else{
									res.status(200).send(project);
								}	
							})
						}
					})
				}
			})
		}
	})
}



projectController.getAllProject = function(req,res){
	projectModel
	.find({})
	.populate('pmanagerId taskId IssueId BugId Teams tasks')
	.populate({
		path:' taskId IssueId BugId tasks',
		populate: { path: 'assignTo' }
	})
	.exec(function(err,projects){
		if (err) {
			res.status(500).send(err);
		}else if(projects){
			res.status(200).send(projects);
		}else{
			res.status(404).send("NOT FOUND");
		}
	})

}

projectController.getProjectById = function(req,res){
	var userId = req.params.userId;
	var projectId = req.params.projectId;
	projectModel
	.findOne({_id:projectId})
	.populate('tasks pmanagerId taskId IssueId BugId Teams')
	.populate({
		path: 'taskId IssueId BugId',
		populate: { path: 'assignTo' }
	})
	.exec(function(err,projects){
		if (err) {
			res.status(500).send(err);
		}else if(projects){

			_.map([...projects.taskId, ...projects.IssueId, ...projects.BugId], function(ele){
				if(ele.assignTo == null){
					ele.assignTo = "";
				}
			})

			res.status(200).send(projects);
		}else{
			res.status(404).send("NOT FOUND");
		}
	})

}

projectController.deleteProjectById = function(req,res){

	var projectId = req.params.projectId;
	projectModel.findOneAndDelete({_id:projectId}).exec(function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console 4",projects);
	})

}

projectController.updateProjectById = function(req,res){

	var projectId = req.params.projectId;

	projectModel.findOneAndUpdate({_id:projectId},{$set:req.body},{upsert:true},function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console 5",projects);
	})

}

projectController.getAllProjectOrderByTitle = function(req,res){
	projectModel.find({})
	.sort({'title': -1})
	.exec(function(err,project){
		console.log("err==========>>>",err);
		res.send(project);
		console.log(project);
	})

}

projectController.uploadFilesToFolder = function(req, res){
	console.log(req.body);
	var uploadPath = path.join(__dirname, "../uploads/"+req.body.projectId+"/sharedFile");
	console.log(uploadPath);
	req.file('fileUpload').upload({
		maxBytes: 50000000,
		dirname: uploadPath,
		saveAs: function (__newFileStream, next) {
			dir.files(uploadPath, function(err, files) {
				console.log(err, files)
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
			res.status(200).send("files uploaded successfully");
		}
	})
}

projectController.getAllFiles = function(req, res){
	console.log(req.body)
	dir.files(path.join(__dirname, "../uploads/"+req.body.projectId+"/sharedFile"), function(err, files) {
		if (err){
			console.log(err);
			res.status(500).send(err);
		}else {
			console.log(files);
			res.status(200).send(files);
		}
	});
}

projectController.deleteFile = function(req, res){
	var file = req.body.file;
	var fileLocation = path.join(__dirname,"../uploads/"+req.body.projectId, file);
	console.log(fileLocation);
	fs.unlink(fileLocation, (err)=>{
		if (err) {
			res.status(500).send("file not deleted");
		}
		res.status(200).send("file deleted");
	}); 
}
projectController.getDeveloperOfProject = function(req , res){
	console.log("projectId ========>" , req.params.projectId);
	var projectId = req.params.projectId;
	projectModel.findOne({_id: projectId})
	.select('Teams')
	.exec((err , foundTeam)=>{
		if(err) res.send(err)
		else res.status(200).send(foundTeam);
	})
}
module.exports = projectController;