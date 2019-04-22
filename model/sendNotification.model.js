var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SendnotificationSchema = new Schema({
	createdAt:{type:Date, default : Date.now()},
	subject:{type:String },
	content: {type:String},
	sendTo: [{type: Schema.Types.ObjectId , ref: 'User'}],
	id:{type:Schema.Types.ObjectId},
	projectId: {type: Schema.Types.ObjectId , ref: 'Project',default : null},
	type : {type : String, default : 'other'},
	priority : {type: String,default: null},
	seenFlag : {type : Boolean, default : false, required : true}
})

module.exports = mongoose.model('sendnotification', SendnotificationSchema);	

// seenFlag: {
//       type: 'boolean',
//       defaultsTo: false,
//       required: true,
//     }