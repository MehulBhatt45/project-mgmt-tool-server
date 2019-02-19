var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({

	title: {type:String, required: true},
	desc: {type:String},
	pmanagerId:{ type: Schema.Types.ObjectId, ref: 'user', required: true },
	taskId:[{ type: Schema.Types.ObjectId, ref: 'Task'}],
	IssueId:[{ type: Schema.Types.ObjectId, ref: 'Issue'}],
	BugId:[{ type: Schema.Types.ObjectId, ref: 'Bug'}],
	Teams:[{ type: Schema.Types.ObjectId, ref: 'User'}],
	Status:{type:String, default: 'new'},
	uniqueId: {
		type:String,
		require: true,
		text: true
	}
},{timestamps: true});


module.exports = mongoose.model('Project', ProjectSchema);