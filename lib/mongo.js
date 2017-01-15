var Mongolass = require('mongolass')
var mongolass = new Mongolass()

// 用户模型设
exports.User = mongolass.model('User',{
  name : {type : 'string'},
  password : {type : 'string'},
  avator : {type : 'string'},
  gender : {type : 'string',enum : ['m','f','x']},
  intro : {type : 'string'}
})
exports.User.index({name : 1,{unique : true}}.exec());

// 文章模型
exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
});
exports.Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表
