var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tasksSchema = new Schema({
	type: {type: String },
	title: {type: String , required: true},
	desc: {type: String, required: true},
	assignTo: {type: Schema.Types.ObjectId , ref: 'User', required: true},
	sprint: {type: Schema.Types.ObjectId ,ref :'Sprint', required:true},
	projectId: {type: Schema.Types.ObjectId , ref: 'Project', required: true},
	status: {type: String , default: 'to do'},
	comment:[{ type: Schema.Types.ObjectId, ref: 'Comment'}],
	priority:{ type: String },
	uniqueId:{ type: String },
	timelog:[{
		operation: {type: String},
		dateTime: {type: Date},
		operatedBy: {type: Schema.Types.ObjectId, ref: 'User'},
		_id: false
	}],
	createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
	startDate:{ type: Date },
	estimatedTime: { type: String },
	completedAt: { type: Date },
	estimatedTime: {type: String},
	dueDate:{ type: String, default: null },
	images: [{type: String, default: []}]
},{timestamps: true});


module.exports = mongoose.model('Taskss', tasksSchema);