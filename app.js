var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var https = require("https");

var key = fs.readFileSync('./ssl/my-server-key.pem');
var cert = fs.readFileSync('./ssl/my-server-crt.pem');
var ca = fs.readFileSync('./ssl/my-ca-crt.pem');

var options ={

	key: key,
	cert: cert,
	ca:ca
};


//create an express app
var app = express();

var config = require('./config');

//configure the express app to parse JSON-formatted body
app.use(bodyParser.json());

//add route for the root
app.get('/',function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("We're up and running!!!");
});

//create routing object
var contact = require('./api/students/index');

//Add routes for contacts api
app.get('/api/students',contact.index);
app.post('/api/students',contact.create);
app.put('/api/students/:id',contact.update);
app.delete('/api/students/:id',contact.delete);


// Listen on port 8000, IP defaults to 127.0.0.1
var httpsServer = https.Server(options, app)
  .listen(8000, function () {
    console.log("Express server running at " + httpsServer.address().port);

  });

