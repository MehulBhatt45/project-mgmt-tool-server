var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	title: {type:String, required: true},
	desc: {type:String},
	pmanagerId:[{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
	tasks: [{type: Schema.Types.ObjectId, ref: 'Taskss'}],
	Teams:[{ type: Schema.Types.ObjectId, ref: 'User'}],
	taskId: [{type: Schema.Types.ObjectId, ref: 'Task'}],
	IssueId: [{type: Schema.Types.ObjectId, ref: 'Issue'}],
	BugId: [{type: Schema.Types.ObjectId, ref: 'Bug'}],
	Status:{type:String, default: 'new'},
	avatar:{type:String},
	uniqueId: {
		type:String,
		require: true,
		text: true
	},
	clientEmail: {type: String },
	clientFullName:  {type: String},
	clientContactNo: {type: String},
	clientDesignation: {type: String},	
	createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
	deadline: {type:Date},
},{timestamps: true});


module.exports = mongoose.model('Project', ProjectSchema);	