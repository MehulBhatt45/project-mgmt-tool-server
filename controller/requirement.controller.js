var requirementModel = require('./../model/requirement.model');
var projectModel = require('../model/project.model');
var _ = require('lodash');
let requirementController = {};

requirementController.addRequirement = function(req,res){
	var requirement = new requirementModel(req.body);
	requirement.save(function(err,Savedrequirement){
		projectModel.findOne({_id: Savedrequirement.projectId})
		.exec((err, resp)=>{
			if (err) res.status(500).send(err);
			resp.requirementId.push(Savedrequirement._id);
			resp.save();
			res.status(200).send(Savedrequirement);

		})
	})
}

requirementController.getAllRequirement = function(req,res){
	requirementModel.find({}).exec(function(err,requirements){
		if (err) res.status(500).send(err);
		else if(requirements) res.status(200).send(requirements);
		else res.status(404).send("Not Found");
	})
}

requirementController.deleteRequirementById = function(req,res){
	var requirementId = req.params.requirementId;
	requirementModel.findOneAndDelete({_id:requirementId}).exec(function(err,deletedrequirement){
		if (err) res.status(500).send(err);
		else if(deletedrequirement){
			projectModel.findOne({_id: deletedrequirement.projectId})
			.exec((err, resp)=>{
				if (err) res.status(400).send(err);
				else if(resp){
					resp.requirementId.splice(_.findIndex(resp.requirementId, deletedrequirement._id), 1);
					resp.save();
					res.status(200).send(deletedrequirement);
				}else{
					res.status(404).send("Not Found");		
				}
			})
		}else{
			res.status(404).send("Not Found");
		}
	})

}


requirementController.getRequirementById = function(req,res){
	var requirementId = req.params.requirementId;
	console.log("requirement ID===========>>>>>",requirementId);
	requirementModel.findOne({_id:requirementId}).exec(function(err,singlerequirement){
		if (err) res.status(500).send(err);
		else if(singlerequirement) res.status(200).send(singlerequirement);
		else res.status(404).send("Not Found");
	})

}

requirementController.updateRequirementById = function(req,res){
	var requirementId = req.params.requirementId;
	requirementModel.findOneAndUpdate({_id:requirementId},{$set:req.body},{upsert:true, new:true},function(err,Updatedrequirement){
		if (err) res.status(500).send(err);
		else if(Updatedrequirement) res.status(200).send(Updatedrequirement);
		else res.status(404).send("Not Found");
	})
}

requirementController.updateRequirementStatusById = function(req,res){
	var requirementId = req.params.requirementId;
	requirementModel.findOneAndUpdate({_id:requirementId},{$set:req.body},{upsert:true, new:true},function(err,Updatedrequirement){
		if (err) res.status(500).send(err);
		else if(Updatedrequirement)	res.status(200).send(Updatedrequirement);
		else res.status(404).send("Not Found");
	})
}

requirementController.updateRequirementStatusToComplete = function(req,res){
	var requirementId = req.params.requirementId;
	requirementModel.findOneAndUpdate({_id:requirementId},{$set:req.body},{upsert:true, new:true},function(err,Updatedrequirement){
		if (err) res.status(500).send(err);
		else if(Updatedrequirement) res.status(200).send(Updatedrequirement);
		else res.status(404).send("Not Found");
	})
}


module.exports = requirementController;