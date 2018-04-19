/* Initialize Symple module and setup Symple server */
var symple_module = require('symple');
var symple_server = new symple_module();

/* Load configuration using symple.json file. */
symple_server.loadConfig(__dirname + '/symple.json');
symple_server.init();
console.log('Symple server listening on port ' + symple_server.config.port);

/* Setup modules */
var express = require('express'),
  path = require('path'),
  app = express();

  //redis = require('redis'),
  //redis_client = redis.createClient(),

var serverPort = parseInt(symple_server.config.port);
var clientPort = serverPort - 1;

/* Listen to the https server with client port.
 * PORT 4550 by default will be used */
app.set('port', clientPort);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/');

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/node_modules/symple-client/src'));
app.use(express.static(__dirname + '/node_modules/symple-client-player/src'));

app.get('/', function (req, res) {
  // Create a random token to identify this client
  var token = '' + Math.random();

  // Create the arbitrary user session object here
  var session = {
    group: 'public'
  }

  /* Store the user session on Redis
  *  This will be sent to the Symple server to authenticate the session
  *  This authentication is not used for this project */
  // redis_client.set('symple:session:' + token, JSON.stringify(session), redis.print);

  /* Render the response with Symple server port
   * PORT 4551 by default will be used */
  res.render('index', {
    port: serverPort,
    token: token,
    peer: session });
});

/* To handle keys, fs module is used */
var fs = require('fs'),
https = require ('https');

/* Keys should be set up for HTTPS connection.
 * If you want to run this program, you should locate proper keys and change following codes */

https.createServer({
  key: fs.readFileSync('../../ssl/privkey.pem'),
  cert: fs.readFileSync('../../ssl/fullchain.pem')
}, app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
