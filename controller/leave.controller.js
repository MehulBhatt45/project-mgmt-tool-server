var leaveModel = require ('../model/leave.model');
var userModel = require('../model/user.model');
var nodemailer = require ('nodemailer');
const smtpTransport = require ('nodemailer-smtp-transport');
let leaveController = {};


leaveController.applyLeave = function(req,res){
	console.log("fun ma jay che ke nai ============>")
	// userModel.find({email: req.body.email})
	// console.log("ave che kai=========>",req.body)
	var leave = new leaveModel(req.body);
	console.log("nthi mdtu ke mde che", leave);
	leave.save(function(err,leave){
		if(err) res.status(500).send(err)
			else{

				res.status(200).send(leave)
				console.log("leavesssssssssssssss",leave);
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
				console.log("resuest =======>",status);
			}
		})


}

module.exports = leaveController;
