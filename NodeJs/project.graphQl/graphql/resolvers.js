const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcryptjs');

module.exports = {
    createUser:async function({userInput},req){
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