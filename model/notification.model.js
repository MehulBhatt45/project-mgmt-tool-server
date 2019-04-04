var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	userId: {type:Schema.Types.ObjectId, ref: 'Usre'},
	token: {type:String},
	title:{type:String},
	desc: {type:String},
	id:{type:Schema.Types.ObjectId}
	
})

module.exports = mongoose.model('notification', NotificationSchema);	