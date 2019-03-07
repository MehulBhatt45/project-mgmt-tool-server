var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	title: {type:String, required: true},
	desc: {type:String},
	pmanagerId:{ type: Schema.Types.ObjectId, ref: 'User', required: true },
	tasks: [{type: Schema.Types.ObjectId, ref: 'Taskss'}],
	Teams:[{ type: Schema.Types.ObjectId, ref: 'User'}],
	taskId: [{type: Schema.Types.ObjectId, ref: 'Task'}],
	IssueId: [{type: Schema.Types.ObjectId, ref: 'Issue'}],
	BugId: [{type: Schema.Types.ObjectId, ref: 'Bug'}],
	Status:{type:String, default: 'new'},
	uniqueId: {
		type:String,
		require: true,
		text: true
	},
	clientEmail: {type: String , /*required: true*/},
	clientFullName:  {type: String, /*required: true*/},
	clientContactNo: {type: String, /*required: true*/},
	clientDesignation: {type: String},	
	createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
},{timestamps: true});


module.exports = mongoose.model('Project', ProjectSchema);