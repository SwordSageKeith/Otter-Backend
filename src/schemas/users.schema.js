var mongoose = require('mongoose');
const mongoPass = require("passport-local-mongoose");

var Schema   = mongoose.Schema;

var user = new Schema({
    username: {
        type: String,
        required: [true, "Must have username"],
        unique: true
    },
    displayName: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    }
});

user.plugin(mongoPass);

module.exports = mongoose.model('user', user);