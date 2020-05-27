module.exports = function (app, mongoose) {
    var Category = require('../models/categoryModel')
    var bodyParser = require('body-parser')
    var urlencodedParser = bodyParser.urlencoded({
        extended: true
    })
    app.use(bodyParser.json())
    
    app.get('/categories', async function (req, res) {
        try {
           const category = await Category.find();
            if (!category) {
              return res.status(404).send({
                status: 404,
                message: 'Category not found.'
              });
            }
          let arr = []
          
           category.map((i) => {
              let obj = {title: '', _id: ''}
              obj.title = i.title
              obj._id = i._id
              arr.push(obj)
            })          
  
    
            const token = arr

            res.status(200).send({
              status: 200,
              data: token,
            });
          } catch (err) {
            res.status(500).send({
              message: err.toString()
            });
          }
    })

    app.get('/posts/:id', async function (req, res) {

      
      try {
        const category = await Category.find()
        let posts = {}
        category.map((i) => {
          console.log(i);
          
        })
        //  let a = Object.keys(category)
        //   console.log(a);
          
          if (!category) {
            return res.status(404).send({
              status: 404,
              message: 'Category not found.'
            });
          }
          const token = category

          res.status(200).send({
            status: 200,
            data: token,
          });
        } catch (err) {
          res.status(500).send({
            message: err.toString()
          });
        }
  })

    app.post('/categories',urlencodedParser, async function (req, res) {
      
      const {title} = req.body
      const posts = []
      try {
          const category = new Category({
              title,
              posts
          })
          const newCategory = await category.save();


          res.status(200).send({
              status: 200,
              message:'Category has been successfully added.',
              id: newCategory._id
          });
      } catch(err) {
          res.status(500).send({
              message:err.toString()
          })
      }
  })

    app.put('/tasks/:id', async function (req, res){

      const {list} = req.body;
      const name = list.list
    try {
      const listUpdated = await Task.findByIdAndUpdate( {_id:req.body._id}
         ,
        {
          $set: {
            list,
          }
        },
        { new: true }
        );


      if (!listUpdated) {
        return res.status(404).send({
          message: 'List not found.',
          data: null
        });
      }
      res.status(200).send({
        data: listUpdated
      });
    } catch (err) {
      res.status(500).send({
        message: err.toString(),
        data: null
      });
    }
    })
}
