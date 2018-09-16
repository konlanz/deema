"use strict"
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var messages = require('express-messages');
var router = express.Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var validator = require('express-validator');

var products = require('../schema/products');
var orders = require('../schema/orders');

router.get('/signup', (req, res, next)=>{
  res.render('signup');
});

//ths for securing the the routes;
function secur(req, res, next){
  if(req.session.user){
    next();
  }else{
    res.redirect('/');
  }
}

router.get('/user', secur, (req, res, next)=>{
  var user = req.session.user;
  var username = user.name;
  if(req.session.mainp){
   delete req.session.mainp;
  }
  if(req.session.cart){
    delete req.session.cart;
   }
   
  orders.find({name:username}, (err, result)=>{
    if (err) throw err;

    products.find({category:'breakfast'},function(err, dat){
      if (err) throw err;

      res.render('user', {data:result,
      dat:dat}
       
      );    
    });

    
  });

});

router.get('/', (req, res, next)=>{
  res.render('login');
});

router.post('/shop', (req, res, next)=>{
  req.session.mainp = req.session.mainp || {};
  var mainp = req.session.mainp; 
  var prod = req.body.prod;
  var items="items";
  products.findOne({prodname:prod},function(err, result){
    if(err){
     throw err;
    }
    if(mainp[items]){
      mainp[items].qty++;
    }else{
      mainp[items]= {
        item:result._id,
        name:result.prodname,
        price:result.prodprice,
        qty:1,
        photo:result.prodimage
      }
    }        
    
    req.flash('success','You Selected a product please slect your add ons');
    res.redirect('/users');
    });
  
});


router.get('/logout', (req, res, next)=>{
  delete req.session.user;
  res.redirect('/');
})

module.exports = router;
