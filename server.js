  var express = require('express'); 
  //express is framework on top of nodeJS
  var app = express();  
  // initilize express

  var session = require('express-session');
  var bodyParser = require('body-parser');

  app.use(express.static(__dirname+'/public'));//to give the website the ability to visit public foldse

  var nodemailer = require('nodemailer'); // Nodemailer for sending emails for the users

  var transporter = nodemailer.createTransport({ 
    // Nodemailer initiliztion
    service: 'gmail',
    auth: { //Your Email info
      user: 'teamtwocloud@gmail.com', 
      pass: 'team2123456'
    }
  });

  app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));

  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: true }));  

  //Templateing setup
  var handlebars = require('express-handlebars').create();
  app.engine('handlebars',handlebars.engine);
  app.set('view engine','handlebars');

  // Routing
  app.get('/',(req,res)=>{ 
    res.render('layouts/main');
  });

  app.post('/process',(req,res)=>{
    
    console.log('email',req.body.email);
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
    
    res.render('layouts/main', { title: 'Done'});
    
  });

  //Port Setup
  app.listen(process.env.PORT || 3000);
  // 'process.env.PORT' for heroku deployment purposes 
