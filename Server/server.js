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
	var callback = function(result) {
		if (result < 0 ) {
			/* an error occured */
			res.json({"resonse": "login failed", "Uid": -1});
		}
		else {
			res.json({"response": "login successful", "Uid": result});
		}
	}

	/* check for missing args */
	if (req.body.username == undefined || req.body.password == undefined) {
		console.log("Login: undefined args");
		callback(-1);
	}
	else {
		Login(req.body.username, req.body.password, callback);
	}

});

app.get('/Register', function(req, res) {
	/* callback function to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occured */
			res.json({"resonse": "register failed", "Uid": -1});
		}
		else {
			res.json({"response": "register successful", "Uid": result});
		}
	}

	/* check for missing args */
	if (req.body.username == undefined || req.body.password == undefined) {
		console.log("Register: undefined args");
		callback(-1);
	}
	else {
		Register(req.body.username, req.body.password, callback);
	}
});

/* start express server */
var server = app.listen(8081, function() {
	var host = server.address().address;
	var post = server.address().port;
})

function Login(username, password, callback) {
	console.log("Login: ", username, password);

	var select = "SELECT * FROM Users WHERE Username LIKE '" + username + "' AND Password LIKE '" + password + "'";
	connection.query(select, function(err, rows) {
		if (err) {
			/* an error occured */
			console.log("Login Failed");
			return callback(-2);
		}
		else {
			if (rows.length() == 1) {
				console.log("Login Successful");
				return callback(0);
			}
		}
	});
}

function Register(username, password, callback) {
	console.log("Register: ", username, password);

	var insert = "INSERT INTO Users (Username, Password) VALUES ('" + username + "', '" + password + "')";

	connection.query(insert, function(err, rows) {
		if (err) {
			/* an error occured */
			console.log("Register Failed");
			return callback(-2);
		}
		else {
			console.log("Register Successful");
			return callback(0);
		}
	});
}