var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	// userId: {type:Schema.Types.ObjectId, ref: 'User'},
	// token: {type:String},
	subject: {type:String},
	content:{type:String}
	
})

module.exports = mongoose.model('notification', NotificationSchema);	