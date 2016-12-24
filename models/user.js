var mongodb = require('./db')

function User(user) {
  this.name = user.name
  this.password = user.password
}

module.exports = User

// 用于将对象的数据保存到数据库中去
User.prototype.save = function save(callback) {
  var user = {
    name : this.name,
    password : this.password
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

			//find
			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();
        console.log('get53:' + username)
        console.log('get54:' + doc)
				if (doc) {
					var user = new User(doc)
					callback(err, user)
				} else {
          console.log('get59:')
					callback(err, null)
				}
			})
		})
	})
}
