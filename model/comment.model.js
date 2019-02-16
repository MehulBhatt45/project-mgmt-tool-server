var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({

	content: String,
	userId: { type: Schema.Types.ObjectId, ref: 'user'},
	taskId: { type: Schema.Types.ObjectId, ref: 'task'},
	issueId: { type: Schema.Types.ObjectId, ref: 'ssue'},
	bugId: { type: Schema.Types.ObjectId, ref: 'bug'},
	postedOn: { type: Date, default: Date.now },
	

})
module.exports = mongoose.model('comment',commentSchema);