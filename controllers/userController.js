    
// import * as bcrypt from 'bcrypt';

// import * as jwt from 'jwt-then';

module.exports = function (app, mongoose) {
    var jwtDecode = require('jwt-decode');
    const bcrypt = require('bcrypt');
    const jwt = require('jwt-then')
    // var bcrypt = require('C:/Users/Denis/AppData/Local/Microsoft/TypeScript/3.8/node_modules/@types/bcrypt/index')
    var User = require('../models/userModel')
    var bodyParser = require('body-parser')
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })
    app.use(bodyParser.json())

    app.get('/user', urlencodedParser, async function (req, res){
        let token = req.headers.authorization
        let decoded = jwtDecode(token)  
        let user = await User.findOne({ username: decoded.user.username });
        console.log(user);
        
        try {
            if (!user) {
                return res.status(404).send({
                    status: 404
                });
            }
            let currentUser = {
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                likedPostsIds: user.likedPostsIds,
                _id: user._id
            }

            res.status(200).send({
                status: 200,
                data: currentUser,
            });
        } catch (err) {
            res.status(500).send({
                message: err.toString()
            });
        }
    })

    app.get('/users', urlencodedParser, async function (req, res){

        let users = await User.find();
        console.log(users);
        
        try {
            if (!users) {
                return res.status(404).send({
                    status: 404
                });
            }
            // let currentUser = {
            //     username: user.username,
            //     firstname: user.firstname,
            //     lastname: user.lastname,
            //     likedPostsIds: user.likedPostsIds,
            //     _id: user._id
            // }

            res.status(200).send({
                status: 200,
                data: users,
            });
        } catch (err) {
            res.status(500).send({
                message: err.toString()
            });
        }
    })

    app.post('/registration', urlencodedParser, async function (req, res) {
        const userInfo = req.body
        try {
            
            const userCheck = await User.findOne({ username: userInfo.username });
            
            if (userCheck) {
              return res.status(404).send({
                status: 404,
                message: 'Someone is registered with the same username.'
              });
            }

            if(!userInfo.password) {
                return res.status(400).send({
                    status: 400,
                    message:'Password is required for user'
                })
            }

            if(!userInfo.firstname) {
                return res.status(400).send({
                    status: 400,
                    message:'Firstname is required for user'
                })
            }

            if(!userInfo.username) {
                return res.status(400).send({
                    status: 400,
                    message:'Username is required for user'
                })
            }

            if(!userInfo.lastname) {
                return res.status(400).send({
                    status: 400,
                    message:'Lastname is required for user'
                })
            }

            let space = /\s/
            let russian = /[а-яА-ЯЁё]/
            let symbols = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
            let number = /\d/

            if(russian.test(userInfo.firstname) === true || 
            space.test(userInfo.firstname) === true || 
            symbols.test(userInfo.firstname) === true || 
            number.test(userInfo.firstname) === true ) {

               return res.status(400).send({
                    status: 400,
                    message:'Invalid symbols in firstname'
                })

            }

            if(russian.test(userInfo.lastname) === true || 
            space.test(userInfo.lastname) === true || 
            symbols.test(userInfo.lastname) === true || 
            number.test(userInfo.lastname) === true ) {

               return res.status(400).send({
                    status: 400,
                    message:'Invalid symbols in lastname'
                })

            }

            if(userInfo.password.length < 8 ) {            
                return res.status(400).send({
                    status: 400,
                    message:'Password is too short'
                })
            }

            if(number.test(userInfo.password) === false) {
                return res.status(400).send({
                    status: 400,
                    message:'One number is required for password'
                })
            }

            if (userInfo.password.replace(/[^A-Z]/g, '').length === 0) {
                return res.status(400).send({
                    status: 400,
                    message:'One uppercase letter is required for password'
                })
            }   

            if (userInfo.password.replace(/[^a-z]/g, '').length === 0) {
                return res.status(400).send({
                    status: 400,
                    message:'One lowercase letter is required for password'
                })
            }

            if(russian.test(userInfo.username) === true || 
            space.test(userInfo.username) === true || 
            symbols.test(userInfo.username) === true ) {

               return res.status(400).send({
                    status: 400,
                    message:'Invalid symbols in username'
                })

            }
          

            const hash = await bcrypt.hash(userInfo.password, 10);

            const user = new User({
                likedPostsIds: [],
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                username: userInfo.username,
                password: hash,
            })
            await user.save();
            res.status(200).send({
                status: 200,
                message:'Registration is successful.',
                id: user._id
            });
        } catch(err) {
            res.status(500).send({
                message:err.toString()
            })
        }
    })
    app.post('/signIn', urlencodedParser, async function (req, res) {
        const {password, username} = req.body
        
        try {
            const user = await User.findOne({ username: username });
          

            if (!user) {
                return res.status(404).send({
                  status: 404,
                  message: 'User not found.'
                });
            }

            
            let space = /\s/
            let russian = /[а-яА-ЯЁё]/
            let symbols = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
            let number = /\d/

            if(password.length < 8 ) {            
                return res.status(400).send({
                    status: 400,
                    message:'Password is too short'
                })
            }

            if (password.replace(/[^A-Z]/g, '').length === 0) {
                return res.status(400).send({
                    status: 400,
                    message:'One capital letter required for password'
                })
            }   

            if (password.replace(/[^a-z]/g, '').length === 0) {
                return res.status(400).send({
                    status: 400,
                    message:'One lowercase letter required for password'
                })
            }

            if(russian.test(username) === true || 
            space.test(username) === true || 
            symbols.test(username) === true ) {

               return res.status(400).send({
                    status: 400,
                    message:'Invalid symbols in username'
                })

            }


            const matchPasswords = await bcrypt.compare(password, user.password);

            if (!matchPasswords) {
                return res.status(401).send({
                  status: 401,
                  message: 'Not authorized.'
                });
            }

            const token = await jwt.sign({ user }, 'jwt_please_change', {
                expiresIn: '24h'
            });
            console.log(token);
            

            // const user = new User({
            //     firstname: userInfo.firstname,
            //     lastname: userInfo.lastname,
            //     username: userInfo.username,
            //     password: hash
            // })
            // console.log(user);
            
            
            res.status(200).send({
                status: 200,
                message: 'Login is successful.',
                data: token,
                id: user._id,
                // name: user.name,
              
              });
            
            } catch (err) {
              res.status(500).send({
                message: err.toString()
              });
            }
    })


}