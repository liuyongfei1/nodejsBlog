var mongodb = require('./db')

function User(user) {
  this.name = user.name
  this.password = user.password
  this.gender = user.gender
  this.intro = user.intro
  this.avatar = user.avatar
}

module.exports = User

// 用于将对象的数据保存到数据库中去
User.prototype.save = function save(callback) {
  var user = {
    name : this.name,
    password : this.password,
    gender : this.gender,
    intro : this.intro,
    avatar : this.avatar
  }
  mongodb.open(function (err,db) {
    if (err) {
      return callback(err)
    }
    // 获取users集合
    db.collection('users',function (err,collection) {
      if (err) {
        mongodb.close()
        return callback(err)
      }
      // 为name属性添加索引
      collection.ensureIndex('name',{unique : true})
      //save
      collection.insert(user, {safe : true},function (err,user) {
        mongodb.close()
        callback(err,user)
      })
    })
  })
}

// 从数据库中查找指定的用户
User.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err)
		}

		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close()
				return callback(err)
			}

			//检查是否存在该用户
			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();
				if (doc) {
					var user = new User(doc)
					callback(err, user)
				} else {
					callback(err, null)
				}
			})
		})
	})
}
