var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var LeaveSchema = new Schema ({
	email: {type:String},
	name:String,
	status: {type:String, default:'pending'},
	leaveDate: {type:String},
	leaveDuration:{type:String},
	typeOfLeave: {type:String},
	reasonForLeave: {type:String},
	startingDate:{type:Date,default:Date.now()},
	noOfDays:String,
	endingDate:Date,
	attechment:[{type: String, default: []}]

})

module.exports = mongoose.model('leave', LeaveSchema);			