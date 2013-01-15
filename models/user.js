var mongoose = require('mongoose');
var Schema = mongoose.Schema;
  
var UserSchema = new Schema({
  name: { type: String, index: true },
  loginname: { type: String, unique: true },
  pass: { type: String },
  email: { type: String, unique: true },
  url: { type: String },
  location: { type: String },
  signature: { type: String },
  profile: { type: String },
  weibo: { type: String },
  avatar: { type: String },
  avatar_x:{ type:String}, //小图标x坐标
  avatar_y:{ type:String}, //小图标y坐标
  score: { type: Number, default: 0 },
  topic_count: { type: Number, default: 0 },
  reply_count: { type: Number, default: 0 },
  follower_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },
  collect_tag_count: { type: Number, default: 0 },
  collect_topic_count: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  is_star: { type: Boolean },
  level: { type: String },
  active: { type: Boolean, default: true },
  
  receive_reply_mail: {type: Boolean, default: false },
  receive_at_mail: { type: Boolean, default: false },
  from_wp: { type: Boolean },

  retrieve_time : {type: Number},
  retrieve_key : {type: String}
});

mongoose.model('User', UserSchema);
