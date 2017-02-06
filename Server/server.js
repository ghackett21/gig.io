var express = require("express");
var mysql   = require("mysql");
var path    = require("path");

/* create database connection */
var connection = mysql.createConnection({
	host     : 3306,
	user     : 'root',
	password : 'password',
	database : 'gigio'
});

/* connect to database */
connection.connect(function(err) {
	if (err) {
		console.log("Error connecting to database!");
	}
	else {
		console.log("connection to database successful");
	}
});

/* create express server */
var app = express();

console.log("Server Started");

/* test */
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/test.html'));
})


app.get('/Login', function(req, res) {

	/* callback function to handle response */
	var callback - function(result) {
		if (result > 0 ) {
			/* an error occured */
			res.json({"resonse": "login failed", "res": "false"});
		}
		else {
			
		}
	}

	Login();
});

app.get('/Register', function(req, res) {

});

/* start express server */
var server = app.listen(8081, function() {
	var host = server.address().address;
	var post = server.address().port;
})