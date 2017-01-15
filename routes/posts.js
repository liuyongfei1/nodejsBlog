var express = require('express')
var router = express.Router()
var checkLogin = require('../middlewares/check').checkLogin
// var User = require('../models/user.js')
// var Post = require('../models/post.js')
var PostModel = require('../models/posts')

// GET /posts/create 发表文章页
router.get('/create',checkLogin,function (req,res,next) {
  res.render('create',{
    'title' : '发表文章'
  })
})

router.post('/',checkLogin,function (req,res,next) {
  var author = req.session.user.name
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

// router.get('/',function(req,res,next) {
//   res.render('index',{
//     'title' : '用户主页'
//   })
// })
//
// // 用户发布微博
// router.get('/create',checkLogin,function (req,res,next) {
//   res.render('say',{
//     'title' : '发表微博'
//   })
// })
//
// router.post('/',checkLogin,function (req,res) {
//   var currentUser = req.session.user
//   var author = currentUser.name
//   var title = req.body.title
//   var content = req.body.content
//
//   // 校验参数
//   try {
//     if (!title.length) {
//       throw new Error('请填写标题')
//     }
//     if (!content.length) {
//       throw new Error('请填写内容')
//     }
//   } catch (e) {
//     req.flash('error',e.message)
//     return res.redirect('back')
//   }
//
//   var post = new Post(author,title,content)
//   post.save(function (err) {
//     if (err) {
//       req.flash('error',err)
//       return res.redirect('/')
//     }
//     req.flash('success','发表成功')
//     res.redirect('/posts/' + currentUser.name)
//   })
//   // .then(function (result) {
//   //   // 此 post 是插入 mongodb 后的值，包含 _id
//   //     post = result.ops[0];
//   //     req.flash('success', '发表成功');
//   //     // 发表成功后跳转到该文章页
//   //     res.redirect(`/posts/${post._id}`);
//   // })
// })
//
// // 展示用户发布的微博
// router.get('/:user',function (req,res) {
//   // 注意:req.params.user是从get请求的参数:user的值
//   User.get(req.params.user,function (err,user) {
//     if (!user) {
//       req.flash('error','用户不存在')
//       return res.redirect('/')
//     }
//     Post.get(user.name,function (err,posts) {
//       if (err) {
//         req.flash('error',err)
//         return res.redirect('/')
//       }
//
//       res.render('user',{
//         title : user.name,
//         posts: posts
//       })
//     })
//   })
// })
module.exports = router
