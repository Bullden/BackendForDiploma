module.exports = function (app, mongoose) {
  var Category = require("../models/categoryModel");
  var Comment = require("../models/commentModel");
  var bodyParser = require("body-parser");
  var jwtDecode = require('jwt-decode');
  var moment = require('moment');
  var urlencodedParser = bodyParser.urlencoded({
    extended: true,
  });
  app.use(bodyParser.json());

  // app.get('/categories', async function (req, res) {
  //     try {
  //        const category = await Category.find();
  //         console.log(category)
  //         if (!category) {
  //           return res.status(404).send({
  //             success: false,
  //             status: 404,
  //             message: 'сategories are not found!!!!'
  //           });
  //         }
  //         const token = category

  //         res.status(200).send({
  //           success: true,
  //           status: 200,
  //           data: token,
  //         });
  //       } catch (err) {
  //         res.status(500).send({
  //           success: false,
  //           message: err.toString()
  //         });
  //       }
  // })



  app.get("/comments/:post_id", async function (req, res) {
    try {
      const category = await Category.find();
      let current = {}
      category.forEach((i) => {      
        console.log(i);
        
        i.posts.find((j) => { 
            if(j._id == req.params.post_id) {               
                return current = i
            }
        })          
      })
      
      
      current.posts.map((i) => {
         return comments = i.comments
      })
      console.log(comments);
      
      if (!category) {
        return res.status(404).send({
          status: 404,
          message: "Category not found.",
        });
      }
      const token = comments;

      res.status(200).send({
        status: 200,
        data: token,
      });
    } catch (err) {
      res.status(500).send({
        message: err.toString(),
      });
    }
  });

  app.post("/comments/:post_id", urlencodedParser, async function (
    req,
    res
  ) {
    let token = req.headers.authorization
    let decoded = jwtDecode(token)   
    let date =  moment().format('DD.MM.YYYY');
    let username = decoded.user.username
    
    const { text } = req.body;
    const category = await Category.find();
    
    let current = {}
    category.forEach((i) => {           
        i.posts.find((j) => { 
            if(j._id == req.params.post_id) { 
             
                            
              return current = i
            }
        })          
    })
    try {
      const comment = new Comment({
        text,
        username,
        date
      });
      //   console.log(req.params.post_id);   
      current.posts.map((i) => {
        // console.log(req.params.post_id , i._id);
        if (i._id == req.params.post_id) {
        
          return i.comments.push(comment);
        }
      });
      
      await current.save();

      res.status(200).send({
        status: 200,
        message: "Comment has been successfully added.",
        id: comment._id
      });
    } catch (err) {
      res.status(500).send({
        message: err.toString(),
      });
    }
  });
};
