var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({

	title: {type:String, required: true},
	desc: {type:String},
	pmanagerId:{ type: Schema.Types.ObjectId, ref: 'User', required: true },
	taskId:[{ type: Schema.Types.ObjectId, ref: 'Task'}],
	IssueId:[{ type: Schema.Types.ObjectId, ref: 'Issue'}],
	BugId:[{ type: Schema.Types.ObjectId, ref: 'Bug'}],
	Teams:[{ type: Schema.Types.ObjectId, ref: 'User'}],
	Status:{type:String, default: 'new'},
	avatar:{type:String},
	uniqueId: {
		type:String,
		require: true,
		text: true
	},
	createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
	clientEmail:{type:String},
	clientFullName:{type:String},
	clientContactNo:{type:String},
	clientDesignation:{type:String},
},{timestamps: true});


module.exports = mongoose.model('Project', ProjectSchema);	