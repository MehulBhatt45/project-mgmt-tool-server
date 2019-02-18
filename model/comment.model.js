var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({

	content: String,
	userId: { type: Schema.Types.ObjectId, ref: 'User'},
	taskId: { type: Schema.Types.ObjectId, ref: 'Task'},
	issueId: { type: Schema.Types.ObjectId, ref: 'Issue'},
	bugId: { type: Schema.Types.ObjectId, ref: 'Bug'},
	postedOn: { type: Date, default: Date.now }
	
})

// CommentSchema.pre('find', function(next) {	
// 	this.populate('issueId');
// 	next();

// });
module.exports = mongoose.model('Comment',CommentSchema);