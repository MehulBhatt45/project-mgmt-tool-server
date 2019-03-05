var bugModel = require('./../model/bug.model');
var projectModel = require('../model/project.model');
var _ = require('lodash');
let bugController = {};

bugController.addBug = function(req,res){
	// if(req.body.assignTo){
	// 	req.body['assignTo'] = req.user._id;
	// }
	console.log("function ccallled ");

	req.body['createdBy'] = req.body.createdBy;
	req.body['startDate'] = Date.now()
	var bug = new bugModel(req.body);
	bug.save(function(err,Savedbug){
		projectModel.findOne({_id: Savedbug.projectId})
		.exec((err, resp)=>{
			if (err) res.status(500).send(err);
			resp.BugId.push(Savedbug._id);
			if(_.includes(resp.Teams, Savedbug.assignTo))
				resp.Teams.push(Savedbug.assignTo);
			resp.save();
			res.status(200).send(Savedbug);

		})
	})
}

bugController.getAllBug = function(req,res){
	bugModel.find({}).exec(function(err,bugs){
		if (err) res.status(500).send(err);
		else if(bugs) res.status(200).send(bugs);
		else res.status(404).send("Not Found");
	})
}

bugController.deleteBugById = function(req,res){
	var bugId = req.params.bugId;
	bugModel.findOneAndDelete({_id:bugId}).exec(function(err,deletedBug){
		if (err) res.status(500).send(err);
		else if(deletedBug){
			projectModel.findOne({_id: deletedBug.projectId})
			.exec((err, resp)=>{
				if (err) res.status(500).send(err);
				else if(resp){
					resp.BugId.splice(_.findIndex(resp.BugId, deletedBug._id), 1);
					resp.save();
					res.status(200).send(deletedBug);
				}else{
					res.status(404).send("Not Found");		
				}
			})
		}else{
			res.status(404).send("Not Found");
		}
	})

}


bugController.getBugById = function(req,res){
	var bugId = req.params.bugId;
	console.log("Bug ID===========>>>>>",bugId);
	bugModel.findOne({_id:bugId}).exec(function(err,singleBug){
		if (err) res.status(500).send(err);
		else if(singleBug) res.status(200).send(singleBug);
		else res.status(404).send("Not Found");
	})

}

bugController.updateBugById = function(req,res){
	var bugId = req.params.bugId;
	bugModel.findOneAndUpdate({_id:bugId},{$set:req.body},{upsert:true, new:true},function(err,UpdatedBug){
		if (err) {res.status(500).send(err);}
		else if(UpdatedBug) {
			projectModel.findOne({_id: UpdatedBug.projectId})
			.exec((err, resp)=>{
				if (err) res.status(500).send(err);
				if(!_.includes(resp.Teams, UpdatedBug.assignTo))
					resp.Teams.push(UpdatedBug.assignTo);
				resp.save();
				res.status(200).send(UpdatedBug);

			})
		}
		else {res.status(404).send("Not Found");}
	})
}

bugController.updateBugStatusById = function(req,res){
	var bugId = req.params.bugId;
	if(req.body.status!=='complete'){
		bugModel.findOne({_id: bugId}).exec((err, bug)=>{
			if (err) res.status(500).send(err);
			else if(bug){
				var timelog = bug.timelog;
				timelog.push({
					operation: "shifted to "+req.body.status+" from "+bug.status,
					dateTime: Date.now(),
					operatedBy: req.body.operatorId
				})
				bugModel.findOneAndUpdate({_id:bugId},{$set:{status: req.body.status, timelog: timelog, startDate: req.body.status=='in progress'?Date.now():'' }},{upsert:true, new:true},function(err,Updatedbug){
					if (err) res.status(500).send(err);
					else if(Updatedbug) res.status(200).send(Updatedbug);
					else res.status(404).send("Not Found");
				})
			}
			else res.status(404).send("Not Found");
		})
	}else{
		res.status(403).send("Bad Request");
	}
}

bugController.updateBugStatusToComplete = function(req,res){
	var bugId = req.params.bugId;
	if(req.body.status==='complete'){
		bugModel.findOne({_id: bugId}).exec((err, bug)=>{
			if (err) res.status(500).send(err);
			else if(bug){
				bugModel.findOneAndUpdate({_id:bugId},{$set:{status: req.body.status, completedAt: Date.now()}},{upsert:true, new:true},function(err,Updatedbug){
					if (err) res.status(500).send(err);
					else if(Updatedbug) res.status(200).send(Updatedbug);
					else res.status(404).send("Not Found");
				})
			}
			else res.status(404).send("Not Found");
		})
	}else{
		res.status(403).send("Bad Request");
	}
}

bugController.getUserLogsByBugId = function(req,res){
	var bugId = req.params.bugId;
	bugModel.findOne({_id: bugId}).exec((err, bug)=>{
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}else if(bug){
			bugModel.find({ "timelog": {$elemMatch: { operatedBy: req.body.userId }}}).exec((error, bugLog)=>{
				if(error){
					console.log(error);
				}
				res.status(200).send(bugLog);
			})
		}
		else res.status(404).send("Not Found");
	})
}


module.exports = bugController;