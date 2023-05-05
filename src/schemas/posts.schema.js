var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var post = new Schema({
          content: String
});

module.exports = mongoose.model('post', post);