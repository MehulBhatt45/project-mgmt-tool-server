var bugModel = require('./../model/bug.model');
var projectModel = require('../model/project.model');
let bugController = {};

bugController.addBug = function(req,res){

	var bug = new bugModel(req.body);

	bug.save(function(err,Savedbug){
		projectModel.findOne({_id: Savedbug.projectId})
		.exec((err, resp)=>{
			if (err) next(err);
			resp.BugId.push(Savedbug._id);
			resp.save();
			res.status(200).send(Savedbug);

		})
	})

}

bugController.getAllBug = function(req,res){

	bugModel.find({}).exec(function(err,bugs){
		console.log("err==========>>>",err);
		res.status(200).send(bugs);
		console.log("saved console",bugs);
	})

}

bugController.deleteBugById = function(req,res){

	var bugId = req.params.bugId;
	console.log("Bug ID===========>>>>>",bugId);
	bugModel.findOneAndDelete({_id:bugId}).exec(function(err,deletedBug){
		console.log("err==========>>>",err);
		res.status(200).send(deletedBug);
	})

}


bugController.getBugById = function(req,res){

	var bugId = req.params.bugId;
	console.log("Bug ID===========>>>>>",bugId);
	bugModel.findOne({_id:bugId}).exec(function(err,deletedBug){
		console.log("err==========>>>",err);
		res.status(200).send(deletedBug);
	})

}

bugController.updateBugById = function(req,res){

	var bugId = req.params.bugId;

	bugModel.findOneAndUpdate({_id:bugId},{$set:req.body},{upsert:true, new:true},function(err,UpdatedBug){
		console.log("err==========>>>",err);
		res.status(200).send(UpdatedBug);
		console.log("saved console",UpdatedBug);
	})

}

bugController.updateBugStatusById = function(req,res){

	var bugId = req.params.bugId;

	bugModel.findOneAndUpdate({_id:bugId},{$set:req.body},{upsert:true, new:true},function(err,UpdatedBug){
		console.log("err==========>>>",err);
		res.status(200).send(UpdatedBug);
		console.log("saved console",UpdatedBug);
	})

}

bugController.updateBugStatusToComplete = function(req,res){

	var bugId = req.params.bugId;

	bugModel.findOneAndUpdate({_id:bugId},{$set:req.body},{upsert:true, new:true},function(err,UpdatedBug){
		console.log("err==========>>>",err);
		res.status(200).send(UpdatedBug);
		console.log("saved console",UpdatedBug);
	})

}


module.exports = bugController;