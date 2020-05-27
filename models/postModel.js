var mongoose = require('mongoose')

// data
var Schema = mongoose.Schema

var PostSchema = new Schema({
    title: String,
    content: String,
    likes: Number,
    category: String,
    comments: Array
})


// person schema for mongo
var Post = mongoose.model('Post', PostSchema)


module.exports = Post
// module.exports = List
