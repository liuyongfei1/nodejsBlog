var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var User = require('../lib/mongo').User;

var testName1 = 'phping4';
var testName2 = 'phping';

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
        .field({ name: ''})
        .redirects()
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text.match(/名字限制在 1-10 个字符/));
          done();
        });
    });

    // 性别错误的情况
    it('wrong gender',function(done) {
      agent
        .post('/reg')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name : testName1, gender : 'a'})
        .redirects()
        .end(function (err,res) {
          if(err) return done(err);
          assert(res.text.match(/性别只能是 m,f,x/));
          done();
        });
    });

    // 密码长度功能测试
    it('wrong password length', function(done) {
      agent
        .post('/reg')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name : testName1, gender : 'm', password : '12'})
        .redirects()
        .end(function (err,res) {
          if(err) return done(err);
          assert(res.text.match(/密码至少 6 个字符/));
          done();
        });
    });

    // 前后两次输入的密码不一致
    it('wrong password no the same', function(done) {
      agent
        .post('/reg')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({ name : testName1, gender : 'm', password : '123456', repassword : '123'})
        .redirects()
        .end(function (err,res) {
          if(err) return done(err);
          assert(res.text.match(/两次输入密码不一致/));
          done();
        });
    });

    // 用户简介
    // it('wrong intro', function(done) {
    //   agent
    //     .post('/reg')
    //     .type('form')
    //     .attach('avatar', path.join(__dirname, 'avatar.png'))
    //     .field({ name : testName1, gender : 'm', password : '12345', intro : 'a'})
    //     .redirects()
    //     .end(function (err,res) {
    //       if(err) return done(err);
    //       console.log(res.text);
    //       assert(res.text.match(/个人简介限制在 1-30 个字符之间/));
    //       done();
    //     });
    // });

  });
});
