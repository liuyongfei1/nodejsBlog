var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var User = require('../lib/mongo').User;

var testName1 = 'testName1';
var testName2 = 'nswbmw';

describe('reg',function () {
  describe('POST /reg',function () {
    var agent = request.agent(app);//persist cookie when redirect
    beforeEach(function (done) {

      // 创建一个用户
      User.create({
        name: testName1,
        password: '123456',
        gender: 'x',
        avatar: '',
        intro: ''
      })
      .exec()
      .then(function () {
        done();
      })
      .catch(done);
    });

    afterEach(function (done) {
      // 删除测试用户
      User.remove({ name: { $in: [testName1, testName2] } })
        .exec()
        .then(function () {
          done();
        })
        .catch(done);
    });

    // 用户名错误的情况
    it('wrong name', function(done) {
      agent
        .post('/reg')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ username: ''})
        .redirects()
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text.match(/名字限制在 1-10 个字符/));
          done();
        });
    });

  });
});
