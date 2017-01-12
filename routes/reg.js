var fs = require('fs');
var express = require('express')
var router = express.Router()
var crypto = require('crypto')
var User = require('../models/user.js')
var checkNotLogin = require('../middlewares/check').checkNotLogin
var formidable = require('express-formidable')
var path = require('path')
var app = express()
// 用户注册
router.get('/',checkNotLogin,function (req, res, next) {
    res.render('reg', {
      title: '用户注册'
    });
})

// 处理表单及文件上传的中间件
router.use(formidable({
  uploadDir: path.join(global.rootPath, 'public/upload/img'),// 上传文件目录
  keepExtensions: true// 保留后缀
}))

router.post('/',checkNotLogin,function(req, res, next) {

  var name = req.fields.username
  var password = req.fields.password
  var repassword = req.fields.repassword
  var gender = req.fields.gender
  var intro = req.fields.intro
  var avatar = req.files
  var avatar = req.files.avatar.path.split(path.sep).pop()

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字限制在 1-10 个字符之间')
    }
    if (['m','f','x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m,f,x')
    }

    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }

    if (password != repassword) {
      throw new Error('两次输入密码不一致')
    }

    if (!req.files.avatar) {
      throw new Error('缺少头像')
    }

    if (!(name.length >= 1 && name.length <= 30)) {
      throw new Error('个人简介限制在 1-30 个字符之间')
    }
  } catch (e) {
    // 注册失败，删除异步上传的头像
    fs.unlink(req.files.avatar.path)
    req.flash('error',e.message)
    return res.redirect('/reg');
  }

  // //生成md5的密码
  var md5 = crypto.createHash('md5')
  password = md5.update(password).digest('base64')

  //用户信息写入数据库
  var info = {
    name : name,
    password : password,
    gender : gender,
    intro : intro,
    avatar : avatar
  }

  // 将写入数据库的用户信息
  var newUser = new User(info)

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
