var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
	fname:  String,
	lname: String,
	userRole: {type:String, default: 'user'},
	email: {type:String},
    password: String,
    joiningDate: String,
    phone: Number,
    // image: String,
    // CV: String

},{timestamps: true});

module.exports = mongoose.model('Employee',EmployeeSchema);
