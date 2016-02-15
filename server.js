/* Server requires */

var express = require('express'),
    path = require('path'),
    logfmt = require('logfmt'),
    lessMiddleware = require('less-middleware'),
    uglifyMiddleware = require('express-uglify-middleware'),
    bodyParser = require('body-parser');
    nodemailer = require('nodemailer'),
    mailGun = require('nodemailer-mailgun-transport');


/* Server configuration */

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var server = express();

server.use(logfmt.requestLogger());

server.use(lessMiddleware('/less', {
  dest: '/css',
  pathRoot: path.join(__dirname, 'public')
}));

server.use(uglifyMiddleware({
  src: __dirname + '/public/javascript',
  dest: __dirname + '/public/js',
  prefix: "/js",
  compressFilter: /\.js$/,
  compress: true,
  force: false,
  debug: false
}));

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
    to: 'hemetsu@gmail.com',
    subject: req.body.subject,
    // text: 'Wow, mailgun rocks!',
    html: req.body.description
  };

  nodemailerMailgun.sendMail(mailOptions, function(error, response) {
    if (error) { res.end(error); }
    else { res.end('Sent'); }
  })
});


server.listen(port, ipaddress, function() {
  console.log("Listening on " + port);
});
