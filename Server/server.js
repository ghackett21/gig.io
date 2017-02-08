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

/**
 * Attempts to log in with the provided username and password.
 * Returns the userId if successful
 */
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


/**
 * Search the database for a User with the given username and password,
 * if exactly one user matches, return success.
 */ 
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


/**
 * Register a new user with the provided username and password.
 * Returns userID if successful.
 */
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

/**
 * Creates a new user with the given username and password
 * Checks that no user with the same username exists
 */
function Register(username, password, callback) {
	console.log("Register: ", username, password);

	/* NEED TO CHECK FOR DUPLICATE USERNAMES */

	var insert = "INSERT INTO Users (Username, Password, NumberOfStrikes, TotalNumberOfRatings) VALUES ('" + username + "', '" + password + "', 0, 0)";

	connection.query(insert, function(err, rows) {
		if (err) {
			/* an error occured */
			console.log("Register Failed", err);
			return callback(-2);
		}
		else {
			console.log("Register Successful");
			return callback(rows[0].Uid);
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


/**
 * Creates a new post given the userId of the creator, the location, and the description/title
 */
app.post('/CreatePost', function(req, res) {
	console.log("Create Post");

	/* register callback to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occured */
			res.json({'response': 'createPost failed', 'PostId': " ", 'State': result});
		}
		else {
			res.json({'response' : 'createPost successful', 'PostId': result, 'State': 0});
		}
	}

	/* check for missing args */
	if (req.body.Uid == undefined || req.body.location == undefined || req.body.description) {
		console.log("CreatePost: undefined args");
		callback(-1);
	}
	else {
		CreatePost(req.body.Uid, req.body.location, req.body.description, callback);
	}
});

/**
 * inserts new post into the database - does not check for duplicates
 */
function CreatePost(userId, location, description, callback) {
	console.log("CreatePost: ", userId, location, description);

	var creationTime = "1/01/2000, 00:00:00"
	var insert = "INSERT INTO POSTINGS (Uid, Location, CreationTime, Status, Description) VALUES ('" + userId + "', '" + location + "', '" + creationTime + "', 1, '" + desciption + "')";  

	connection.query(insert, function (err, rows) {
		if (err) {
			/* database error occured */
			console.log("CreatePost: database error: ", err);
			return callback(-2);
		}
		else {
			/* return the new postId */
			return callback(rows[0].Pid);
		}
	});
}



/* start express server */
var server = app.listen(8081, function() {
	var host = server.address().address;
	var post = server.address().port;
})
