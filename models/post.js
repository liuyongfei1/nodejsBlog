var mongodb = require('./db')
var marked = require('marked')
function Post (username,title,post,time) {
  this.user = username
  this.title = title
  this.post = post
  this.pv = 0
  if (time) {
    this.time = time
  } else {
    this.time = new Date()
  }
}
module.exports = Post

// 保存用户发表的信息
Post.prototype.save = function (callback) {
  // 存入Mongodb的文档
  var post = {
    user: this.user,
    post: this.post,
    title: this.title,
    pv:this.pv,
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

// 获取用户发表的信息
Post.get = function get(username,callback) {
  mongodb.open(function (err,db) {
    if (err) {
      return callback(err)
    }

    // 读取posts集合
    db.collection('posts',function (err,collection) {
      if (err) {
        mongodb.close()
        return callback(err)
      }

      // 查找user属性为username的文档，如果username是Null，则匹配全部
      var query = {}
      if (username) {
        query.user = username
      }

      collection.find(query, {limit:9}).sort({time: -1}).toArray(function(err, docs) {
        mongodb.close();

        if (err) {
            callback(err, null)
        }

        var posts = []

        // 循环显示属于该用户的所有信息
        docs.forEach(function(doc, index) {
            var post = new Post(doc.user, doc.post, doc.time);
            posts.push(post);
        })
        callback(null, posts);
    })
	 })
  })
}
