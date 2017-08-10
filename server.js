  var express = require('express'); 
  //express is framework on top of nodeJS

  var app = express();  
  // initilize express
  var routers = require('./routes/router');
  
  var session = require('express-session');
  
  //var User = require('./models/user');

  app.use(express.static(__dirname+'/public'));
  //to give the website the ability to visit public folders

  
  var MongoStore = require('connect-mongo')(session);


  var mongoose = require('mongoose');
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var bodyParser = require('body-parser');

  //connect to MongoDB
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://dina:123456@ds151060.mlab.com:51060/wesal');
  var db = mongoose.connection;
  
  //handle mongo error
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log("we're connected!");
  });

  app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }));
  var User = require('./models/user');

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
    app.use(passport.initialize());


  var handlebars = require('express-handlebars').create();
  app.engine('handlebars',handlebars.engine);
  app.set('view engine','handlebars');
  //Templateing setup

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use('/', routers);
  app.use('/policy', routers);
  app.use('/reg',routers);
  app.use('/login',routers);
  app.use('/control',routers)

  //Port Setup
  app.listen(process.env.PORT || 3000);

  console.log('The magic happens on port 3000');

  // 'process.env.PORT' for heroku deployment purposes 
