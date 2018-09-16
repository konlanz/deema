var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var adm = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    }
});
var admin = mongoose.model('admin', adm);
module.exports= admin;