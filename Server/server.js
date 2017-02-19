var express = require("express");
var mysql   = require('mysql');
var path    = require("path");
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');


/* mock users for testing */
var users = [
             { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com', apikey: 'asdasjsdgfjkjhg' },
             { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com', apikey: 'gfsdgsfgsfg' },
             { id: 3, username: 'sfellers', password: 'lol1', email: 'sfellers@example.com', apikey: 'g4fgh2gfhg' }
         ];

/* create database connection */
var connection = mysql.createConnection({
	host     : 3306,
	user     : "root",
	password : "password",
	database : "gigio"
});

/* connect to database */
connection.connect(function(err) {
	if (err) {
		console.log("Error connecting to database!", err);
	}
	else {
		console.log("connection to database successful");
	}
});


function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
	    var user = users[i];
	    if (user.username === username) {
	      return fn(null, user);
	    }
	  }
return fn(null, null);
}


passport.use(new LocalStrategy(
		  function(username, password, done) {
		    findByUsername(username, function (err, user) {
		      if (err) { return done(err); }
		      if (!user) {
		        return done(null, false, { message: 'Incorrect username.' });
		      }
		      if (user.password != password) {
		        return done(null, false, { message: 'Incorrect password.' });
		      }
		      console.log("user = " + user);
		      return done(null, user);
		    });
		  }
		));


/* create express server */
var app = express();
app.use(bodyParser.json());
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
	
console.log("Server Started");
app.use(express.static(path.join(__dirname, '/../docs')));


app.post('/login',
		  passport.authenticate('local', { failureRedirect: '/login' }),
		  function(req, res) {
		    res.sendStatus(200);
		  });

/**
 * Attempts to log in with the provided username and password.
 * Returns the userId if successful
 * Accepts: username, password
 * Returns: State, UserID
 */
app.get('/login', function(req, res, next) {
	console.log("LoginButton called");
	
	passport.authenticate('local', function(err, user, info) {
		if (err) { 
			return next(err);
		}
		if (!user) {
			console.log("failed : user : " + user);
			return res.sendStatus(401); 
		}
	})(req, res, next);

});


/** Site navigation endpoints 
app.get('/', function (req, res) {
	console.log("Default Page: index.html");
	res.sendFile(path.join(__dirname, '/../docs/index.html'));
});

app.get('/index.html', function (req, res) {
	console.log("Index Page");
	res.sendFile(path.join(__dirname, '/../docs/index.html'));
});

app.get('/register.html', function(req, res) {
	console.log("Register Page");
	res.sendFile(path.join(__dirname, '/../docs/register.html'));
});

app.get('/login.html', function(req, res) {
	console.log("Login Page");
	res.sendFile(path.join(__dirname, '/../docs/register.html'));
});

app.get('/about.html', function (req, res) {
	console.log("About Page");
	res.sendFile(path.join(__dirname, '/../docs/about.html'));

});

app.get('/postings.html', function (req, res) {
	console.log("Postings Page");
	res.sendFile(path.join(__dirname, '/../docs/postings.html'));
})
*/



/** Database interaction endpoints */

/**
 * Attempts to log in with the provided username and password.
 * Returns the userId if successful
 * Accepts: username, password
 * Returns: State, UserID
 */
app.post('/LoginButton', function(req, res) {
	console.log("Login");
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
	console.log("Register: ", username, password);

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
			res.json({'response' : 'update successful', 'State': result});
		}
	}

	/* check for missing args */
	if (req.body.userId == undefined || req.body.Username == undefined || req.body.password == undefined || req.body.Email == undefined || req.body.Description == undefined || req.body.ProfileImage == undefined || req.body.location == undefined || req.body.PhoneNumber == undefined) {
		console.log("Update Profile: undefined args");
		callback(-1);
	}
	else {
		UpdateProfile(req.body.userId, req.body.Username, req.body.password, req.body.Email, req.body.Description, req.body.ProfileImage, req.body.location, req.body.PhoneNumber, callback);
	}
});

/**
 * Updates user info in database
 */
function UpdateProfile(userID, username, password, email, description, profileImage, location, phoneNumber, callback) {
	console.log("UpdateProfile: ", userId, username, password, email, description, location, phonenNumber);

	var update = "UPDATE Users SET Username='" + username + "', Password='" + password + "', EmailAddress='" + email + "', Description='" + description + "', Location='" + location + "', PhoneNumber='" + phoneNumber + "' WHERE Uid=" + userId;

	connection.query(update, function(err, rows) {
		if (err) {
			console.log("UpdateProfile: database error:", err);

			return callback(-2);
		}
		else {
			return callback(0);
		}
	});
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
	if (req.body.Uid == undefined || req.body.location == undefined || req.body.description == undefined) {
		console.log("CreatePost: undefined args, requires Uid, location, and description");
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

	var creationTime = GetDate();
	var insert = "INSERT INTO Posting (Uid, Location, CreationTime, Status, Description) VALUES ('" + userId + "', '" + location + "', '" + creationTime + "', 1, '" + description + "')";  

	connection.query(insert, function (err, rows) {
		if (err) {
			/* database error occured */
			console.log("CreatePost: database error: ", err);
			return callback(-2);
		}
		else {
			/* return the new postId */
			console.log("rows:" + rows);
			return callback(0);
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

 	var select = "SELECT * FROM Posting WHERE Pid LIKE " + PostId;

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


/** 
 * Returns a list of all postIds currently in the database
 * should it check status?
 */
app.post("/GetAllPosts", function(req, res) {
	console.log("GetALLPosts");

  	/* callback to handle response */
  	var callback = function(result) {
  		if (result < 0) {
  			res.json({"response": "GetAllPosts failed", "result": "", "state": result });
  		}
  		else {
  			res.json({"response": "GetAllPosts successful", "result": result, "state": 0 });
  		}
  	}

  	GetAllPosts(callback);
});

function GetAllPosts(callback) {
  	var select = "SELECT * FROM Posting";

  	connection.query(select, function(err, rows) {
  		if (err) {
  			console.log("GetAllPosts: database error", err);
  			return callback(-2);
  		}
  		else {
  			console.log("rows" + rows);
  			return callback(rows);
  		}
  	});
}


/** 
 * Place a bid on a post
 * Accepts: UserId, PostId, and $ Amount
 * Returns BidID
 */
app.post("/Bid", function(req, res) {
	console.log("Bid");

	/* callback to handle response */
  	var callback = function(result) {
  		if (result < 0) {
  			res.json({"response": "Bid failed", "result": "", "state": result });
  		}
  		else {
  			res.json({"response": "Bid successful", "result": result, "state": 0 });
  		}
  	}

  	/* check for missing args */
  	if (req.body.UserId == undefined || req.body.PostId == undefined || req.body.Amount == undefined) {
  		console.log("Bid: unddfined args: requires UserId, PostId, and Amount");
  		callback(-1);
  	}
  	else {
  		Bid(req.body.UserId, req.body.PostId, req.body.Amount, callback);
  	}
});

function Bid(userId, postId, amount, callback) {
	var bidTime = GetDate();
	var insert = "INSERT INTO Bids (Uid, Pid, BidTime, Amount) VALUES (" + userId + ", " + postId + ", '" + bidTime + "', " + amount + ")";

	connection.query(insert, function(err, rows) {
		if (err) {
			console.log("Bid: database error", err);
			return callback(-2);
		}
		else {
			return callback(rows.Bidid);
		}
	});
}


/**
 * Returns all bids for a given post
 * Accepts: PostID
 * Returns: List of all bids for that post
 */
app.post("/GetBids", function(req, res) {
	console.log("GetBids");

	/* callback to handle response */
  	var callback = function(result) {
  		if (result < 0) {
  			res.json({"response": "GetBids failed", "result": "", "state": result });
  		}
  		else {
  			res.json({"response": "GetBids successful", "result": result, "state": 0 });
  		}
  	}

  	if (req.body.PostId == undefined) {
  		console.log("GetBids undfined args: requires PostId");
  		callback(-1);
  	}
  	else {
  		GetBids(req.body.PostId, callback);
  	}
});

function GetBids(postId, callback) {
	console.log("GetBids: " + postId);

	var select = "SELECT * FROM Bids WHERE Pid Like '" + postId + "'";

	connection.query(select, function(err, rows) {
		if (err) {
			console.log("GetBids: database error", err);
			return callback(-2);
		}
		else {
			return callback(rows);
		}
	}); 
}

/**
 * Get the current date and time in SQL accepted datetime format
 */
function GetDate() {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	return date+' '+time;
}

/* start express server */
var server = app.listen(8081, function() {
	var host = server.address().address;
	var post = server.address().port;
})
