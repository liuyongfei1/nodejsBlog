var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var formidable = require('express-formidable');
var app = express();

// 用户注册
router.get('/',checkNotLogin,function (req, res, next) {
    res.render('reg', {
      title: '用户注册'
    });
});

// 处理表单及文件上传的中间件
router.use(formidable({
  uploadDir: path.join(global.rootPath, 'public/upload/img'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

// 提交用户注册表单
router.post('/',checkNotLogin,function(req, res, next) {

  var name = req.fields.username;
  var password = req.fields.password;
  var repassword = req.fields.repassword;
  var gender = req.fields.gender;
  var intro = req.fields.intro;
  var avatar = req.files.avatar.path.split(path.sep).pop(); // 获取上传头像的名字

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字限制在 1-10 个字符之间');
    }
    if (['m','f','x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m,f,x');
    }

    if (password.length < 6) {
      throw new Error('密码至少 6 个字符');
    }

    if (password != repassword) {
      throw new Error('两次输入密码不一致');
    }

    if (!req.files.avatar) {
      throw new Error('缺少头像');
    }

    if (!(name.length >= 1 && name.length <= 30)) {
      throw new Error('个人简介限制在 1-30 个字符之间');
    }
  } catch (e) {
    // 注册失败，删除异步上传的头像
    fs.unlink(req.files.avatar.path);
    req.flash('error',e.message);
    return res.redirect('/reg');
  }

  // //生成md5的密码
  var md5 = crypto.createHash('md5');
  password = md5.update(password).digest('base64');

  //用户信息写入数据库
  var user = {
    name : name,
    password : password,
    gender : gender,
    avatar : avatar,
    intro : intro
  };

 // 将用户信息写入数据库
  UserModel
    .create(user)
    .then(function (result) {
      // 此user是插入mongo后的值，包含_id
      user = result.ops[0];
      // 将用户信息存入session
      delete user.password;
      req.session.user = user;
      // 写入flash
      req.flash('success','注册成功');
      // 跳转到首页
      res.redirect('/posts');
    }).
    catch(function (e) {
      // 注册失败，异步删除上传的头像
      fs.unlink(req.files.avatar.path);
      // 用户名如果被占用则调回注册页，而不是错误页
      if (e.message.match('E11000 duplicate key')) {
        req.flash('error','用户名已经被占用');
        res.redirect('/reg');
      }
      next(e);
    });

});
module.exports = router;
