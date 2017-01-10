// var crypto = require('crypto')
// var User = require('../models/user.js')
var Post = require('../models/post.js')

// // 写公共的路由中间件
// // 判断访问该路由的权限
// var filterRoute = function (req,res,next) {
//   // 如果已经登录过，则不能再访问登录页或注册页
//   if (req.path == '/login' || req.path == '/reg') {
//     if (req.session.user) {
//       req.flash('error','已登入')
//       return res.redirect('/')
//     }
//     next()
//   }
//   // 如果没有登录，则不能查看显示微博信息的页面
//   else if (req.path.match(/^\/u\/\w*/)) {
//     if (!req.session.user) {
//       req.flash('error','未登陆')
//       return res.redirect('/login')
//     }
//     next()
//   }
//   else next()
// }

// 或者使用这种方法
// app.use(['/abcd', '/xyza', /\/lmn|\/pqr/], function (req, res, next) {
// next();
// })

// 使用中间件
// router.use(filterRoute)

/* GET home page. */
// router.get('/',checkNotNeedLogin) //加上后会redirect死循环
// router.get('/',function (req, res) {
//   Post.get(null,function (err,posts) {
//     if (err) {
//       posts = []
//     }
//     res.render('index',
//     {
//       title: '首页',
//       posts : posts,
// 			user : req.session.user,
// 			success : req.flash('success').toString(),
// 			error : req.flash('error').toString()
//     })
//   })
// })
//
// module.exports = router

module.exports = function (app) {
  app.get('/',function (req, res) {
    console.log(57)
    Post.get(null,function (err,posts) {
      if (err) {
        posts = []
      }
      res.render('index',
      {
        title: '首页',
        posts : posts,
  			user : req.session.user,
  			success : req.flash('success').toString(),
  			error : req.flash('error').toString()
      })
    })
  })
  app.use('/reg',require('./reg'))
  app.use('/login',require('./login'))
  app.use('/logout',require('./logout'))
  app.use('/publish',require('./publish'))
}
