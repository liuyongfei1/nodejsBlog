var express = require('express');
var crypto = require('crypto')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/reg',function (req, res, next) {
  res.render('reg',{title: '用户注册'})
})
router.post('/reg',function (req, res, next) {
  // 检查秘密是否一致
  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error','两次输入的密码不一致')
    res.redirect('/reg')
  } else {
    res.redirect('/')
  }
})
module.exports = router;
