var express = require('express')
var router = express.Router()
var checkNotLogin = require('../middlewares/check').checkNotLogin

// 退出动作
router.get('/',checkNotLogin,function(req,res) {
  req.session.user = null;
  req.flash('success','退出成功')
  res.redirect('/')
})

router.post('/',checkNotLogin,function(req,res) {
  req.session.user = null;
  req.flash('success','退出成功')
  res.redirect('/')
})
module.exports = router
