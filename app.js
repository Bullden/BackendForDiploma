// Mongo DB CRUD Demo

// Modules
var cors = require('cors')
var mongoose = require('mongoose')
var express = require('express')
var fs = require('fs')

// express setup
var app = express()
// var port = process.env.PORT || 3001
var port = process.env.PORT || 5000

// Controllers
var commentController = require('./controllers/commentController')
var postController = require('./controllers/postController')
// var personSetup = require('./controllers/setupController')
var taskController =  require('./controllers/categoryController')
var userController = require('./controllers/userController')

// load mongo config
var mongoConfig = JSON.parse(fs.readFileSync(__dirname + '/mongo-config.json', 'utf8'));

var mongourl = mongoConfig.mongourl

// configure assets and vies
app.use('/assets', express.static(__dirname + '/public'))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.use(cors())
mongoose.set('useFindAndModify', false)


// connect to mongodb
mongoose.connect(mongourl, {useNewUrlParser: true , useUnifiedTopology:true})


// inti controllers
commentController(app, mongoose)
postController(app, mongoose)
// personSetup(app, mongoose)
taskController(app, mongoose)
userController(app, mongoose)

// kick web server off
app.listen(port)
app.use(function(req, res, next) {
    res.status(404).send({
        status: 404,
        massage: 'Page not found'
    });
});

console.log('mongo client listening on port', port)
