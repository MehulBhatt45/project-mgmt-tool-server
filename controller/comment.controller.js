var commentModel = require('./../model/comment.model');
var taskModel = require('../model/tasks.model')
var userModel = require('./../model/user.model');
var commentController = {};

commentController.addComment = function(req,res){
	console.log(req.body); 
	var comment = commentModel(req.body);
	comment.save(function(err, comment){
		console.log(comment);
		if (err) {
			res.status(500).send(err);
		}
		taskModel
		.findOne({ _id : comment.taskId})
		.exec((error, task)=>{
			task.comment.push(comment._id);
			task.save();
			res.status(200).send(comment);
		})
	})
}

commentController.getAllComment = function(req,res){
	commentModel.find({},function(err,comment){
		if (err)
		{
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