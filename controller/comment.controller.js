var commentModel = require('./../model/comment.model');
var userModel = require('./../model/user.model');
var commentController = {};

commentController.addComment = function(req,res){
	var comment = commentModel(req.body);
	comment.save(function(err, comment){
		console.log(comment);
		if (err) {
			res.status(500).send(err);
		}
		res.status(200).send(comment);
	})
	console.log(req.body);
}

commentController.getAllComment = function(req,res){
	
}

commentController.deleteCommentByUserId = function(req,res){
	console.log("req params ==========>",req.body, req.params);
	commentModel.findOne({_id: req.body.userId})
	.exec((err,user)=>{
		if (err) {
			res.status(500).send(err); 
		}
		else if(user)
		{
			commentModel.findByIdAndRemove({_id: req.params.id})
			.exec((error,resp)=>{
				if (resp) {
					res.status(200).json({msg: "comment deleted successfully!!1"})
				}

				else{ res.status(500).send(error); }
			})
		}
		else { res.status(401).json({ msg: "Unauthorized Access"}); }

	})
}

commentController.updateCommentByUserId = function(req,res){
	console.log("req params ==========>",req.body, req.params);
	commentModel.findOne({_id: req.body.userId})
	.exec((err,user)=>{
		if (err) {
			res.status(500).send(err); 
		}
		else if(user)
		{
			commentModel.findByIdAndUpdate({_id: req.params.id},eq.body,{upsert: true,new: true})
			.exec((error,resp)=>{
				if (resp) 
				{
					res.status(200).json({msg: "comment update successfully!!1"})
				}
				
				else{ res.status(500).send(error); }
			})
		}
		else { res.status(401).json({ msg: "Unauthorized Access"}); }

	})
}

module.exports = commentController;



