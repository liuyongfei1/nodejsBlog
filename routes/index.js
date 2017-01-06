var express = require('express');
var crypto = require('crypto')
var User = require('../models/user.js')
var Post = require('../models/post.js')
var router = express.Router()
var url = require('url')

// 不需要登录,当访问index,login或reg等操作时，调用
var checkNotNeedLogin = function (req,res,next) {
  if (req.session.user) {
    req.flash('error','已登入')
    return res.redirect('/')
  }
  next()
}

// 检查是否登录,当访问需要登录后才能进行的操作时比如查看留言时，调用
var checkNeedLogin = function (req,res,next) {
  if (!req.session.user) {
    req.flash('error','未登陆')
    return res.redirect('/login')
  }
  next()
}

// 写公共的路由中间件
// router.use(function (req, res, next) {
//   console.log(req.originalUrl); // '/admin/new'
//   console.log(req.baseUrl); // '/admin'
//   console.log(req.path); // '/new'
//   next()
// }, function (req, res, next) {
//   console.log('Request Type:', req.method)
//   next()
// })

/* GET home page. */
// router.get('/',checkNotNeedLogin) //加上后会redirect死循环
router.get('/',function (req, res) {
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
// exports.index = function (req, res) {
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
// }

// 用户注册
router.get('/reg',checkNotNeedLogin)
router.get('/reg',function (req, res,next) {
    res.render('reg', {
      title: '用户注册',
      user : req.session.user,
      success : req.flash('success').toString(),
      error : req.flash('error').toString()
    });
})
// exports.reg = function (req, res) {
//     res.render('reg', {
//       title: '用户注册',
//       user : req.session.user,
//       success : req.flash('success').toString(),
//       error : req.flash('error').toString()
//     });
// }
router.post('/reg',checkNotNeedLogin)
router.post('/reg',function(req, res) {
  //检查密码
    if (req.body['password-repeat'] != req.body['password']) {
  		req.flash('error', '两次输入的密码不一致')
  		return res.redirect('/reg')
    }

    //生成md5的密码
    var md5 = crypto.createHash('md5')
    var password = md5.update(req.body.password).digest('base64')

    var newUser = new User({
      name : req.body.username,
      password : password
    })

    // 检查用户名是否已经存在
    User.get(newUser.name,function (err,user) {
      if (user)
        err = 'Username already exists'
      if (err) {
        req.flash('error',err)
        return res.redirect('/reg')
      }

      // 如果不存在则新增用户
      newUser.save(function (err) {
        if (err) {
          req.flash('error',err)
          return res.redirect('/reg')
        }
        req.session.user = newUser
        req.flash('success','注册成功')
        res.redirect('/')
      })
    })

})
// exports.doReg = function(req, res) {
//   //检查密码
//     if (req.body['password-repeat'] != req.body['password']) {
//   		req.flash('error', '两次输入的密码不一致')
//   		return res.redirect('/reg')
//     }
//
//     //生成md5的密码
//     var md5 = crypto.createHash('md5')
//     var password = md5.update(req.body.password).digest('base64')
//
//     var newUser = new User({
//       name : req.body.username,
//       password : password
//     })
//
//     // 检查用户名是否已经存在
//     User.get(newUser.name,function (err,user) {
//       if (user)
//         err = 'Username already exists'
//       if (err) {
//         req.flash('error',err)
//         return res.redirect('/reg')
//       }
//
//       // 如果不存在则新增用户
//       newUser.save(function (err) {
//         if (err) {
//           req.flash('error',err)
//           return res.redirect('/reg')
//         }
//         req.session.user = newUser
//         req.flash('success','注册成功')
//         res.redirect('/')
//       })
//     })
//
// }
// 用户登录
router.get('/login',checkNotNeedLogin)
router.get('/login',function (req,res) {
  res.render('login',{
    title : '用户登录',
    user : req.session.user,
    success : req.flash('success').toString(),
    error : req.flash('error').toString()
  })
}
)
// exports.login = function (req,res) {
//   res.render('login',{
//     title : '用户登录',
//     user : req.session.user,
//     success : req.flash('success').toString(),
//     error : req.flash('error').toString()
//   })
// }
router.post('/login',checkNotNeedLogin)
router.post('/login',function (req,res) {
  // 生成散列值
  var md5 = crypto.createHash('md5')
  var password = md5.update(req.body.password).digest('base64')

  User.get(req.body.username,function (err,user) {

    if (!user) {
			req.flash('error', '用户不存在')
			return res.redirect('/login')
		}
    if (user.password != password) {
			req.flash('error', '密码错误')
      return res.redirect('/login')
		}

    req.session.user = user;
		req.flash('success', '登录成功');
		res.redirect('/');
  })
})
// exports.doLogin = function (req,res) {
//   // 生成散列值
//   var md5 = crypto.createHash('md5')
//   var password = md5.update(req.body.password).digest('base64')
//
//   User.get(req.body.username,function (err,user) {
//
//     if (!user) {
// 			req.flash('error', '用户不存在')
// 			return res.redirect('/login')
// 		}
//     if (user.password != password) {
// 			req.flash('error', '密码错误')
//       return res.redirect('/login')
// 		}
//
//     req.session.user = user;
// 		req.flash('success', '登录成功');
// 		res.redirect('/');
//   })
// }
// 用户发布微博
router.post('/publish',function (req,res) {
  var currentUser = req.session.user
  var post = new Post(currentUser.name,req.body.post)
  post.save(function (err) {
    if (err) {
      req.flash('error',err)
      return res.redirect('/')
    }
    req.flash('success','发表成功')
    res.redirect('/u/' + currentUser.name)
  })
})
// exports.publish = function (req,res) {
//   var currentUser = req.session.user
//   var post = new Post(currentUser.name,req.body.post)
//   post.save(function (err) {
//     if (err) {
//       req.flash('error',err)
//       return res.redirect('/')
//     }
//     req.flash('success','发表成功')
//     res.redirect('/u/' + currentUser.name)
//   })
// }
// 展示用户发布的微博
// 写一个判断用户是否具有查看微博的权限：必须登录
// router.get('/u/:user',function (req,res,next) {
//   if (req.session.user == null) {
//     req.flash('error','您还未登录,请登录!')
//     res.redirect('/login')
//   }
//   else next()
// })
router.get('/u/:user',checkNeedLogin)
router.get('/u/:user',function (req,res) {
  // 注意:req.params.user是从get请求的参数:user的值
  User.get(req.params.user,function (err,user) {
    if (!user) {
      req.flash('error','用户不存在')
      return res.redirect('/')
    }
    Post.get(user.name,function (err,posts) {
      if (err) {
        req.flash('error',err)
        return res.redirect('/')
      }
      // console.dir(user, {colors: true})
      res.render('user',{
        title : user.name,
        posts: posts,
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
      })
    })
  })
})
// exports.show = function (req,res) {
//   User.get(req.params.user,function (err,user) {
//     if (!user) {
//       req.flash('error','用户不存在')
//       return redirect('/')
//     }
//     Post.get(user.name,function (err,posts) {
//       if (err) {
//         req.flash('error',err)
//         return res.redirect('/')
//       }
//       // console.dir(user, {colors: true})
//       res.render('user',{
//         title : user.name,
//         posts: posts,
// 				user : req.session.user,
// 				success : req.flash('success').toString(),
// 				error : req.flash('error').toString()
//       })
//     })
//   })
// }
// 退出动作
router.get('/logout',checkNeedLogin)
router.get('/logout',function(req,res) {
  req.session.user = null;
  req.flash('success','退出成功')
  res.redirect('/')
})
// exports.logout =  function(req,res) {
//   req.session.user = null;
//   req.flash('success','退出成功')
//   res.redirect('/')
// }

module.exports = router
