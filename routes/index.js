module.exports = function (app) {
  app.get('/',function (req, res) {
    res.redirect('/posts')
  })
  app.use('/reg',require('./reg'))
  app.use('/login',require('./login'))
  app.use('/logout',require('./logout'))
  app.use('/posts',require('./posts'))
}
