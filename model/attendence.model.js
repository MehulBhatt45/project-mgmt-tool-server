var mongoose = require ('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var AttendenceSchema = new Schema({
	count: Number,
	difference: {type:Date, default:null},
	in_out:[{
		_id:false,
		checkIn:Date,
		checkOut: {type:Date, default:null},
	}],
	user_Id:{type:Schema.Types.ObjectId, ref:'User'},
	date:Date,
	fromDate:Date,
	toDate:Date

});
module.exports = mongoose.model('attendence',AttendenceSchema);