var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Order=new Schema({
    name:{
        type:String
        
    },
    sprod:{
        type:String

    },
    sqty:{
        type:String
        
    },
    phone:{
        type:Number
        
    },
    location:{
        type:String
        
    },
    ghp:{
        type:String
        
    },
    mprod:{
        type:String
        
    },
    mqty:{
        type:String
        
    },
    total:{
        type:Number
        
    },
        Date:{
        type:Number
       
    },
    
    Month:{
        type:Number
        
    },

    Year:{
        type:Number
    }

});


var order = mongoose.model('oders', Order);
module.exports=order;