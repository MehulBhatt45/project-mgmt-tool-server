var leaveModel = require ('../model/leave.model');
var userModel = require('../model/user.model');
let leaveController = {};


leaveController.applyLeave = function(req,res){
	// userModel.find({email: req.body.email})
	// console.log("ave che kai=========>",req.body)
	var leave = new leaveModel(req.body);
	console.log("nthi mdtu ke mde che", leave);
	leave.save(function(err,leave){
		if(err) res.status(500).send(err)
			else{	
				res.status(200).send(leave)
			}
		})
}

leaveController.getLeaves = function(req,res){
	leaveModel.find({status: "pending"})
	.exec((err,status)=>{
		if(err) res.status(500).send(err) 
			else{
				console.log(status)
				res.status(200).send(status)
			}
		})
}

module.exports = leaveController;
