const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const authMiddleware = require("../middleware/is-auth");
//exports
exports.loginUser = async ({email,password})=>{
    
    const user = await User.findOne({email:email}).lean();
    if(!user){
        const error = new Error("User not found");
        error.code = 401;
        throw error;
    }
    const isequal = await bcrypt.compare(password,user.password);
    if(!isequal){
        const error = new Error("Password is incorrenct");
        error.code = 401
        throw error;
    }

    const token = jwt.sign({
        userId: user._id.toString(),
        email: user.email
    },'somesupersecrete',{expiresIn:'3m'})

    return { token: token, userId : user._id.toString()}
}

