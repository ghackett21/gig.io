var express = require("express");
var mysql   = require("mysql");
var path    = require("path");

/* create database connection */
var connection = mysql.createConnection({
	host     : 3306,
	user     : 'root',
	password : 'password',
	database : 'testdb'
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

connection.query("INSERT INTO testtable (name) VALUES ('cs407')", function (err, rows, fields) {
	if (err) {
		console.log("An error occurred!");
	} 
	else {
		console.log("The solution is: ", rows);
	}
});

connection.query("SELECT * FROM testtable", function(err, rows, fields) {
	if (err) {
		console.log("An error occured!");
	}
	else {
		console.log("Returned: ", rows);
	}
}); 

/* test */
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/test.html'));
})

/* start express server */
var server = app.listen(8081, function() {
	var host = server.address().address;
	var post = server.address().port;
})