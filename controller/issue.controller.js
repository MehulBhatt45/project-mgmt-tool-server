var issueModel = require('./../model/issue.model');
let issueController = {};

issueController.addIssue = function(req,res){

	var issue = new issueModel(req.body);
	console.log("body message===>>>",req.body);

	issue.save(function(err,SavedIssue){
		console.log("err==========>>>",err);
		res.status(200).send(SavedIssue);
		console.log("saved Issue",SavedIssue);
	})
}

issueController.getIssueById = function(req,res){

	var issueId = req.params.issueId;
	issueModel.findOne({_id:issueId}).exec(function(err,Issue){
		console.log("err==========>>>",err);
		res.status(200).send(Issue);
		console.log("saved console",Issue);
	})
}

issueController.getAllIssue = function(req,res){

	issueModel.find({}).exec(function(err,AllIssue){
		console.log("err==========>>>",err);
		res.status(200).send(AllIssue);
		console.log("saved console",AllIssue);
	})
}




module.exports = issueController;