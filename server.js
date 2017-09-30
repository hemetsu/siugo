/* Server requires */

var express = require('express'),
    path = require('path'),
    logfmt = require('logfmt'),
    uglifyMiddleware = require('express-uglify-middleware'),
    bodyParser = require('body-parser'),
    nodemailer = require('nodemailer'),
    mailGun = require('nodemailer-mailgun-transport'),
    sitemap = require('sitemap'),
    fs = require('fs'),
    newRelic = require('newrelic');


/* Server configuration */

var ipaddress = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

var app = express();

// Set up logger
app.use(logfmt.requestLogger());

// Set up static files
app.use('/media', express.static(__dirname + '/media'));
app.use(express.static(__dirname + '/public'));

// Set up body parser
app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: false }) ); // to support URL-encoded bodies


// Set up node mailer
var nodemailerMailgun = nodemailer.createTransport(mailGun({
  auth: {
    api_key: 'key-5e8edb35ba7aaac798d868643c1a5c46',
    domain: 'mg.siugo.co'
  }
}));

// Handle contact form submission
app.post('/contact', function(req, res) {
  if (!req.body) return res.end('Error')

  var mailOptions = {
    from: req.body.name + ' <' + req.body.email + '>',
    to: 'gloria.siugo@gmail.com',
    subject: req.body.subject,
    html: req.body.description
  };

  nodemailerMailgun.sendMail(mailOptions, function(error, response) {
    if (error) { res.end(error.toString()); }
    else { res.end('success'); }
  })
});

// Generate sitemap
var sitemap = require('sitemap'),
    sm = sitemap.createSitemap({
      hostname : 'http://www.siugo.co',
      cacheTime : 1000 * 60 * 24,  //keep the sitemap cached for 24 hours,
      urls: [
        { url: '/', changefreq: 'monthly', priority: 0.8, lastmodrealtime: true, lastmodfile: __dirname + '/public/index.html' }
      ]
    });
fs.writeFileSync(__dirname + '/public/sitemap.xml', sm.toString());

// Handle Errors
app.use(function(error, req, res, next) {
  res.status(error.status || 500);
  res.send('Something broke!');
});
app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

app.listen(port, function() {
  console.log("Listening on " + port);
});
