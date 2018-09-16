
"use strict"
var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var messages = require('express-messages');
var multer = require('multer');
var upload = require("./upload");
var mongoose = require('mongoose');
var validator = require('express-validator');
const {sanitizeBody}= require('express-validator/filter');
var crypto = require('crypto');

var Admin = require('../schema/admin');
var Orders = require('../schema/orders');
var Products = require('../schema/products');
var Userz = require('../schema/user');

var date = new Date();
var dete = date.getDate();
var month = date.getMonth()+1;
var year = date.getFullYear();


router.get('/', (req, res , next)=>{
    res.render('aindex');
});

function secur(req, res, next){
    if(req.session.admin){
      next();
    }else{
      res.redirect('/');
    }
  }


router.post('/admin_login', (req, res, next)=>{
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var passenc = crypto.createHash('md5').update(password).digest('hex');
    Admin.findOne({username:username, email:email, password:passenc},(err, data)=>{
        if(err){
            res.redirect('/admin_login');
        }
        req.session.admin= data; 
        var adminses= req.session.admin;
        res.redirect('/admin/panel');

    });
    
});


router.get('/panel/userz', secur, (req, res )=>{
    Userz.find({}, (err, db)=>{
        if(err) throw err;
        res.render('lusers', {data:db})
    })
})

router.get('/orders',  secur, (req, res )=>{
    var query = Orders.find({Month:month});
    query.sort({Date:-1}).exec((err, db)=>{
        if(err) throw err;
        res.render('orders',{data:db});
    });


})


router.post('/delete_product',  secur, (req, res)=>{
    var hey=req.body.hello;
    Products.findByIdAndRemove({_id:hey}, (err, con)=>{
        if(err) throw err;
        res.redirect('/admin/panel')
    })
})
router.get('/panel', secur,  (req, res, next)=>{
    Orders.find({Date:dete}, (err, result)=>{
        if(err){
            res.redirect('/');
        }

    res.render('panel', {data:result});    
        
    })
    
    
});


router.get('/panel/product', secur,  (req, res, next)=>{
    Products.find({}, (err, result)=>{
        res.render('products', 
        {data:result});
    })
    
});

router.post('/addproduct', secur,  (req, res)=>{
    var prodname = req.body.prodname;
    var prodprice = req.body.prodprice;
    var category = req.body.category;
    upload(req, res, (err)=>{
        if(err){
          throw err;
          res.render('index', {
            msg:err
          });
        }else{
            
          var obj = {prodname:req.body.prodname, prodimage: req.file.filename, prodprice:req.body.prodprice, category:req.body.category};
          var prd = new Products(obj);
          prd.save();
          res.redirect('/') 
        }
    });
   
      

    
    
});

router.get('/logout', (req, res, next)=>{
    delete req.session.admin;
    res.redirect('/');
  })

router.get('/addadmin', secur, (req, res, next)=>{
    //i will be addd the addmi here late with double encryption
    res.render('addmin');
});

router.post('/add_admin', secur, (req, res)=>{
    var name = req.body.nam;
    var username = req.body.uname;
    var email = req.body.email;
    var password = req.body.password;
    var passenc = crypto.createHash('md5').update(password).digest('hex');
    var adde ={
        name:name,
        email:email,
        username:username,
        password:passenc
    } 
    new Admin(adde).save();
    res.redirect('/admin');

});











module.exports = router;