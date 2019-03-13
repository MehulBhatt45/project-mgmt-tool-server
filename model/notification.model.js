var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	userId: {type:Schema.Types.ObjectId, ref: 'Usre'},
	Token: {type:String},
	
})

module.exports = mongoose.model('notification', NotificationSchema);	