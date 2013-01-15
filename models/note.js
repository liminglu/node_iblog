var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
  
/*
 * 问题系统
 * title
 * create date
 * status finish and  unfinish
 */
 
var NoteSchema = new Schema({
  title: { type: String },
  label:{ type:String}, //问题标签
  finished: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  content:{type:Array},//保存答案列表 
  follows:{type:Array},//关注答案列表 
  reply:{ type:String},
  replier:{ type:String},
  author:{ type: String},
  editer: {type:String},
  content_is_html: { type: Boolean }
});

mongoose.model('Note', NoteSchema);