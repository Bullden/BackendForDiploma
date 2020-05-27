var mongoose = require('mongoose')
var relationship = require("mongoose-relationship");
// data
var Schema = mongoose.Schema


var commentSchema = new Schema({
    username: String,
    text: String,
    date: String
})

var Comment = mongoose.model('Comment',commentSchema)

module.exports = Comment