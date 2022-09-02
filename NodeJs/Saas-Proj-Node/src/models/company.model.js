const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const company = new Schema({
    cmp_name:{
        type:String,
        required:true
    },
    cmp_email:{
        type:String,
        required:true
    },
    cmp_address:{
        type:String,
        required:true
    },
    cmp_address2:{
        type:String
    },
    city:{
        type:String
    },
    zipcode:{
        type:String,
        required:true
    },
    state_key:{
        type:String,
        required:true
    },
    office_number:{
        type:String,
        required:true
    },
    mobile_number:{
        type:String
    },
    fax:{
        type:String
    },
    website:{
        type:String
    },
    is_system_entry:{
        type:Boolean
    },
    is_active:{
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
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('company',company);