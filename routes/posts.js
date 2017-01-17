var express = require('express')
var router = express.Router()
var checkLogin = require('../middlewares/check').checkLogin
var PostModel = require('../models/posts')

router.get('/',function (req,res,next) {
  var author = req.query.author
  PostModel.getPosts(author)
    .then(function (posts) {
      res.render('posts', {
        title : '首页',
        posts: posts
      });
    })
    .catch(next)
})

// GET /posts/create 发表文章页
router.get('/create',checkLogin,function (req,res,next) {
  res.render('create',{
    'title' : '发表文章'
  })
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId',function (req,res,next) {
  var postId = req.params.postId
  Promise.all([
    PostModel.getPostById(postId),// 获取文章信息
    PostModel.incPv(postId)// pv 加 1
  ])
  .then(function (result) {
    var post = result[0];
    if (!post) {
      throw new Error('该文章不存在');
    }

    res.render('post', {
      title : '详情页',
      post: post
    });
  })
  .catch(next);
})

// POST /posts 发表一篇文章
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
  // 发表一篇微博
  PostModel.create(post)
    .then(function (result) {
      // 此post是插入mongodb后的值，包含_id
      post = result.ops[0]
      req.flash('success','发表成功')
      // 发表成功后跳转到该文章页
      res.redirect(`/posts/${post._id}`)
    })
    .catch(next)
})
module.exports = router
