var Post = require('../models/post.js')

module.exports = function (app) {
  app.get('/',function (req, res) {
    Post.get(null,function (err,posts) {
      if (err) {
        posts = []
      }
      res.render('index',
      {
        title: '首页',
        posts : posts,
  			// user : req.session.user,
  			// success : req.flash('success').toString(),
  			// error : req.flash('error').toString()
      })
    })
  })
  app.use('/reg',require('./reg'))
  app.use('/login',require('./login'))
  app.use('/logout',require('./logout'))
  app.use('/posts',require('./posts'))
}
