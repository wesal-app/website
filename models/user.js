var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./user');

var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  firstName: {type: String},
  secondName:{type: String},
  regEmail: { type: String,unique: true,required: true},
  password: {type: String}
});

//authenticate input against database
UserSchema.statics.authenticate1 = function (email, password, callback) {
  
  this.findOne({ regEmail: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('Email not found.');
        err.status = 401;
        err.name = 'no user'
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}


//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);