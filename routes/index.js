var express = require('express');
var crypto = require('crypto')
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
// exports.test = function () {
//   console.log('world')
// }
exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
}
exports.reg = function (req, res) {
    res.render('reg', { title: '用户注册' });
}
exports.doReg = function(req, res) {
  //检查密码
    if (req.body['password-repeat'] != req.body['password']) {
		req.flash('error', '两次输入的密码不一致')
		return res.redirect('/reg')
    }

    //生成md5的密码
    var md5 = crypto.createHash('md5')
    var password = md5.update(req.body.password).digest('base64')
  
}

// module.exports = router
