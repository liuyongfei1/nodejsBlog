var express = require('express')
var router = express.Router()
var checkLogin = require('../middlewares/check').checkLogin

// 退出动作
router.get('/',checkLogin,function(req,res) {
  req.session.user = null;
  req.flash('success','退出成功')
  res.redirect('/')
})

router.post('/',checkLogin,function(req,res) {
  req.session.user = null;
  req.flash('success','退出成功')
  res.redirect('/')
})
module.exports = router
