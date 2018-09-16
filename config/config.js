"use strict"
var mongoose=require('mongoose');
var mongodb =require('mongodb');
var dburl = "mongodb://konlanz:5hinvi5@ds213229.mlab.com:13229/mums";
mongoose.Promise=global.Promise;
mongoose.connect(dburl);
console.log('connected');

