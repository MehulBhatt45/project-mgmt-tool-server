var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BugSchema = new Schema({

	title: String,
	desc: String,
	attachment:String,
	assignTo:{ type: Schema.Types.ObjectId, ref: 'User'},
	projectId:{ type: Schema.Types.ObjectId, ref: 'Project'},	
	status:String,
	comment:[],
	priority:String,
	bugid:String,
	timelog:{type:Date , default:Date.now},
	startDate:String,
	dueDate:String

});

let BugCounter=1;

BugSchema.pre('save', function(next) {	
	BugCounter++; 
	this.bugid = 'BUG-'+BugCounter;

	next();

});

BugSchema.pre('find', function(next) {	
	this.populate('projectId');
	next();

});


module.exports = mongoose.model('Bug', BugSchema);