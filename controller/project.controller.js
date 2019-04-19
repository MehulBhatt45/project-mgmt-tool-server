var projectModel = require('../model/project.model');
var notificationModel = require('../model/notification.model'); 
var sendnotificationModel = require('../model/sendNotification.model');
var userModel = require('../model/user.model');
var sprintModel = require('../model/sprint.model');
let projectController = {};
var dir = require('node-dir');
var mkdir = require('mkdirp');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var async = require("async");
var pushNotification = require('./../service/push-notification.service');


projectController.addProject = function(req,res){
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
									fileNames = gotFile.fd.split('/uploads/').reverse()[0];
								})
							}
							projectModel
							.findOneAndUpdate({_id: savedProject._id}, {$set: {avatar: fileNames}}, { upsert: true, new: true })
							.exec((err , project)=>{
								if (err) {
									console.log(err);
									res.status(500).send(err);
								}else{

									var sprintdata={
										projectId:savedProject._id,
										startDate:"",
										endDate:"",
										title:savedProject.uniqueId+'Sprint-1',
										status:'Future',
										goal:''
									}
									var newSprint = new sprintModel(sprintdata);
									newSprint.save();
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

		console.log("saved console 4",projects);
		res.status(200).send(projects);
	})
}

projectController.updateProjectById = function(req,res){
	console.log("REQQQQQQ===========>",req.body);
	console.log("New Team===================================>",req.body.Teams)
	// console.log("DELETE=========================================>",req.body.delete);
	console.log("teamLength==========>",req.body.Teams.length);
	var updatedTeam = req.body.Teams.length;
	var projectId = req.params.projectId;
	var deleteTeam = req.body.delete;
	var addTeam = req.body.add;
	console.log("deleteTeam===>",deleteTeam);
	console.log("projectId====>",projectId);
	projectModel.findOneAndUpdate({_id:projectId},{$set:req.body},{upsert:true},function(err,projects){
		console.log("saved console 5",projects);
		console.log("old TEAM=================================================>",projects.Teams);
		var teamLength = projects.Teams.length;
		console.log("teamLength",teamLength);
		userDetails = [];
		userModel
		.find({_id : deleteTeam[0]},function(err,foundUser){
			console.log("name==============>",foundUser[0].name);
			async.forEach(foundUser, function (item, callback){ 
    		console.log("item------>",item)
    		userDetails.push(item);
    		console.log("team========>",userDetails);
    		console.log("name=========================>",userDetails[0].name);
    		callback(); 
    	});  
		userModel
		.find({_id : addTeam})
		.exec((err,add)=>{

		if(teamLength != updatedTeam){
			if(teamLength > updatedTeam){
				console.log("deleteTeam member");
				var obj = {
					"subject" :"Team member terminated.",
					"content" : "For the notes, "+userDetails[0].name+ " is terminated from "+req.body. uniqueId+ " team as "+userDetails[0].userRole+ ".",
					// "content" : "Team member terminated from <strong>"+req.body.uniqueId + "</strong> team.",
					"sendTo" : req.body.Teams,
					"type" : "other",
				} 
			}else if(teamLength < updatedTeam){
				console.log("add Team member");
				var obj = {
					"subject" :"New team member added.",
					"content" : "For the notes, "+add[0].name+ " is added in "+req.body. uniqueId+ " team as "+add[0].userRole+ ".",
					// "content" : "New Team member added in "+req.body. uniqueId+ " team.",
					"sendTo" : req.body.Teams,
					"type" : "other",
				} 
			}
			var notification = new sendnotificationModel(obj);
			notification.save(function(err,savedNotification){
				if(err){
			res.status(500).send(err);		
		}
		console.log("TEAM============>",req.body.Teams);
		var Teams = req.body.Teams;
		team = [];
	notificationModel
    .find({userId : Teams}, function(err, foundUser){
    	console.log("TOKEN==================>",foundUser);
    	req.session.user = foundUser;
    	req.session.userarray = [];
    	async.forEach(foundUser, function (item, callback){ 
    		console.log("item------>",item)
    		team.push(item.token);
    		console.log("team========>",team);
    		callback(); 
    	});  
    	pushNotification.postCode(obj.subject,obj.type,team);
    })
})
		}
	})
		// })
	})
		res.status(200).send(projects);
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
	projectModel
	.findOne({_id: projectId})
	.select('Teams')
	.populate('Teams')
	.exec((err , foundTeam)=>{
		if(err) res.send(err)
			else res.status(200).send(foundTeam);
	})
}


projectController.getTaskOfProject = function(req , res){
	console.log("projectId ========>" , req.params.projectId);
	var projectId = req.params.projectId;
	projectModel
	.findOne({_id: projectId})
	.select('taskId IssueId BugId tasks')
	.exec((err , foundTeam)=>{
		if(err) res.send(err)
			else res.status(200).send(foundTeam);
	})
}

projectController.getProjectByPmanagerId = function(req, res){
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

module.exports = projectController;
