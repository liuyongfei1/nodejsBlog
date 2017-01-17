var marked = require('marked')
var Comment = require('../lib/mongo').Comment

// 将comment 的content 从markdown转换成html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content);
      return comment;
    });
  }
});
module.exports = {
  // 创建一个留言
  create: function create(comment) {
    return Comment
    .create(comment)
    .exec();
  },

  // 通过用户 id 和留言 id 删除一个留言
  delCommentById : function delCommentById(commentId,author) {
    return Comment
      .remove({author : author,_id : commentId})
      .exec()
  },

  // 通过文章id删除该文章下的所有留言(删除一篇文章后也要删除该篇文章下的所有留言)
  delCommentByPostId : function delCommentsByPostId(postId) {
    return Comment
      .remove({ postId: postId })
      .exec();
  },

  // 通过文章id获取该文章下的所有留言,按留言时间创建时间升序
  getComments : function getComments(postId) {
    console.log(37)
    return Comment
      .find({postId : postId})
      .populate({path : 'author',model : 'User'})
      .sort({_id : 1})
      .addCreatedAt()
      .exec()
  },

  // 通过文章 id 获取该文章下留言数
  getCommentsCount: function getCommentsCount(postId) {
    return Comment.count({ postId: postId }).exec();
  }
}
