var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var post = new Schema({
    title: String,
    content: String,
    userID: String
});

module.exports = mongoose.model('post', post);