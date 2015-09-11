/* Server requires */

var express = require('express'),
    path = require('path'),
    logfmt = require('logfmt'),
    lessMiddleware = require('less-middleware'),
    uglifyMiddleware = require('express-uglify-middleware');


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

server.listen(port, ipaddress, function() {
    console.log("Listening on " + port);
});