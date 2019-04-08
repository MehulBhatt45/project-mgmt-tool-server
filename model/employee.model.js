var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
	fname:{type:String, required: true},
	lname:{type:String, required: true},
	userRole: {type:String, default: 'user',required: true},
	email:{type:String, required: true},
	password:{type:String, required: true},
	joiningDate: String,
	phone: Number,
    // image: String,
    // CV: String

},{timestamps: true});

module.exports = mongoose.model('Employee',EmployeeSchema);
