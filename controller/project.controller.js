var projectModel = require('../model/project.model');
let projectController = {};
var dir = require('node-dir');
var mkdir = require('mkdirp');
var path = require('path');
var fs = require('fs');


projectController.addProjectWithImage = function(req,res){
	console.log("req files =============>" , req.files);
	console.log("req body",req.body);
	var samplefile = req.files.uploadfile;
	samplefile.mv('./uploads/avatar/'+samplefile.name,function(err,result){
		if(err){
			console.log(err);
			res.status(500).send(err);
		}
		else{
			var avatar='/uploads/avatar/'+samplefile.name;
			req.body.avatar=avatar;

			projectModel
			.find({})
			.sort({"_id" : -1})
			.limit(1)
			.exec((err, project)=>{
				if (err) {
					console.log(err);
					res.status(500).send(err);
				}else if(project && project.length==1){
					var maxUniqeId = project[0].uniqueId;
					var length = maxUniqeId.length;
					var trimmedString = maxUniqeId.substring(8, length);
					var number = parseInt(trimmedString)+1;
					var text = "PROJECT"
					var unique = text+"-"+number;
					var newProject = new projectModel(req.body);
					newProject['uniqueId'] = unique;
					newProject['Team'] = [];
					newProject.Team.push(req.body.createdBy);
					newProject.save().then(result => {
						res.status(200).json(result);
					})
					.catch(err => console.log(err));
				}else{
					var newProject = new projectModel(req.body);
					var text = "PROJECT"
					var unique = text+"-"+1;
					newProject['uniqueId'] = unique;
					newProject['Team'] = [];
					newProject.Team.push(req.body.createdBy);
					newProject.save().then(result => {
						res.status(200).json(result);
					})
					.catch(err => console.log(err));
				}
			})
		}

	})
}

projectController.addProjectWithoutImage = function(req,res){
	console.log("req body",req.body);
	projectModel
	.find({})
	.sort({"_id" : -1})
	.limit(1)
	.exec((err, project)=>{
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}else if(project && project.length==1){
			var maxUniqeId = project[0].uniqueId;
			var length = maxUniqeId.length;
			var trimmedString = maxUniqeId.substring(8, length);
			var number = parseInt(trimmedString)+1;
			var text = "PROJECT"
			var unique = text+"-"+number;
			var newProject = new projectModel(req.body);
			newProject['uniqueId'] = unique;
			newProject['Team'] = [];
			newProject.Team.push(req.user._id);
			newProject.save().then(result => {
				res.status(200).json(result);
			})
			.catch(err => console.log(err));
		}else{
			var newProject = new projectModel(req.body);
			var text = "PROJECT"
			var unique = text+"-"+1;
			newProject['uniqueId'] = unique;
			newProject['Team'] = [];
			newProject.Team.push(req.user._id);
			newProject.save().then(result => {
				res.status(200).json(result);
			})
			.catch(err => console.log(err));
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
	var uploadPath = path.join(__dirname, "../uploads/"+req.body.projectId+"/");
	console.log(uploadPath);
	req.file('fileUpload').upload({
		maxBytes: 50000000,
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
			res.status(200).send("files uploaded successfully");
		}
	})
}

projectController.getAllFiles = function(req, res){
	console.log(req.body)
	dir.files(path.join(__dirname, "../uploads/"+req.body.projectId+"/"), function(err, files) {
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

module.exports = projectController;