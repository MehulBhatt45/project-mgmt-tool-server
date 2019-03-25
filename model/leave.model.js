var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var LeaveSchema = new Schema ({

	email: {type:String, default:'user', required: true},
	name: {type:String, required: true},
	status: {type:String, default:'pending'},

	leaveDate: {type:String},
	leaveDuration:{type:String},
	typeOfLeave: {type:String},
	reasonForLeave: {type:String},
	startingDate:{type:Date,default:Date.now()},
	noOfDays:String,
	endingDate:Date,
	uploadFile:String,

})



module.exports = mongoose.model('leave', LeaveSchema);