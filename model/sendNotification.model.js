var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SendnotificationSchema = new Schema({
	
	subject:{type:String},
	content: {type:String},
	sendTo: [{type: Schema.Types.ObjectId , ref: 'User'}],
	id:{type:Schema.Types.ObjectId}
	
})

module.exports = mongoose.model('sendnotification', SendnotificationSchema);	