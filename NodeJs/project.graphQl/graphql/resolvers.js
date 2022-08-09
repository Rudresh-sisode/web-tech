const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
    createUser:async function({userInput},req){
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