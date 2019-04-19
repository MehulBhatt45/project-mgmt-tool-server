var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticeSchema = new Schema({
	title:{type:String , required:true},
	desc: {type:String , required:true},
	images:[{type: String}],
    published:{type:Boolean},
    expireon:{type:String},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
},);


module.exports = mongoose.model('Notice',NoticeSchema);


