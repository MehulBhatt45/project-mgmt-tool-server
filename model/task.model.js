var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({

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
	completedAt: { type: Date },
	dueDate:{ type: Date }

},{timestamps: true});

let TaskCounter=1;

TaskSchema.pre('save', function(next) {	
	this.uniqueId = 'TSK-'+TaskCounter;
	TaskCounter++;
	next();
});

TaskSchema.pre('find', function(next) {	
	this.populate('projectId');
	this.populate('createdBy');
	next();
});



module.exports = mongoose.model('Task', TaskSchema);