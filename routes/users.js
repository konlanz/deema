"use strict"
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var router = express.Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var crypto = require('crypto');

var MongoClient= mongodb.MongoClient;

var Product = require('../schema/products');
var User = require('../schema/user');
var Order = require('../schema/orders');


/* GET users listing. */
router.get('/', secur, function(req, res, next) {
  var cart = req.session.cart;
  var displayCart = {items:[], total:0}
  var total=0;
  for (var item in cart){
    displayCart.items.push(cart[item]);
    var qr=cart[item].qty;
    var pri =cart[item].price
    total +=(qr * pri);
  }

 var mainp = req.session.mainp.items;
 displayCart.total =total;
 
 
 
  var query = Product.find({category:'others'});
  query.exec((err, result)=>{
    if(err){
      throw err;
    }
    res.render("checkout.ejs",
    {cart:displayCart.items,
      total:total+mainp.price,
      datat:result,
      madp:mainp

    });

  })
  

});

router.post('/add', function(req, res){
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;
  var prod = req.body.prod;  
  Product.findOne({prodname:prod},function(err, result){
    if(err){
      console.log(err);
    }
    if(cart[prod]){
      cart[prod].qty++;
    }else{
      cart[prod]= {
        item:result._id,
        name:result.prodname,
        price:result.prodprice,
        qty:1,
        photo:result.prodimage
      }
    }        
    
    req.flash('success','You added a product to your cart')
    res.redirect('/users');
    });
  
 
});

router.post('/adduser', (req, res, next)=>{
  var name=req.body.name;
  var username = req.body.uname;
  var phone = req.body.uphone;
  var location = req.body.location;
  var passd = req.body.password;
  var passenc = crypto.createHash("md5").update(passd).digest('hex');
  User.findOne({username:username}, (err, db)=>{
    if(err){
      res.redirect("/signup");
    }
    if(db==null){
      var ser = {
        name:name,
        phone:phone,
        username:username,
        location:location,
        password:passenc
      }
      var las = new User(ser).save();
      req.flash('sucess', "You sucessfully created an account with US log in now");
      res.redirect('/');
   }else{
    req.flash('error', "User Already Exits");
    res.redirect('/signup');
  }
    
  });
  
  
});

function secur(req, res, next){
  if(req.session.user){
    next();
  }else{
    res.redirect('/');
  }
}

router.post('/login', (req, res, next)=>{
  var username = req.body.uname;
  var passd = req.body.password;
  var passenc = crypto.createHash("md5").update(passd).digest('hex');
  var qdr = {
    username:username,
    password:passenc
  }
  User.findOne(qdr, (err, db)=>{
    if(err){
      res.redirect("/signup");
    }
    if(db==null){
      req.flash('error', "Please sign up if you don't have an account");
      res.redirect("/signup")
    }else{
      req.session.user = db;
      res.redirect('/user')
    }
    
  });
});
router.post('/palaceorder', (req, res)=>{
  var mprod = req.body.mprod;
  var sprod = req.body.sprod;
  var tot = req.body.tot;
  var sqty = req.body.sqty;
  var mqty = req.body.mqty;
  var user = req.session.user;
  var uname = user.name;
  var loc = user.location;
  var  phone = user.phone;
  var date = new Date();
  var dete = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();


  var oprod ={
    name:uname,
    phone: phone,
    location:loc,
    sprod:sprod,
    sqty:sqty,
    mprod:mprod,
    mqty:mqty,
    total:tot,
    Date:dete,
    Month:month,
    Year:year
  }
  var dam = new Order(oprod).save();
  delete req.session.cart;
  delete req.session.mainp;
  res.redirect('/user');

});
module.exports = router;
