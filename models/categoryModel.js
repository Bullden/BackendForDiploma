var mongoose = require('mongoose')
var relationship = require("mongoose-relationship");
// data
var Schema = mongoose.Schema


var categorySchema = new Schema({
    title: String,
    posts: [
        {
            title: String,
            content: String,
            likes: Number,
            comments: [
                {
                    text: String,
                    username: String,
                    date: String
                }
            ]
        }
    ]
})

var Category = mongoose.model('Category',categorySchema , 'categories')

module.exports = Category
