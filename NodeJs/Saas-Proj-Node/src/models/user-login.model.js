const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserLoginSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    role_value:{
        type:String,
        required:true
    },
    role_name:{
        type:String,
        required:true
    },
    department:{
        type:String
    },
    designation:{
        type:String
    },
    password_life:{
        type:String
    },
    is_active:{
        type:Boolean
    },
    refreshToken:{
        type:String
    },
    cmp_id:{
        type:Schema.Types.ObjectId,
        ref:'company',
        required:true
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    is_system_entry:{
        type:Boolean
    },
    createdAt:{
        type:Date,
    },
    createdBy:{
        type:String
    },
    updatedAt:{
        type:String
    },
    updatedBy:{
        type:String
    },
    deletedAt:{
        type:String
    }
});

module.exports = mongoose.model('user_login',UserLoginSchema);