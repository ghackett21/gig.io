var express = require("express");
var mysql   = require('mysql');
var path    = require("path");
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
var bcrypt = require('bcrypt');

/* create database connection */
var connection = mysql.createConnection({
	host     : 	"mydb.itap.purdue.edu",
	user     : 	"sfellers",
	password : 	"Te5UVB7vvR7SjJ6y",
	database : 	"sfellers"
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


passport.serializeUser(function(user, done) {
  console.log("serializing user : " + user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
      console.log('no im not serial');
      done(null, user);
   
});


function findByUsername(username, fn) {
	var select = "SELECT * FROM Users WHERE Username LIKE '" + username + "'";
	connection.query(select, function(err, rows) {
		if (err) {
			/* an error occured */
			console.log("Failed to find username");
			return fn(null, null);
		}
		else {
			if (rows.length == 1) {
				console.log("findbyuser sending rows[0]: %j", rows[0]);
				return fn(null, rows[0]);
			}
			else {
				console.log("why am i here");
				return fn(null, null);
			}
		}
	});

};


function findById(id, fn) {
	var select = "SELECT * FROM Users WHERE Uid LIKE '" + id + "'";
	connection.query(select, function(err, rows) {
		if (err) {
			/* an error occured */
			console.log("Failed to find username");
			return fn(null, null);
		}
		else {
			if (rows.length == 1) {
				console.log("findbyuser sending rows[0]: %j", rows[0]);
				return fn(null, rows[0]);
			}
			else {
				console.log("why am i here");
				return fn(null, null);
			}
		}
	});

};




/* create express server */
var app = express();
app.use(bodyParser.json());
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
	
console.log("Server Started");


app.get('/', ensureAuthenticated, function(req, res) {
	console.log("jere1");
    res.redirect('/index.html');
});

app.use(express.static(path.join(__dirname, '/../docs')));




passport.use(new LocalStrategy(
	function(username, password, done) {
		findByUsername(username, function (err, user) {
			if(err) { return done(err); }
		    if(user == null) {
				console.log("Incorrect Username");
		        return done(null, false, { message: 'Incorrect username.' });
		    }
		console.log("password = %s, hash = %s, result = %b\n", password,  user.Password, bcrypt.compareSync(password, user.Password));
		    if(!bcrypt.compareSync(password, user.Password)){
				console.log("Incorrect Password");
		        return done(null, false, { message: 'Incorrect password.' });
		   	}
			console.log("found user = " + user.Username);
		    return done(null, user);
		});
	}
));

app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), function(req, res) {

	console.log("sending post login req = %j", req.user);
	//res.json({"status": 200, "redirect" : "/index.html"});
	req.logIn(req.user, function(err) {
			
			if (err) {
				   return res.status(500).json({
				       err: 'Could not log in user'
				   });
			}
			console.log("is auth? + "  + req.isAuthenticated()); 
			req.session.save(() => {
				res.json({"status": 200, "redirect" : "/index.html"});
    		})


	});
			
			
});


app.get('/login', function(req, res, next) {
	console.log("LoginButton called");
	
	passport.authenticate('local', function(err, user, info) {
		if (err) { 
			return next(err);
		}
		if (!user) {
			return res.json({"status": 401, "redirect" : "/login.html"});
		}
		})(req, res, next);

});

app.post('/logout', function(req, res) {
  console.log('logging out');
  req.session.destroy();
  req.logout();
  res.json({"redirect": '/login.html'});
});

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
			res.json({"Response": "login failed", "Uid": " ", "State": result});
		}
		else {
			res.json({"Response": "login successful", "Uid": result, "State": 0}); 
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
	var select = "SELECT * FROM Users WHERE Username LIKE '" + username + "'";
	connection.query(select, function(err, rows) {
		if (err) {
			/* an error occured */
			console.log("Login Failed");
			return callback(-2);
		}
		else {
			if (rows.length == 1) {
					console.log("password = %s, hash = %s\n", password, rows[0].Password);
				if(bcrypt.compareSync(password, rows[0].Password)){
					console.log("Login Successful");
					return callback(0);
				}else{
					console.log("Login Failed: Bad Pass");
					return callback(-3);
				}
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
			res.json({"Resonse": "register failed", "Uid": " ", "State": result});
		}
		else {
			res.json({"Response": "register successful", "Uid": result, "State": 0});
		}
	}

	/* check for missing args */
	if (req.body.username == undefined || req.body.password == undefined) {
		console.log("Register: undefined args");
		callback(-1);
	}
	else {
		Register(req.body, callback);
	}
});

/**
 * Creates a new user with the given username and password
 * Checks that no user with the same username exists
 */
function Register(user, callback) {
	
	console.log("Register: ", user.username, user.password, user.email);
	
	/* check for existing user with username */
	var select = "SELECT * FROM Users WHERE username LIKE '" + user.username + "'";

	connection.query(select, function(err, rows) {
		if (err) {
			console.log("Register Failed: ", err);
			return callback(-2);
		}
		else {
			/* if user with username already exists... */
			if (rows.length > 0) {
				console.log("user exists")
				return callback(-3);
			}
			else {
				var hash = bcrypt.hashSync(user.password, 10);
				console.log("HASH = " + hash);
				/* if username is not already used */
				var insert = "INSERT INTO Users (Username, Password, EmailAddress, PhoneNumber, NumberOfStrikes, NUM_BidRate, NUM_PostRate, AVG_BidRate, AVG_PostRate, DateJoined) VALUES ('" + user.username + "', '" + hash + "','" + user.email + "','" + user.phone + "' , 0, 0, 0, 0, 0, '" + GetDate() + "' )";

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
		}
	});
}


/* test stuff by sam, dont worry about this */

function ensureAuthenticated(req, res, next) {
  console.log("is auth? + "  + req.isAuthenticated());
  //console.log("req = %s", JSON.stringify(req.user));
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next(); }

  // denied. redirect to login
  res.redirect('/login.html')
}

app.get('/protected', ensureAuthenticated , function(req, res) {
  res.send("access granted. secure stuff happens here");
});

function isAuthenticated(req,res,next){
   if(req.user)
      return next();
   else
      return res.redirect('login.html');

}

app.get('/checkauth', isAuthenticated, function(req, res){

    res.status(200).json({
        status: 'Login successful!'
    });
});


/**
 * Get user info
 * Accepts: userId
 * Returns user info (not password)
 */
 app.post('/GetUser', function(req, res) {
 	console.log("GetUser");
	console.log("user = %s", JSON.stringify(req.user) );
 	/* callback to handle response */
 	var callback = function(result) {
 		if (result < 0) {
 			res.json({'Response': 'GetUser failed', 'State': result, 'Result': ''});
 		}
 		else {
 			res.json({'Response': 'GetUser successful', 'State': 0, 'Result': result});
 		}
 	}

 	/* check for undefined args */
 
 	GetUser(req.user.Uid, callback);
 });

 function GetUser(userId, callback) {
 	console.log("GetUser: userId" + userId);

 	var select = "SELECT * FROM Users WHERE Uid LIKE '" + userId + "'";

 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("GetUser: database error: " + err);
 			return callback(-2);
 		}
 		else {
 			return callback(rows);
 		}
 	});
 }


/** 
 * Updates a user's profile information in the database 
 * Accepts: Username, password, Email, description, profile image, location, phone number
 * Returns: state
 */
app.post('/UpdateProfile', function(req, res) {
	console.log("UpdateProfile");

	/* register callback to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occured */
			res.json({'Response': 'update failed', 'State': result});
		}
		else {
			res.json({'Response' : 'update successful', 'State': result});
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
			console.log("UpdateProfile: database error:" + err);

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
			res.json({'Response': 'createPost failed', 'PostId': " ", 'State': result});
		}
		else {
			res.json({'Response' : 'createPost successful', 'PostId': result, 'State': 0});
		}
	}

	/* check for missing args */
	if (req.body.Uid == undefined || req.body.title == undefined || req.body.location == undefined || req.body.description == undefined) {
		console.log("CreatePost: undefined args, requires Uid, location, and description");
		callback(-1);
	}
	else {
		imageLink = "";
		if (req.body.imageLink != undefined) {
			imageLink = req.body.imageLink;
		}
		CreatePost(req.body.Uid, req.body.title, req.body.location, req.body.description, imageLink, callback);
	}
});

/**
 * inserts new post into the database 
 */
function CreatePost(userId, title, location, description, image, callback) {
	console.log("CreatePost: ", userId, location, description);

	var creationTime = GetDate();
	var insert = "INSERT INTO Posting (Uid, P_Title, P_Location, CreationTime, Status, P_Description, P_Image) VALUES ('" + userId + "', '" + title + "', '" + location + "', '" + creationTime + "', 1, '" + description + "', '" + image + "')";  

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
 			res.json({'Response': 'GetPost failed', 'Post': " ", 'State': result});
 		}
 		else {
 			res.json({'Response': 'GetPosts successful', 'Post': result, 'State': 0});
 		}
 	}

 	/* check for missing args */
 	if (req.body.postId == undefined) {
 		console.log("GetPost: undefined args. Requires: postId");
 		callback(-1);
 	}
 	else {
 		GetPost(req.body.postId, callback);
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
 				var post = rows[0];
 				
 				/* get user information also */
 				var select = "SELECT * FROM Users WHERE Uid LIKE '" + post.Uid + "'";

			 	connection.query(select, function(err, rows) {
			 		if (err) {
			 			console.log("GetPost: database error: " + err);
			 			return callback(-2);
			 		}
			 		else {
			 			return callback(Object.assign(post, rows));
			 		}
			 	});
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
  			res.json({"Response": "GetAllPosts failed", "result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetAllPosts successful", "result": result, "State": 0 });
  		}
  	}

  	GetAllPosts(callback);
});

function GetAllPosts(callback) {
  	var select = "SELECT Posting.Pid, Posting.P_Location, Posting.CreationTime, Posting.P_Description, Posting.NumberOfBids, Users.Uid, Users.Username, Users.U_Description, Users.U_Location, Users.PhoneNumber, Users.DateJoined, Users.EmailAddress, Users.AVG_PostRate, Users.AVG_BidRate FROM Posting Inner Join Users On Posting.Uid=Users.Uid";

  	connection.query(select, function(err, rows) {
  		if (err) {
  			console.log("GetAllPosts: database error", err);
  			return callback(-2);
  		}
  		else {
  			console.log("rows[]" + JSON.stringify(rows[2]));

  			return callback(rows);
  		}
  	});
}

function GetUser_Helper(userId) {
	var select = "SELECT * FROM Users WHERE Uid LIKE '" + userId + "'";

 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("GetPost: database error: " + err);
 			return null;
 		}
 		else {
 			return rows;
 		}
 	});
 }

/**
 * Returns posts created by the currently logged in user
 * Accepts: nothing
 * Returns: list of posts created by user
 */
 app.post("/GetUserPosts", function(req, res) {
 	console.log("GetUserPosts");

 	/* callback to handle response */
 	var callback = function(result) {
 		if (result < 0) {
 			res.json({"Response": "GetUserPosts failed", "Result": "", "State": result});
 		}
 		else {
 			res.json({"Response": "GetUserPosts successful", "Result": result, "State": 0});
 		}
 	}

 	GetUserPosts(req.user.Uid, callback);
 });

 function GetUserPosts(userId, callback) {
 	console.log("GetUserPosts: userId " + userId);
 	var select = "SELECT Posting.Pid, Posting.P_Location, Posting.CreationTime, Posting.P_Description, Users.Uid, Users.Username, Users.U_Description, Users.U_Location, Users.PhoneNumber, Users.DateJoined, Users.EmailAddress, Users.AVG_PostRate, Users.AVG_BidRate FROM Posting Inner Join Users On Posting.Uid=Users.Uid WHERE Users.Uid LIKE " + userId + ")";

 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("GetUserPosts: database error: " + err);
 			return callback(-2);
 		}
 		else {
 			return callback(rows);
 		}
 	});
 } 

/**
* Delete post based on postId
* Accepts: postId
* Returns: State
*/ 
app.post("/DeletePost", function(req, res) {
	console.log("DeletePost");

	var callback = function(result) {
		if (result < 0) {
			res.json({"Response": "DeletePost failed", "State": result });
		}
		else {
			res.json({"Response": "DeletePost successful", "State": result });
		}
	}

	DeletePost(req.body.postId, callback);
});

function DeletePost(postId, callback) {
	console.log("DeletePost: postId: " + postId);

	var deleteStatement = "DELETE FROM Posting WHERE Pid = " + postId;

	connection.query(deleteStatement, function(err, rows) {
		if (err) {
			console.log("DeletePost: database error, " + err);
			return callback(-2);
		}
		else {
			return callback(0);
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
  			res.json({"Response": "Bid failed", "Result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "Bid successful", "Result": result, "State": 0 });
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
			bidId = rows[0].Bidid;
			
			/* increment the number of bids on the post the bid was for */
			var update = "UPDATE Posting SET NumberOfBids=NumberOfBids+1 WHERE PID=" + postId;

			connection.query(update, function(err, rows) {
				if (err) {
					console.log("Bid: database error: " + err);
					return callback(-2);
				}
				else {
					return callback(bidId);
				}
			});
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
  			res.json({"Response": "GetBids failed", "Result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetBids successful", "Result": result, "State": 0 });
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
 * Returns the ratings for the currently logged in user
 * Accepts: nothing
 * Returns: average ratings for both bidding and posting
 */
app.post("/GetUserRatings", function(req, res) {
 	console.log("GetUserRatings");

 	var callback = function(result) {
 		if (result < 0) {
 			res.json({"Response": "GetUserRatings failed", "Result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetUserRatings successful", "Result": result, "State": 0 });
  		}
 	}

 	GetUserRatings(req.user.Uid, callback);
});

 function GetUserRatings(userId, callback) {
 	console.log("GetUserRatings userId " + userId);
 	
 	//var select 
 	return select = "SELECT FROM AVG_PostRate, AVG_BidRate FROM Users WHERE Uid LIKE " + userId;

 	connection.query(select, function(err, rows) { 
 		if (err) {
 			console.log("GetUserRatings: database error: " + err);
 			return callback(-2);
 		}
 		else {
 			return callback(rows[0]);
 		}
 	});
 }

 app.post("/CreateRating", require('./createRating').createRating(req, res));

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
