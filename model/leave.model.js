var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var LeaveSchema = new Schema ({

	email: {type:String, default:'user', required: true},
	name: {type:String, required: true},
	status: {type:String, default:'pending'},
	leaveDate: {type:String},
	leaveDuration:{type:String, required: true},
	typeOfLeave: {type:String, required: true},
	reasonForLeave: {type:String, required: true},
	startingDate:{type:Date,default:Date.now()},
	noOfDays:{type:String, required: true},
	endingDate:Date

})



module.exports = mongoose.model('leave', LeaveSchema);