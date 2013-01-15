var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
	
var AnswerSchema = new Schema({
	content: { type: String },
	note_id: { type: ObjectId, index: true },
	title:{type:String},
	nickname:{ type: String },
	shit: { type:Array}, //吐槽 String->Array
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
	content_is_html: { type: Boolean }
});

mongoose.model('Answer', AnswerSchema);
