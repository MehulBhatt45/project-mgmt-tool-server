var bugModel = require('./../model/bug.model');
let bugController = {};

bugController.addBug = function(req,res){

	var bug = new bugModel(req.body);

	bug.save(function(err,Savedbug){
		console.log("err==========>>>",err);
		res.status(200).send(Savedbug);
		console.log("saved console",Savedbug);
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

	bugModel.findOneAndUpdate({_id:bugId},{$set:req.body},{upsert:true},function(err,UpdatedBug){
		console.log("err==========>>>",err);
		res.status(200).send(UpdatedBug);
		console.log("saved console",UpdatedBug);
	})

}


module.exports = bugController;