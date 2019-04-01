var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SprintSchema = new Schema({
	title: {type:String, required: true},
	goal: {type:String},
	projectId:{ type: Schema.Types.ObjectId, ref: 'Project', required: true },
	Teams:[{ type: Schema.Types.ObjectId, ref: 'User'}],
	startDate:Date,
	endDate:Date,
	duration: {type:String},
},{timestamps: true});


module.exports = mongoose.model('Sprint', SprintSchema);	