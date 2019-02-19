var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequirementSchema = new Schema({

	title: String,
	desc: String,
	attachment:String,
	assignTo:{ type: Schema.Types.ObjectId, ref: 'user'},
	projectId:{ type: Schema.Types.ObjectId, ref: 'Project'},	
	status:String,
	comment:[],
	priority:String,
	reqid:String,
	timelog:{type:Date , default:Date.now},
	startDate:String,
	dueDate:String

},{timestamps: true});
 
let RequeCounter=1;

RequirementSchema.pre('save', function(next) {	
	RequeCounter++; 
	this.reqid = 'REQUE-'+RequeCounter;

	next();

});


module.exports = mongoose.model('Requirement', RequirementSchema);
