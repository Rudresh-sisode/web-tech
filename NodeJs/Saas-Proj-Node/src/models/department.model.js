const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const department = new Schema({
    companyId:{
        type:Schema.Types.ObjectId,
        ref:'company',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    value:{
        type:String,
        required:true
    },
    is_system_default:{
        type:Boolean,
        default:false
    },
    created_at:{
        type:Date,
        default:null
    },
    created_by:{
        type:String,
        default:null
    },
    updated_at:{
        type:Date,
        default:null
    },
    updated_by:{
        type:String,
        default:null
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    deleted_at:{
        type:Date,
        default:null
    },
    deleted_by:{
        type:String,
        default:null
    }
})

module.exports = mongoose.model("department",department);