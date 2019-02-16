var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IssueSchema = new Schema({

	title: String,
	desc: String,
	attachment:String,
	assignTo:{ type: Schema.Types.ObjectId, ref: 'User'},
	projectId:{ type: Schema.Types.ObjectId, ref: 'Project'},	
	status:String,
	comment:[],
	priority:String,
	issueid:String,
	timelog:{type:Date , default:Date.now},
	startDate:String,
	dueDate:String

});

let IssueCounter=1;

IssueSchema.pre('save', function(next) {	
	IssueCounter++; 
	this.issueid = 'ISSU-'+IssueCounter;

	next();

});

module.exports = mongoose.model('Issue', IssueSchema);