var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimeLogSchema = new Schema({
	count: {type:Number, default:0},
	difference: {type:Date, default: null},
	log: [{
		_id:false,
		startTime:Date,
		endTime: {type:Date, default: null},
	}],
	taskId:{type:Schema.Types.ObjectId, ref:'Taskss'},
},{timestamps: true});

module.exports = mongoose.model('timeLog',TimeLogSchema);	