var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var validator = require('express-validator');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var helmet = require('helmet');
var messages = require('express-messages');
var compression = require('compression');
var cors = require('cors');
var csrf = require('csurf');
var safe = require('safe-regex');



require('./config/config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(helmet());
app.use(helmet.xssFilter({ setOnOldIE: true }));
app.use(helmet.frameguard('deny'));
app.use(helmet.hsts({maxAge: 7776000000, includeSubdomains: true}));
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.noCache());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(session({
  secret:"total jdijn  54u892n JNGRNOHNHSu895tnwuj88*8ytg6FG6GB989hqg2g3729nw9wns",
  resave:false,
  saveUninitialized:true,
  unset:'destroy'

}));
app.use(validator({
  errorFormatter:function(param,msg, value){
    var namespace = param.split('.'),
    root =namespace.shift(),
    foreParam=root;
  while(namespace.length){
    foreParam+='['+ namespace.shift() +']';
  }
  return{
    param:foreParam,
    msg:msg,
    value:value
  }  
  }
}));  
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
