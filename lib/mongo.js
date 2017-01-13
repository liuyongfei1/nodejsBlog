var mongodb = require('./db')
exports.Post = function (callback) {
  // 存入Mongodb的文档
  var post = {
    user: this.user,
    post: this.post,
    time: this.time
  }

  mongodb.open(function (err,db){
    if (err) {
      return callback(err)
    }
    // 读取posts集合
    db.collection('posts',function (err,collection) {
      if (err) {
        mongodb.close()
        return callback(err)
      }
      //为user属性添加索引
      collection.ensureIndex('user')
      // 写入post文档
      collection.insert(post,{safe : true}, function (err,post) {
        mongodb.close()
        callback(err,post)
      })
    })
  })
}
