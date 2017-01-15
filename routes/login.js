var express = require('express')
var router = express.Router()
var crypto = require('crypto')
var checkNotLogin = require('../middlewares/check').checkNotLogin
var User = require('../models/users.js')

// GET /login
router.get('/',checkNotLogin,function (req,res,next) {
  res.render('login',{
    title : '用户登录'
  })
})

// POST /login
router.post('/',checkNotLogin,function (req,res,next) {

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
module.exports = router
