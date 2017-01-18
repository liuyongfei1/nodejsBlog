var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var User = require('../models/users.js');

// GET /login
router.get('/',checkNotLogin,function (req,res,next) {
  res.render('login',{
    title : '用户登录'
  });
});

// POST /login
router.post('/',checkNotLogin,function (req,res,next) {
  var name = req.body.name;
  // 生成散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  UserModel
    .getUserByName(name)
    .then(function (user) {
      if (!user) {
        req.flash('error','用户不存在');
        return res.redirect('back');
      }
      // 检查密码是否匹配
      if (user.password != password) {
        req.flash('error','用户名或密码错误');
        return res.redirect('back');
      }
      req.flash('success','登录成功');
      delete user.password;
      req.session.user = user;
      // 跳转到主页
      res.redirect('back');
  })
  .catch(next);
});
module.exports = router;
