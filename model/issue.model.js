var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IssueSchema = new Schema({

	title: { type: String, required: true },
	desc: { type: String },
	attachment:{ type: String },
	assignTo:{ type: Schema.Types.ObjectId, ref: 'User'},
	projectId:{ type: Schema.Types.ObjectId, ref: 'Project'},	
	status:{ type: String, default: "to do" },
	comment:[{ type: Schema.Types.ObjectId, ref: 'Comment'}],
	priority:{ type: String , default: "low"},
	uniqueId:{ type: String },
	timelog:[{
		operation: {type: String},
		dateTime: {type: Date},
		operatedBy: {type: Schema.Types.ObjectId, ref: 'User'},
		_id: false
	}],
	createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
	startDate:{ type: Date },
	dueDate:{ type: Date }

},{timestamps: true});

let IssueCounter=1;
var Issue = mongoose.model('Issue', IssueSchema);
IssueSchema.pre('save', function(next) {	
	this.uniqueId = 'ISSU-'+IssueCounter;
	IssueCounter++; 
	next();
	Issue.find({}).exec((err, issue)=>{console.log(issue)})
});

IssueSchema.pre('find', function(next) {	
	this.populate('projectId');
	this.populate('createdBy');
	next();
});


module.exports = mongoose.model('Issue', IssueSchema);