var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticeSchema = new Schema({
	title:{type:String , required:true},
	desc: {type:String , required:true},
	images:[{type: String}],
    published:{type:Boolean , required:true},
    expireon:{type:Date},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
},{timestamps: true});


module.exports = mongoose.model('Notice',NoticeSchema);


