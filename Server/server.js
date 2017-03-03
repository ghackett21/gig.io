var express = require("express");
var path    = require("path");
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
var bcrypt = require('bcrypt');

/* delete later */
var getDate = require('./helpers/getDate');
var connection = require('./helpers/connection');

/* users */
var updateProfile = require('./users/updateProfile');

/* posts */
var getAllPosts = require('./posts/getAllPosts');
var deletePost = require('./posts/deletePost');
var getUserPosts = require('./posts/getUserPosts');
var getPost = require('./posts/getPost');
var createPost = require('./posts/createPost');

/* bidding */
var getBids = require('./bidding/getBids');
var bid = require('./bidding/bid');

/* rating system endpoints */
var createRating = require('./ratings/createRating');
var getUserRatings = require('./ratings/getUserRatings');


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

app.post('/UpdateProfile', function(req, res) {
	updateProfile(req, res);
});

app.post('/CreatePost', function(req, res) {
	createPost(req, res);
});

 app.post('/GetPost', function(req, res) {
 	getPost(req, res);
});

app.post("/GetAllPosts", function(req, res) {
	getAllPosts(req, res);
});

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

 app.post("/GetUserPosts", function(req, res) {
 	getUserPosts(req, res);
});

app.post("/DeletePost", function(req, res) {
	deletePost(req, res);
});

app.post("/Bid", function(req, res) {
	bid(req, res);
});

app.post("/GetBids", function(req, res) {
	getBids(req, res);
});

app.post('GetUserRatings', function(req, res) {
	getUserRatings(req, res);
})

 app.post("/CreateRating", function(req, res) {
 	createRating(req, res);
 });

/* start express server */
var server = app.listen(8081, function() {
	var host = server.address().address;
	var post = server.address().port;
})
