var commentModel = require('./../model/comment.model');
var notificationModel = require('../model/notification.model');
var taskModel = require('../model/tasks.model')
var userModel = require('./../model/user.model');
var dir = require('node-dir');
var mkdir = require('mkdirp');
var path = require('path');
var fs = require('fs');
var commentController = {};
var pushNotification = require('./../service/push-notification.service');

var _ = require('lodash');
commentController.addComment = function(req,res){
	console.log(req.body);
	var uploadPath = path.join(__dirname, "../uploads/"+req.body.projectId+"/"+req.body.taskId+"/comment/");
	console.log(uploadPath);
	req.file('fileUpload').upload({
		maxBytes: 500000000,
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
			var comment = new commentModel(req.body);
			var fileNames=[];
			if(files.length>0){
			_.forEach(files, (gotFile)=>{
				fileNames.push(gotFile.fd.split('/uploads/').reverse()[0])
			})
			}
			comment['images']=fileNames;
			comment.save(function(err, comment){
				console.log("comment=====>",comment);
				if (err) {
					res.status(500).send(err);
				}
				console.log("commentid===>",comment.taskId)
				taskModel
				.findOne({ _id : comment.taskId})
				.exec((error, task)=>{
					console.log("task=======>",task);
					var obj = {
						"id": "SavedUser.sendTo",
						"title": "SavedUser.subject",
						"desc": "SavedUser.content",
					}
					console.log("saved object===>",obj);
					notificationModel
					.find({userId: comment.userId})
					task.comment.push(comment._id);
					task.save();
				    pushNotification.postCode('SavedUser.subject','SavedUser.content',req.session.userarray);

					res.status(200).send(comment);
				})
			})
		}
	})
}

commentController.getAllComment = function(req,res){
	commentModel
	.find({taskId: req.params.taskId})
	.populate('userId')
	.exec((err,comment)=>{
		if (err){
			res.status(500).send(err);
		}
		res.status(200).send(comment);
	})
}

commentController.getCommentByUserId = function(req,res){
	commentModel.find({userId: req.body.userId})
	.exec((err, comments)=>{
		if (err) {
			res.status(500).send(err);
		}else if(comments && comments.length){
			res.status(200).send(comments)
		}else{
			res.status(404).send("No comments for this user");
		}
	})
}


commentController.getCommentByCommentId = function(req,res){
	commentModel.findOne({_id: req.params.id},function(err,comment){
		if (err) {
			res.status(500).send(err);
		}
		res.status(200).send(comment);
	})
}


commentController.deleteCommentByUserId = function(req,res){
	console.log("req params ==========>",req.body, req.params);
	commentModel.findOne({userId: req.body.userId})
	.exec((err,user)=>{
		if (err) {
			res.status(500).send(err); 
		}
		else if(user)
		{
			commentModel.findByIdAndRemove({_id: req.params.id})
			.exec((error,resp)=>{
				if (resp) {
					res.status(200).json({msg: "comment deleted successfully!!!"})
				}

				else{ res.status(500).send(error); }
			})
		}
	})
}

commentController.getCommentByUserId = function(req,res){
	commentModel.find({userId: req.body.userId})
	.exec((err, comments)=>{
		if (err) {
			res.status(500).send(err);
		}else if(comments && comments.length){
			res.status(200).send(comments)
		}else{
			res.status(404).send("No comments for this user");
		}
	})
}


commentController.getCommentByCommentId = function(req,res){
	commentModel.findOne({_id: req.params.id},function(err,comment){
		if (err) {
			res.status(500).send(err);
		}
		res.status(200).send(comment);
	})
}

commentController.deleteCommentByCommentId = function(req,res){
	commentModel.findOneAndRemove({_id: req.params.id}, function(err,comment){
		if (err) {
			res.status(500).send(err);
		}
		res.status(200).send(comment);
	})
}

commentController.updateCommentByCommentId = function(req,res){
	commentModel.findOneAndUpdate({_id: req.params.id},req.body, {upsert: true, new: true}, 
		function(err, comment){
			if (err)
			{
				res.status(500).send(err);
			}
			res.status(200).send(comment);
		})
}

module.exports = commentController;