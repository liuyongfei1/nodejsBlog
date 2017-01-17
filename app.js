var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

var settings = require('./setting')
var session = require('express-session') // session中间件
var MongoStore = require('connect-mongo')(session) // 将 session 存储于 mongodb，结合 express-session 使用
var methodOverride = require('method-override');
var flash = require('connect-flash') // 页面通知提示的中间件，基于 session 实现
var config = require('config-lite')
// var formidable = require('express-formidable')

var winston = require('winston');
var expressWinston = require('express-winston');

var routes = require('./routes')
var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');
// express.static是内置的中间件
// express.static(root,[options]) 这个函数是基于伪静态,并负责提供静态资产如HTML文件,图片,等等。
// root参数指定静态文件的根目录
app.use(express.static(path.join(__dirname, 'public')))


app.set('trust proxy', 1) // trust first proxy
app.use(require('body-parser').urlencoded({extended: true}))
// app.use(methodOverride())
// app.use(cookieParser())

// 启用layout
app.use(partials())

// session中间件
// 提供会话支持，设置它的store参数为MongoStore实例，把会话信息存储到数据库中去，以避免数据丢失
app.use(session({
  name : config.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret : config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie : {
    maxAge : config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store : new MongoStore({ // 将session存储到mogodb
    url :config.mongodb // mongodb地址
  }),
  resave : false,
  saveUninitialized : false,
}))

// flash中间件，用来显示通知信息
app.use(flash())

// 处理表单及文件上传的中间件
// app.use(formidable({
//   uploadDir: path.join(__dirname, 'public/upload/img'),// 上传文件目录
//   keepExtensions: true// 保留后缀
// }))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());

// 设置模板全局常量,用来挂载常量信息，比如：博客名，描述，作者信息等
// app.locals.blog = {
  // title: pkg.name,
  // description: pkg.description
  // rootPath : __dirname
// };
global.rootPath = __dirname
// 添加模板必需的三个变量
app.use(function (req, res, next) {
  console.log("app.usr local");
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// route start......
// app.use(indexRouter) // 意味着对/路径下的所有URL请求都会进行判断
// app.use(userRouter)
// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
// 路由
routes(app);
// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

// 存放flash,赋给全局变量 注:必须放在route后面，否则比如在login的时候，如果用户名或密码错误，则看不到提示
// app.use(function(req, res, next){
//   console.log("To deal with global session");
//   var error = req.flash('error');
//   res.locals.error = error.length ? error : null;
//   var success = req.flash('success');
//   res.locals.success = success.length ? success : null;
//   next();
// });
// route end......

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err); // 如果使用了 next(error)，则会返回错误而不会传递到下一个中间件;
  // next('router') // 如果调用next('router')，则会跳过当前路由的其它中间件，直接将控制权交给下一个路由
})

// error handler
// 处理所有error请求,并加载error页面，显示错误信息
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.render('error', {
    title : 'Not Found',
    error : err
  })
});

module.exports = app;
