var express = require('express')
var router = express.Router()
var crypto = require('crypto')
var User = require('../models/user.js')
var checkNotLogin = require('../middlewares/check').checkNotLogin

// 用户注册
router.get('/',checkNotLogin,function (req, res) {
    res.render('reg', {
      title: '用户注册',
      user : req.session.user,
      success : req.flash('success').toString(),
      error : req.flash('error').toString()
    });
})

router.post('/',checkNotLogin,function(req, res) {
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
module.exports = router
