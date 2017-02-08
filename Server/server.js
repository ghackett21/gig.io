var express = require("express");
var mysql   = require("mysql");
var path    = require("path");
var bodyParser = require('body-parser');

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
app.use(bodyParser.json());

console.log("Server Started");

/* test */
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/test.html'));
})

app.post('/Login', function(req, res) {
	console.log("Register");
	/* callback function to handle response */
	var callback = function(result) {
		if (result < 0 ) {
			/* an error occured */
			res.json({"response": "login failed", "Uid": " ", "State": result});
		}
		else {
			res.json({"response": "login successful", "Uid": result, "State": 0}); 
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
			if (rows.length == 1) {
				console.log("Login Successful");
				return callback(0);
			}
		}
	});
}

app.post('/Register', function(req, res) {
	console.log("Register");
	/* callback function to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occured */
			res.json({"resonse": "register failed", "Uid": " ", "State": result});
		}
		else {
			res.json({"response": "register successful", "Uid": result, "State": 0});
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

function Register(username, password, callback) {
	console.log("Register: ", username, password);

	var insert = "INSERT INTO Users (Username, Password, NumberOfStrikes, TotalNumberOfRatings) VALUES ('" + username + "', '" + password + "', 0, 0)";

	connection.query(insert, function(err, rows) {
		if (err) {
			/* an error occured */
			console.log("Register Failed", err);
			return callback(-2);
		}
		else {
			console.log("Register Successful");
			return callback(0);
		}
	});
}

app.post('/Logout', function(req, res) {
	console.log("Logout");

	/* register callback to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occured */
			res.json({"resonse": "logout failed", "State": result});
		}
		else {
			res.json({"response": "logout successful", "State": 0});
		}
	}

	/* check for missing args */
	if (req.body.Uid == undefined) {
		console.log("Logout: undefined args");
		calback(-1);
	}
	else {
		Logout(Uid, callback);
	}
});

function Logout(Uid, callback) {
	/* do nothing for now */
	return callback(0);
}

app.post('/UpdateProfile', function(req, res) {
	console.log("Update Profile");

	/* register callback to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occured */
			res.json({'response': 'update failed', 'State': result});
		}
		else {
			res.json({'response' : 'update successful', 'State': 0});
		}
	}

	/* check for missing args */
	if (req.body.Username == undefined || req.body.password == undefined || req.body.Email == undefined || req.body.Description == undefined || req.body.ProfileImage == undefined || req.body.locaiton == undefined || req.body.PhoneNumber == undefined) {
		console.log("Update Profile: undefined args");
		callback(-1);
	}
	else {
		//UpdateProfile(req.body.username, req.body);
	}
});

/* start express server */
var server = app.listen(8081, function() {
	var host = server.address().address;
	var post = server.address().port;
})
