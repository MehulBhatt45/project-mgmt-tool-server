var sprintModel = require('../model/sprint.model');
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


module.exports = sprintController; 

