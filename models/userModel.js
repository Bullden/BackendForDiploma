var mongoose = require('mongoose')

var Schema = mongoose.Schema

var UserShema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    likedPostsIds: Array
})

var User =  mongoose.model('User', UserShema)

module.exports = User