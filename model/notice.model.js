var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticeSchema = new Schema({
	title:{type:String},
	desc: {type:String},
	images:[{type: String}],
    published:{type:Boolean},
    expireon:{type:Date},
    createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
},{timestamps: true});


module.exports = mongoose.model('Notice',NoticeSchema);


