var mongoose = require("mongoose");
var passport = require("passport");
var PassportLocalStrategy = require('passport-local');

var User = require('../models/user');
var path = require('path');

passport.serializeUser(function(user, done){
  done(null, user._id)
})

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user)
  })
})

var userController = {};
var nodemailer = require('nodemailer');
  // Nodemailer for sending emails for the users

var transporter = nodemailer.createTransport({ 
    // Nodemailer initiliztion
    service: 'gmail',
    auth: { //Your Email info
      user: 'teamtwocloud@gmail.com', 
      pass: 'team2123456'
    }
  });
// Restrict access to root page
userController.home = (req,res)=>{ 
    res.render('layouts/main');
}

// Post registration
userController.doRegister = function(req, res) {
 var userData = {
        firstName:req.body.firstName,
        secondName:req.body.secondName,
        regEmail:req.body.regEmail,
        password:req.body.password,
  }
 let mailOptions = {
    from: '"Wesal 👻"', 
    to: userData.regEmail, 
    subject: 'Hello ✔', // Subject line
    text: 'Hello.. \n' + 'Welcome to Wesal' + req.body.firstName +
          ' We are happy to join us, ' +
          'Tell us that you are facing a problem.'+
          ' We wish you a happy day. \n\n' + 'Wesal group'
    };  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    });
  
  User.create(userData, function(err, user) {
    if (err) {  
          console.log(err);
          console.log('dublicated');//بعد مايتعدل التمبلت أرسل الكلمة إلى المتغير في هاندلبارز
        return res.redirect('/');
    } else 
      return res.redirect('/');
    });
  
};

// Post login
userController.doLogin = function(req, res) {
  var userData = {
    mail: req.body.logEmail,
    pass: req.body.logPassword
  }
  User.authenticate1(userData.mail, userData.pass, function (error, user) {
    console.log('enterd');
     if (error || !user) {
       console.log('Wrong email or password.');
       return res.send(JSON.stringify(error));
     }else {
        req.session.userId = user._id;
        res.redirect('/control');
      };
  }
  );
}



userController.policy = function(req, res) {    
    res.sendFile(path.resolve('./views/policy.html'));
};

userController.control = function(req, res,next) {
   User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
           res.sendFile(path.resolve('./views/Control.html'));
        }
      }
    });
}



// logout
userController.logout = function(req, res,next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
};

module.exports = userController;