var express = require('express');
var app = express();
var http = require('http');
// var MongoClient = require('mongodb').MongoCLient;
var url = 'mongodb://root:toor@ds157320.mlab.com:57320/cmpt218'; 

var port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

var options = {
	dotfile: 'ignore',
	etag:false,
	extensions: ['htm','html'],
	index: 'html/login.html'
}

app.use('/',express.static('./public',options));

//test comment to see if that pushed to bitbucket





http.createServer(app).listen(port);
console.log('running on port', port);
