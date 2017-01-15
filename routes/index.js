module.exports = function (app) {
  app.get('/',function (req, res) {
    res.redirect('/posts')
    // Post.get(null,function (err,posts) {
    //   if (err) {
    //     posts = []
    //   }
    //   res.render('index',
    //   {
    //     title: '首页',
    //     posts : posts
    //   })
    // })
  })
  app.use('/reg',require('./reg'))
  app.use('/login',require('./login'))
  app.use('/logout',require('./logout'))
  app.use('/posts',require('./posts'))
}
