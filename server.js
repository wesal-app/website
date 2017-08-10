  var express = require('express'); 
  //express is framework on top of nodeJS

  var app = express();  
  // initilize express

  var bodyParser = require('body-parser');
  // to get the data from the index
  
  var session = require('express-session');

  app.use(express.static(__dirname+'/public'));
  //to give the website the ability to visit public folders

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
  
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  //app.use(express.session({ secret: 'SECRET' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({secret: 'keyboard cat'}));
  var CryptoJS = require("crypto-js");

  var mongo = require('mongodb').MongoClient;
  var url = 'mongodb://dina:123456@ds151060.mlab.com:51060/wesal';
  
  var session = require('express-session');
  // express session package 

  app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }
  ));
  // session initilazion 

  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: true }));  
  //body parser init.

  var handlebars = require('express-handlebars').create();
  app.engine('handlebars',handlebars.engine);
  app.set('view engine','handlebars');
  //Templateing setup
  
  
  app.get('/',(req,res)=>{ 
    res.render('layouts/main');
  });

  app.get('/policy',(req,res)=>{ 
    res.sendFile('views/policy.html', {root: __dirname })
  });

  app.post('/login',(req,res)=>{
  var user = { user:req.body.user,
               pass:req.body.pass  }
  mongo.connect(url,(err,db)=>{
	  if (err){console.log(err)};
	//	db.collection('wesal').insertOne(obj,(err,result)=>{
			if(err){return console.log(err);}
			console.log(JSON.stringify(obj) + 'is inserted');
			db.close();
		});
  });
  
  app.post('/reg',(req,res)=>{
  var hash = CryptoJS.SHA3(req.body.pass);
  
  var user = { firstName:req.body.firstName,
               secondName:req.body.secondName,
               email:req.body.regEmail,
               pass: JSON.stringify(hash)
             }
  console.log(user.pass);
  
  let mailOptions = {
    from: '"Wesal 👻"', 
    to: req.body.regEmail, 
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
    
    mongo.connect(url,(err,db)=>{
      console.log('connected')
	  if (err){console.log(err)};
      db.collection('wesal').insertOne(user,(err,result)=>{
			if(err){return console.log(err);}
			console.log(JSON.stringify(user) + 'is inserted');
			db.close();
		});
    });
    res.render('layouts/main');
  });
  
  
  // Routing
  
  app.post('/process',(req,res)=>{
    
    console.log('email',req.body.email);
	    var obj ={email: req.body.email };
    let mailOptions = {
    from: '"Wesal 👻"', 
    to: req.body.email, 
    subject: 'Hello ✔', // Subject line
    text: 'Hello.. \n' + 'Welcome to Wesal' +
          ' We are happy to join us, ' +
          'Tell us that you are facing a problem.'+
          ' We wish you a happy day. \n\n' + 'Wesal group'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    });
  mongo.connect(url,(err,db)=>{
	  if (err){console.log(err)};
		db.collection('wesal').insertOne(obj,(err,result)=>{
			if(err){return console.log(err);}
			console.log(JSON.stringify(obj) + 'is inserted');
			db.close();
		});
		
  });
  
    res.render('layouts/main', { title: 'Done'});
    
  });

  //Port Setup
  app.listen(process.env.PORT || 3000);
  console.log('The magic happens on port 3000');

  // 'process.env.PORT' for heroku deployment purposes 
