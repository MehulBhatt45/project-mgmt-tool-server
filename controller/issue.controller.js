var issueModel = require('./../model/issue.model');
var projectModel = require('../model/project.model');
var _ = require('lodash');
let issueController = {};

issueController.addIssue = function(req,res){
	if(!req.body.assignTo && req.user.userRole != 'projectManager'){
		req.body['assignTo'] = req.user._id;
	}
	req.body['createdBy'] = req.user._id;
	req.body['startDate'] = Date.now()
	var issue = new issueModel(req.body);
	issue.save(function(err,Savedissue){
		projectModel.findOne({_id: Savedissue.projectId})
		.exec((err, resp)=>{
			if (err) res.status(500).send(err);
			resp.IssueId.push(Savedissue._id);
			if(!_.includes(resp.Teams, Savedissue.assignTo))
				resp.Teams.push(Savedissue.assignTo);
			resp.save();
			res.status(200).send(Savedissue);

		})
	})
}

issueController.getAllIssue = function(req,res){
	issueModel.find({}).exec(function(err,issues){
		if (err) res.status(500).send(err);
		else if(issues) res.status(200).send(issues);
		else res.status(404).send("Not Found");
	})
}

issueController.deleteIssueById = function(req,res){
	var issueId = req.params.issueId;
	issueModel.findOneAndDelete({_id:issueId}).exec(function(err,deletedissue){
		if (err) res.status(500).send(err);
		else if(deletedissue){
			projectModel.findOne({_id: deletedissue.projectId})
			.exec((err, resp)=>{
				if (err) res.status(500).send(err);
				else if(resp){
					resp.IssueId.splice(_.findIndex(resp.issueId, deletedissue._id), 1);
					resp.save();
					res.status(200).send(deletedissue);
				}else{
					res.status(404).send("Not Found");		
				}
			})
		}else{
			res.status(404).send("Not Found");
		}
	})

}


issueController.getIssueById = function(req,res){
	var issueId = req.params.issueId;
	console.log("issue ID===========>>>>>",issueId);
	issueModel.findOne({_id:issueId}).exec(function(err,singleissue){
		if (err) res.status(500).send(err);
		else if(singleissue) res.status(200).send(singleissue);
		else res.status(404).send("Not Found");
	})

}

issueController.updateIssueById = function(req,res){
	var issueId = req.params.issueId;
	issueModel.findOneAndUpdate({_id:issueId},{$set:req.body},{upsert:true, new:true},function(err,Updatedissue){
		if (err) res.status(500).send(err);
		else if(Updatedissue) {
			projectModel.findOne({_id: Updatedissue.projectId})
			.exec((err, resp)=>{
				if (err) res.status(500).send(err);
				if(!_.includes(resp.Teams, Updatedissue.assignTo))
					resp.Teams.push(Updatedissue.assignTo);
				resp.save();
				res.status(200).send(Updatedissue);

			})
		}
		else res.status(404).send("Not Found");
	})
}

issueController.updateIssueStatusById = function(req,res){
	var issueId = req.params.issueId;
	if(req.body.status!=='complete'){
		issueModel.findOne({_id: issueId}).exec((err, issue)=>{
			if (err) res.status(500).send(err);
			else if(issue){
				var timelog = issue.timelog;
				timelog.push({
					operation: "shifted to "+req.body.status+" from "+issue.status,
					dateTime: Date.now(),
					operatedBy: req.body.operatorId
				})
				issueModel.findOneAndUpdate({_id:issueId},{$set:{status: req.body.status, timelog: timelog, startDate: req.body.status=='in progress'?Date.now():'' }},{upsert:true, new:true},function(err,Updatedissue){
					if (err) res.status(500).send(err);
					else if(Updatedissue) res.status(200).send(Updatedissue);
					else res.status(404).send("Not Found");
				})
			}
			else res.status(404).send("Not Found");
		})
	}else{
		res.status(403).send("Bad Request");
	}
}

issueController.updateIssueStatusToComplete = function(req,res){
	var issueId = req.params.issueId;
	if(req.body.status==='complete'){
		issueModel.findOne({_id: issueId}).exec((err, issue)=>{
			if (err) res.status(500).send(err);
			else if(issue){
				issueModel.findOneAndUpdate({_id:issueId},{$set:{status: req.body.status, completedAt: Date.now()}},{upsert:true, new:true},function(err,Updatedissue){
					if (err) res.status(500).send(err);
					else if(Updatedissue) res.status(200).send(Updatedissue);
					else res.status(404).send("Not Found");
				})
			}
			else res.status(404).send("Not Found");
		})
	}else{
		res.status(403).send("Bad Request");
	}
}

issueController.getUserLogsByIssueId = function(req,res){
	var issueId = req.params.issueId;
	issueModel.findOne({_id: issueId}).exec((err, issue)=>{
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}else if(issue){
			issueModel.find({ "timelog": {$elemMatch: { operatedBy: req.body.userId }}}).exec((error, issueLog)=>{
				if(error){
					console.log(error);
				}
				res.status(200).send(issueLog);
			})
		}
		else res.status(404).send("Not Found");
	})
}


module.exports = issueController;