var express = require('express')
var router = express.Router()
var checkLogin = require('../middlewares/check').checkLogin
var PostModel = require('../models/posts')

// GET /posts/create 发表文章页
router.get('/create',checkLogin,function (req,res,next) {
  res.render('create',{
    'title' : '发表文章'
  })
})

router.post('/',checkLogin,function (req,res,next) {
  var author = req.session.user._id
  var title = req.body.title
  var content = req.body.content

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch(e) {
    req.flash('error',e.message)
    return res.redirect('back')
  }

  var post = {
    author : author,
    title : title,
    content : content,
    pv : 0
  }
  console.dir(post)
  PostModel.create(post)
    .then(function (result) {
      // 此post是插入mongodb后的值，包含_id
      post = result.ops[0]
      req.falsh('success','发表成功')
      // 发表成功后跳转到该文章页
      res.redirect(`/posts/${post._id}`)
    })
    .catch(next)
})
module.exports = router
