var express = require('express');
var app = express();
var http = require('http');
var MongoClient = require('mongodb').MongoCLient;

var url = 'mongodb://root:toor@ds119129.mlab.com:19129/cmpt218_epolovin'; 
var port = process.env.PORT || 8080;
var usersRegistered = {};

app.use(express.json());
app.use(express.urlencoded({extended:false}));

var options = {
	dotfile: 'ignore',
	etag:false,
	extensions: ['htm','html'],
	index: 'html/login.html'
}

// Serve public directory
app.use('/',express.static('./public',options));


/////////////////// POST REGISTRATION API ///////////////////
app.post('/registrationAPI', function(req,res,next) {
	/////// NOT WORKING - CANT CONNECT TO DB////////
	MongoClient.connect(url,function(err,db) {
		if(err) throw err;
		var database = db.db('cmpt218_epolovin');
		database.collection('registeredUsers').insertOne(usersRegistered,function (req,result){
			if(err) throw err;
			res.send("User Inserted");
		}

		);
	});
	////////////////////////////// 
});


http.createServer(app).listen(port);
console.log('running on port', port);
