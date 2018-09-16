var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var product =new Schema({
    prodname:{
        type:String
    },
    prodprice:{
        type:Number
    },
    prodimage:{
        type:String
    },
    category:{
       type:String 
    }

});
var order = mongoose.model('product', product);
module.exports=order;