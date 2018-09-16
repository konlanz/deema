var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adm= new Schema({
    name:{
        type:String
    },

    phone:{
        type:Number
    },
    username:{
        type:String
    },
    location:{
        type:String
    },
    
    password:{
        type:String
    }
});
var user = mongoose.model('user', adm);
module.exports= user;