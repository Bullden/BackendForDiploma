module.exports = function (app, mongoose) {
    var Post = require('../models/postModel')
    var Category = require('../models/categoryModel')
    var User = require('../models/userModel')
    var bodyParser = require('body-parser')
    var jwtDecode = require('jwt-decode');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })
    app.use(bodyParser.json())

    app.get("/posts/:category_id", async function (req, res) {
        try {
          const category = await Category.findOne({ _id: req.params.category_id });
    
          if (!category) {
            return res.status(404).send({
              status: 404,
              message: "Category not found.",
            });
          }
          const token = category.posts;
    
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

    app.get('/posts', urlencodedParser, async function (req, res){       
        try {
            const post = await Post.find();

            if (!post) {
                return res.status(404).send({
                    message: 'Post not found.'
                });
            }

            const token = post

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
    app.get('/top10', urlencodedParser, async function (req, res){
        try {
            const category = await Category.find();
            let arr = []
            category.map((i) => {
                if(i.posts.length !==0 ) {
                    i.posts.map((j) => {
                        arr.push(j)
                    })
                }
            })
            for( var i = 0, endI = arr.length - 1; i < endI; i++){
                for( var j = 0, endJ =  endI - i; j < endJ; j++) {   
                    if(arr[j].likes < arr[j + 1].likes) {
                        var swap = arr[j + 1]
                        arr[j + 1] = arr[j];
                        arr[j] = swap;
                    }
                }
            }
            let arrayOfTopTen = arr.slice(0,10)            
            if (!category) {
                return res.status(404).send({
                    message: 'Category not found.'
                });
            }

            const token = arrayOfTopTen

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
    app.post('/posts/:category_id', urlencodedParser, async function (req, res) {
        const {title, content} = req.body
        try {

            const categoryCheck = await Category.findOne({_id: req.params.category_id})
            
            const post = new Post({
                title,
                content,
                // category: categoryCheck,
                likes: 0,
                сomments: [
                    
                ]
            })
            console.log(categoryCheck);
            
            if(categoryCheck) {
                console.log(categoryCheck.posts);
                
                categoryCheck.posts.push(post)
            }
            await categoryCheck.save()
            await post.save();
            res.status(200).send({
                status: 200,
                message:'Post has been successfully added.',
                id: post._id
            });
        } catch(err) {
            res.status(500).send({
                message:err.toString()
            })
        }
    })
    app.post('/like/:post_id', urlencodedParser, async function (req, res) {
        let token = req.headers.authorization
        let decoded = jwtDecode(token)    
        try {
            let user = await User.findOne({ username: decoded.user.username });
            let category = await Category.find();
            let current = {}
            category.forEach((i) => {      
                console.log(i);
                
                i.posts.find((j) => { 
                    if(j._id == req.params.post_id) {               
                        return current = i
                    }
                })          
            })
            
            let likes = user.likedPostsIds
            let post = current.posts.find((i) => {
                if(i._id == req.params.post_id) {
                    return i
                }
            })
            let arr = likes.slice()
            if(likes.length !== 0) {
                let foo = likes.find( i => i ===  req.params.post_id)
                if(foo) {
                    likes.map((i,idx) => {
                        if(i === foo) {
                            post.likes --
                            arr.splice(idx,1)
                        }
                    })
                }else {
                    post.likes ++
                    arr.push(req.params.post_id)
                }
                            
            } else {
                post.likes ++
                arr.push(req.params.post_id)
            }

            user.likedPostsIds = arr
            
            
            await current.save();      
            await user.save()

            res.status(200).send({
                status: 200,
                message:'Like has been successfully added/removed.',
                likes: post.likes
            });
        } catch(err) {
            res.status(500).send({
                message:err.toString()
            })
        }
    })

}
