const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

describe('Auth Controller - Login', function () {
  before(function (done) {
    mongoose
      .connect(
        'mongodb+srv://fey:A9TJDmNb4rkEGyFK@cluster0.eqgba.mongodb.net/test-messages?retryWrites=true&w=majority',
      )
      .then((result) => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5f55b3790e3f2c059bf3f986',
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it('shoud add a created post to the posts of the creator', function (done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post',
      },
      file: {
        path: 'path',
      },
      userId: '5f55b3790e3f2c059bf3f986',
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
