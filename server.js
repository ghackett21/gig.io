var express = require("express");
var mysql   = require('mysql');
var path    = require("path");
var bodyParser = require('body-parser');

/* create database connection */
var connection = mysql.createConnection({
	host     : 'mydb.itap.purdue.edu',
	user    : 'sfellers',
	password : 'Te5UVB7vvR7SjJ6y',
	database : 'sfellers'
});

/* connect to database
connection.connect(function(err) {
	if (err) {
		console.log("Error connecting to database!", err);
	}
	else {
		console.log("connection to database successful");
	}
});
*/
/* create express server */
var app = express();
app.use(bodyParser.json());

console.log("Server Started");

app.use(express.static(path.join(__dirname, 'public')));






/** Database interaction endpoints */

/**
 * Attempts to log in with the provided username and password.
 * Returns the userId if successful
 * Accepts: username, password
 * Returns: State, UserID
 */
app.post('/LoginButton', function(req, res) {
	console.log("LoginButton called");
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
	console.log("Login:", username, password);

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
			else {
				return callback(-2);
			}
		}
	});
}


/**
 * Register a new user with the provided username and password.
 * Returns userID if successful.
 * Accepts: Username, Password
 * Returns: State, UserID
 */
app.post('/RegisterButton', function(req, res) {
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
	console.log("Register:", username, password);

	/* check for existing user with username */
	var select = "SELECT * FROM Users WHERE username LIKE '" + username + "'";

	connection.query(select, function(err, rows) {
		if (err) {
			console.log("Register Failed: ", err);
			return callback(-2);
		}
		else {
			/* if user with username already exists... */
			if (rows.length > 0) {
				return callback(-3);
			}
			else {
				/* if username is not already used */
				var insert = "INSERT INTO Users (Username, Password, NumberOfStrikes, TotalNumberOfRatings) VALUES ('" + username + "', '" + password + "', 0, 0)";

				connection.query(insert, function(err, rows) {
					if (err) {
						/* an error occured */
						console.log("Register Failed", err);
						return callback(-2);
					}
					else {
						console.log("Register Successful");
						Login(username, password, callback);
					}
				});
			}
		}
	});
}

/** 
 * Doesn't do anything currently
 * Accepts: UserID
 * Returns: State 
 */
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

/** 
 * Updates a user's profile information in the database 
 * Accepts: Username, password, Email, description, profile image, location, phone number
 * Returns: state
 */
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
	if (req.body.userId == undefined || req.body.Username == undefined || req.body.password == undefined || req.body.Email == undefined || req.body.Description == undefined || req.body.ProfileImage == undefined || req.body.location == undefined || req.body.PhoneNumber == undefined) {
		console.log("Update Profile: undefined args");
		callback(-1);
	}
	else {
		//UpdateProfile(req.body.username, req.body);
	}
});

/**
 * Updates user info in database
 */
function UpdateProfile(userID, username, password, email, description, profileImage, location, phoneNumber, callback) {
	console.log("UpdateProfile: ", userId, username, password, email, description, location, phonenNumber);

	var update = "";
}


/**
 * Creates a new post given the userId of the creator, the location, and the description/title
 * Accepts: UserId, Location, Description
 * Returns: State, PostID
 */
app.post('/CreatePost', function(req, res) {
	console.log("Create Post");

	/* register callback to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occurred */
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

/**
 * Returns post details given postID
 * Accepts: PostID
 * Returns: State, Entire post info from database  
 */
 app.post('/GetPost', function(req, res) {
 	console.log("GetPost");

 	/* register callback to handle response */
 	var callback = function(result) {
 		if (result < 0) {
 			/* an error occurred */
 			res.json({'response': 'GetPost failed', 'Post': " ", 'State': result});
 		}
 		else {
 			res.json({'response': 'GetPosts successful', 'Post': result, 'State': 0});
 		}
 	}

 	/* check for missing args */
 	if (req.body.PostId == undefined) {
 		console.log("GetPost: undefined args");
 		callback(-1);
 	}
 	else {
 		GetPost(req.body.PostId, callback);
 	}
 });

 /**
  *	Returns the post information given a postId
  */
 function GetPost(PostId, callback) {
 	console.log("GetPost: ", PostId);

 	var select = "GET * FROM POSTINGS WHERE Pid LIKE " + PostId;

 	connection.query(select, function(err, rows) {
 		if (err) {
 			/* database error */
 			console.log("GetPost: database error: ", err);
 			return callback(-2);
 		}
 		else {
 			if (rows.length == 1) {
 				return callback(rows[0]);
 			}
 			else {
 				console.log("GetPost: PostId matches multiple posts!");
 				return callback(-2);
 			}
 		}
 	});
 }



/* start express server */
var server = app.listen(8081, function() {
	var host = server.address().address;
	var post = server.address().port;
})
