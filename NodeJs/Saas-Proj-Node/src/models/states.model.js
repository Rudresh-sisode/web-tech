const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const states = new Schema({
    city_name:{
        type:String,
    },
    state_name:{
        type:String
    }
    
});

module.exports = mongoose.model('states',states);