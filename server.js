var express = require('express');
var app = express();
var http = require('http');
var MongoClient = require('mongodb').MongoClient;

//Ery's database
var url = 'mongodb://root:toor@ds119129.mlab.com:19129/cmpt218_epolovin';
//Miguel's Database
// var url = 'mongodb://root:root@ds117469.mlab.com:17469/cmpt218';
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
    //Miguel's Database
    // var databaseString = "cmpt218";
    // var collectionString = "test";

    //Ery's Database
   var databaseString = "cmpt218_epolovin";
   var collectionString = "registeredUsers";


    console.log(req.body);
    console.log("attempting to connect to database");
	MongoClient.connect(url, function(err, client) {
        if (err) {
            console.log("error connecting to database");
            throw err;
        }
        console.log("connected to database");
        var database = client.db(databaseString);
        var collection = database.collection(collectionString);

        var documentToDatabase = {
            username : req.body.username,
            password : req.body.password,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            age : req.body.age,
            gender : req.body.gender,
            email : req.body.email
        };

        collection.insert(documentToDatabase, function() {
            console.log("the document was inserted to the database hopefully");
        });
    });
});


http.createServer(app).listen(port);
console.log('running on port', port);
