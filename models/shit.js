var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
	
var ShitSchema = new Schema({
	content: { type: String },
	note_id: { type: ObjectId, index: true },
	title:{type:String},
	nickname:{ type: String },
	shit: { type:String}, //吐槽
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
	content_is_html: { type: Boolean }
});

mongoose.model('Shit', ShitSchema);
