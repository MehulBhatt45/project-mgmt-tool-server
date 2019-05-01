var sprintModel = require('../model/sprint.model');
var moment = require('moment');
var sprintController = {};

sprintController.addSprint = function (req,res) {

	var sprint = new sprintModel(req.body);

	sprint.save(function(err,sprint){

		if (err) res.status(500).send(err);
		res.status(200).send(sprint);
	})
	console.log(req.body);
}

sprintController.getSprintByProject = function (req,res) {

	var projectId = req.params.projectId;
	console.log("projectid===>>>",projectId);
	sprintModel.find({projectId:projectId})
	.exec(function(err,sprints){
		if (err) res.status(500).send(err);
		res.status(200).send(sprints);
	})
}


sprintController.deleteSprintById = function(req,res) {

	var sprintId = req.params.sprintId;
	console.log("sprintId=======>>",sprintId);
	sprintModel.deleteOne({_id : sprintId} , function(err , removed){
		if(err) res.send(err);
		else res.status(200).send(removed);
	});
}

sprintController.updateSprintById = function(req,res){
	var sprintId = req.params.sprintId;
	sprintModel.findOneAndUpdate({_id: sprintId},req.body,{upsert:true},function(err,updatedSprint){
		if (err) 
		{
			res.status(500).send(err);
		}
		else{
			console.log(updatedSprint);
			res.status(200).send(updatedSprint);
		}
	})
}

sprintController.sprintBySprintId = function (req,res) {

	var sprintId = req.params.sprintId;
	console.log("projectid===>>>",sprintId);
	sprintModel.find({_id:sprintId})
	.exec(function(err,sprint){
		if (err) res.status(500).send(err);
		res.status(200).send(sprint);
	})
}

sprintController.completeSprint = function(req,res){

	var sprintId = req.params.sprintId;

	sprintModel.findOne({_id:sprintId},function(err,Sprint){
		if(err){
			res.status(500).send(err);
		}
		else{
			console.log("sprint=======>>>",Sprint);

			Sprint.endDate = new Date();
			var sprintEnd = moment(Sprint.endDate);
			var duration = sprintEnd.diff(Sprint.startDate,'days');
			Sprint.status = 'Complete';
			Sprint.duration = duration;
			console.log("updated sprint",Sprint);
			sprintModel
			.findOneAndUpdate({_id:Sprint._id} , Sprint , {upsert:true,new:true})
			.exec((err , updatedSprint)=>{
				if(err){
					res.status(404).send(err);
				}
				else{
					console.log(updatedSprint);
					res.status(200).send(updatedSprint);
				}

			})	
		}
	})
}


sprintController.startSprint = function(req,res){

	var sprintEnd = req.body.endDate; 
	var sprintStart = req.body.startDate;

	var sprintEnd = moment(sprintEnd);
	var duration = sprintEnd.diff(sprintStart,'days');

	console.log(req.body);
	var startdata = {
		startDate:req.body.startDate,
		endDate:req.body.endDate,
		duration:duration,
		status:'Active'
	}
	console.log(startdata);

	sprintModel.findOneAndUpdate({_id:req.body._id},{$set:startdata },function(err,updateSprint){
		if(err){
			res.status(500).send(err);
		}
		else{
			console.log(updateSprint);
			res.status(200).send(updateSprint);
		}
	})
}

module.exports = sprintController; 

