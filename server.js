/* Server requires */

var express = require('express'),
    path = require('path'),
    logfmt = require('logfmt'),
    uglifyMiddleware = require('express-uglify-middleware'),
    bodyParser = require('body-parser'),
    nodemailer = require('nodemailer'),
    mailGun = require('nodemailer-mailgun-transport');


/* Server configuration */

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var server = express();

server.use(logfmt.requestLogger());

server.use('/media', express.static(__dirname + '/media'));
server.use(express.static(__dirname + '/public'));

// Set up body parser
server.use( bodyParser.json() ); // to support JSON-encoded bodies
server.use( bodyParser.urlencoded({ extended: false }) ); // to support URL-encoded bodies


// Set up node mailer
var nodemailerMailgun = nodemailer.createTransport(mailGun({
  auth: {
    api_key: 'key-5e8edb35ba7aaac798d868643c1a5c46',
    domain: 'sandbox74efe893734049d7aadd3dc39bfa1b5d.mailgun.org'
  }
}));

// Handle contact form submission
server.post('/contact', function(req, res) {
  if (!req.body) return res.end('Error')

  var mailOptions = {
    from: req.body.name + ' <' + req.body.email + '>',
    to: 'gloria.siugo@gmail.com',
    subject: req.body.subject,
    html: req.body.description
  };

  nodemailerMailgun.sendMail(mailOptions, function(error, response) {
    if (error) { res.end(error.toString()); }
    else { res.end('Your message has been sent!'); }
  })
});

server.use(function(error, req, res, next) {
  res.status(error.status || 500);
  res.send('Something broke!');
});

// Handle Errors
server.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
});


server.listen(port, ipaddress, function() {
  console.log("Listening on " + port);
});
