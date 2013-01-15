var mongoose = require('mongoose');
var config = require('../config').config;
  
mongoose.connect(config.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models

require('./user');
require('./note');
require('./blog');
require('./answer');
require('./shit');
require('./reply'); //评论


exports.User = mongoose.model('User');
exports.Note = mongoose.model('Note');
exports.Blog = mongoose.model('Blog');
exports.Answer = mongoose.model('Answer');
exports.Shit = mongoose.model('Shit');
exports.Reply = mongoose.model('Reply');