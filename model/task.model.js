var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({

	title: String,
	desc: String,
	assignTo:[{ type: Schema.Types.ObjectId, ref: 'User'}],
	projectId:[{ type: Schema.Types.ObjectId, ref: 'Project'}],	
	Status:String,
	comment:[],
	priority:String,
	taskid:String,
	timelog:{type:Date , default:Date.now}

});

TaskSchema.pre('find', function(next) {
  this.populate('projectId');
  next();

});
TaskSchema.pre('findOne', function(next) {
  this.populate('projectId');
  next();

});


module.exports = mongoose.model('Task', TaskSchema);