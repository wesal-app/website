var express = require('express');
var app = express();
var router = express.Router();
var auth = require("../controllers/AuthController.js");
var bodyParser = require('body-parser');
  

  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: true }));  
  //body parser init.
  
  router.get('/',auth.home);

  router.get('/control',auth.control);

  router.get('/policy',auth.policy);

  router.post('/login',auth.doLogin);
  
  router.post('/reg',auth.doRegister);
    
  router.get('/logout', auth.logout);


/*
// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);
*/


module.exports = router;

