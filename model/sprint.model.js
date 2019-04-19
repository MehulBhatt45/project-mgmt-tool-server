var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SprintSchema = new Schema({
	title: {type:String, required: true},
	goal: {type:String},
	projectId:{ type: Schema.Types.ObjectId, ref: 'Project', required: true },	
	startDate:{type:Date},
	endDate:{type:Date},
	duration: {type:Number},
	status:{type:String , default:'Future'},
},{timestamps: true});


module.exports = mongoose.model('Sprint', SprintSchema);