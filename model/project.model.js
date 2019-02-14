var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({

	title: String,
	desc: String,
	content: String,
	pmanagerId:[{ type: Schema.Types.ObjectId, ref: 'User'}],
	taskId:[{ type: Schema.Types.ObjectId, ref: 'Task'}],
	IssueId:[{ type: Schema.Types.ObjectId, ref: 'Issue'}],
	BugId:{ type: Schema.Types.ObjectId, ref: 'Bug'},
	Teams:[{ type: Schema.Types.ObjectId, ref: 'User'}],
	Status:String
});

module.exports = mongoose.model('Project', ProjectSchema);