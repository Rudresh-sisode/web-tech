const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roles = new Schema({
    role_name:{
        type:String
    },
    role_value:{
        type:String
    },
    resource_name:{
        type:String,
        required:true
    },
    resource_value:{
        type:String,
        required:true
    },
    resource_id:{
        type:String
    },
    action_name:{
        type:String
    },
    action_value:{
        type:String
    },
    action_id:{
        type:String
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

})

module.exports = mongoose.model("roles",roles);