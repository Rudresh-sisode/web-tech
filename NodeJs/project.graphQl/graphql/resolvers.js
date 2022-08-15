const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const Auth = require('../controllers/auth');
const authMiddleware = require("../middleware/is-auth");


module.exports = {
    createUser:async function({userInput},req){
        console.log(typeof req);
        const errors = [];
        if(!validator.isEmail(userInput.email)){
            errors.push({message:"Email is invalid"});
        }
        if( validator.isEmpty(userInput.password) || !validator.isLength(userInput.password,{min:5})){
            errors.push({message:"password too short!"})
        }
        if(errors.length > 0){
            const error = new Error("Invalid Input")
            error.data = errors;
            error.status = 422;
            throw error;
        }
        // const email = args.userInput.email;
        const existingUser = await User.findOne({email:userInput.email}).lean()
        if(existingUser){
            const error = new Error("User exists already!");
            throw error;
        }
        const hashedPw = await bcrypt.hash(userInput.password,12);

        const user = new User({
            email:userInput.email,
            name:userInput.name,
            password:hashedPw
        });

        const createdUser = await user.save();
        return {...createdUser._doc, _id: createdUser._id.toString()}
    },

    login:Auth.loginUser,

    createPost: async function({postInput},req){
        //
        if(!req.isAuth){
            const error = new Error("Not authenticated!");
            error.code = 401;
            throw error;
        }
        const errors = []
        if(validator.isEmpty(postInput.title) || !validator.isLength(postInput.title,{min:5})){
            errors.push({message:'title is invalid'});
        }
        // let bca = !validator.isLength(postInput.content),{min:5}
        if(validator.isEmpty(postInput.content) || !validator.isLength(postInput.content,{min:5})){
            errors.push({message:'content is invalid'});
        }

        if(errors.length > 0){
            const error = new Error("Invalid input");
            error.data = errors;
            error.code = 422;
            throw error;
        }
        //
        const user = await User.findById(req.userId)
        if(!user){
            const error = new Error("Invalid Error");
            error.data = errors;
            error.code = 401;
            throw error;
        }
        const post = new Post({
            title:postInput.title,
            content: postInput.content,
            imageUrl:postInput.imageUrl,
            creator : user
        });
        const createdPost = await post.save();
        user.posts.push(createdPost);
        await user.save();
        //add post to user's posts
        return {...createdPost._doc,
            _id:createdPost._id.toString(),
            createdAt:createdPost.createdAt.toISOString(),
            updatedAt:createdPost.updatedAt.toISOString()
        }
    }
}



// module.exports = {
//     hello:()=>{
//         return {
//             text:'~Hello word~',
//             views:123
//         }
//     }
// }