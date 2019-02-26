var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequirementSchema = new Schema({

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
	startDate:{ type: Date },
	dueDate:{ type: Date }

},{timestamps: true});
 
let RequeCounter=1;

RequirementSchema.pre('save', function(next) {	
	this.uniqueId = 'REQ-'+RequeCounter;
	RequeCounter++; 
	next();
});


module.exports = mongoose.model('Requirement', RequirementSchema);
