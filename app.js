var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var index = require('./routes/index');
var users = require('./routes/users');

var settings = require('./setting')
// var MongoStore = require('connect-mongo')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var methodOverride = require('method-override');
var flash = require('connect-flash')
var router = express.Router();

var app = express();

// app.configure(function(){
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.set('trust proxy', 1) // trust first proxy
  // app.use(express.bodyParser());
  app.use(require('body-parser').urlencoded({extended: true}))
  // app.use(express.methodOverride());
  app.use(methodOverride())
  // app.use(express.cookieParser()); // cookie解析中间件
  app.use(cookieParser())
  // 提供会话支持，设置它的store参数为MongoStore实例，把会话信息存储到数据库中去，以避免数据丢失
  app.use(session({
    secret : settings.cookieSecret,
    cookie : {
      maxAge : 60000 * 20	//20 minutes
    },
    store : new MongoStore({
      db : settings.db,
      url : 'mongodb://localhost/microblog'
    }),
    resave : false,
    saveUninitialized : false,
  }))

  app.use(flash());

  // app.use(app.router)
  app.use(router)
  app.use(express.static(__dirname + '/public'))
// })


// 启用layout
app.use(partials());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
