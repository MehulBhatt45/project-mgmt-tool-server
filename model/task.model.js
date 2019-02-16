var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({

	taskid:String,
	title: String,
	desc: String,
	attachment:String,
	assignTo:{ type: Schema.Types.ObjectId, ref: 'User'},
	projectId:{ type: Schema.Types.ObjectId, ref: 'Project'},	
	status:String,
	comment:[],
	priority:String,
	startDate:String,
	dueDate:String,
	timelog:{type:Date , default:Date.now},

});

let TaskCounter=1;

TaskSchema.pre('save', function(next) {	
	TaskCounter++; 
	this.taskid = 'TSK-'+TaskCounter;

	next();

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