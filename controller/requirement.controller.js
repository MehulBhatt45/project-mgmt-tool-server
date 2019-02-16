var requirementModel = require('../model/requirement.model');
let requirementController = {};

requirementController.addReque= function(req,res){

	var reque = new requirementModel(req.body);
	console.log("body message===>>>",req.body);

	reque.save(function(err,SavedReque){
		console.log("err==========>>>",err);
		res.status(200).send(SavedReque);
		console.log("saved Issue",SavedReque);
	})
}

requirementController.getRequeById = function(req,res){

	var requeId = req.params.requeid;

	requirementModel.findOne({_id:requeId}).exec(function(err,requirement){
		console.log("err==========>>>",err);
		res.status(200).send(requirement);
		console.log("saved console",requirement);
	})
}

requirementController.getAllReque = function(req,res){

	requirementModel.find({}).exec(function(err,requirement){
		console.log("err==========>>>",err);
		res.status(200).send(requirement);
		console.log("saved console",requirement);
	})
}

requirementController.deleteRequeById = function(req,res){

	var requeId = req.params.requeid;

	requirementModel.findOneAndDelete({_id:requeId}).exec(function(err,requirement){
		console.log("err==========>>>",err);
		res.status(200).send(requirement);
		console.log("saved console",requirement);
	})
}

requirementController.updateRequeById = function(req,res){

	var requeId = req.params.requeid;

	requirementModel.findOneAndUpdate({_id:requeId},{$set:req.body},{upsert:true},function(err,UpdatedReque){
		console.log("err==========>>>",err);
		res.status(200).send(UpdatedReque);
		console.log("saved console",UpdatedReque);
	})

}

module.exports = requirementController;
