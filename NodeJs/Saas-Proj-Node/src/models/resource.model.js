const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resource = new Schema({
    name:{
        type:String,
        required:true
    },
    value:{
        type:String,
        required:true
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

module.exports = mongoose.model("resource",resource);