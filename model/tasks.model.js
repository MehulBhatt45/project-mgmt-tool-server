var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timeLogSchema = require('./timeLog.model')
var tasksSchema = new Schema({
	type: {type: String },
	title: {type: String , required: true},
	desc: {type: String, required: true},
	assignTo: {type: Schema.Types.ObjectId , ref: 'User', required: true},
	// sprint: {type: Schema.Types.ObjectId ,ref :'Sprint', required:true},
	projectId: {type: Schema.Types.ObjectId , ref: 'Project', required: true},
	// projectTitle: {type: Schema.Types.ObjectId , ref: 'Project', required: true},
	// pmanagerName: {type: Schema.Types.ObjectId , ref: 'User', default : null},
	status: {type: String , default: 'to do'},
	comment:[{ type: Schema.Types.ObjectId, ref: 'Comment'}],
	priority:{ type: String },
	uniqueId:{ type: String },
	timelog:[{
		operation: {type: String},
		dateTime: {type: Date},
		operatedBy: {type: Schema.Types.ObjectId, ref: 'User'},
		_id: false
	}],
	timelog1: {type: Schema.Types.ObjectId , ref: 'timeLog'},
	createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
	startDate:{ type: Date },
	estimatedTime: { type: String },
	completedAt: { type: Date },
	estimatedTime: {type: String},
	dueDate:{ type: String, default: null },
	images: [{type: String, default: []}]
},{timestamps: true});


// let TasksCounter = 1;

tasksSchema.pre('save' , function(next) {
	var task = this;
	console.log("IN TIME LOG ADD FUNCTION $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
	var timelog = new timeLogSchema({
		count: 0,
		taskId: task._id,
		log: [{
			startTime: null
		}],
	});
	timelog.save(function(err, log){
		console.log("IN TIME LOG ADD FUNCTION $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", err, log);
		if(err) {console.log(err); return null;}
		task['timelog1'] = log._id;
		console.log("===============================================>",task);
		next();
	})
});


// tasksSchema.pre('find' , function(next) {
// 	// this.populate('projectId');
// 	// this.populate('createdBy');
// 	// this.populate('timelog1');
// });


module.exports = mongoose.model('Taskss', tasksSchema);