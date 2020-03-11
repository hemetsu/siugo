/* Server requires */
require('newrelic')

var express = require('express'),
    logfmt = require('logfmt'),
    sitemap = require('sitemap'),
    fs = require('fs');

/* Server configuration */

var port = process.env.PORT || 8080;

var app = express();

// Set up logger
app.use(logfmt.requestLogger());

// Set up static files
app.use(express.static(__dirname + '/public'));

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
