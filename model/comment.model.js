var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({

	content: String,
	userId: { type: Schema.Types.ObjectId, ref: 'User' , required:true},
	taskId: { type: Schema.Types.ObjectId, ref: 'Task', required:true},
	postedOn: { type: Date, default: Date.now ,required:true},
	images: [{type: String, default: []}]
},{timestamps: true})

// CommentSchema.pre('find', function(next) {	
// 	this.populate('issueId');
// 	next();

// });
module.exports = mongoose.model('Comment',CommentSchema);