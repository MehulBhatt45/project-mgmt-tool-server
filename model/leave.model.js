// leave module

// 	1. define schema
// 	2. Functions :

// 		a.get developers
// 		b. when click on the submit form than send request to the admin & send the details of forms to the admin.
// 		c. if request response is positive or nagative send email both side from admin & developers that leave is accepted or rejected. 





var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var LeaveSchema = new Schema ({

	email: {type:String, default:'user'},
	name: String,
	status: {type:String, default:'pending'},
	startingDate: Date,
	endingDate: Date,
	duration: {type:String, default: ''},
	typeOfLeave: String,
	reasonForLeave: String,

})



module.exports = mongoose.model('leave', LeaveSchema);