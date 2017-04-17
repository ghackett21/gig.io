var express = require("express");
var path    = require("path");
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var session = require('express-session');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gigdotio@gmail.com', // Your email id
            pass: 'geofffff' // Your password
        }
    });

/* delete later */
var connection = require('./helpers/connection');

/* users */
var login = require('./users/login');
var register = require('./users/register');
var updateProfile = require('./users/updateProfile');
var getUser = require('./users/getUser');
var getAllUsers = require('./users/getAllUsers');

/* posts */
var getAllPosts = require('./posts/getAllPosts');
var deletePost = require('./posts/deletePost');
var getUserPosts = require('./posts/getUserPosts');
var getPost = require('./posts/getPost');
var createPost = require('./posts/createPost');
var deleteInactivePosts = require('./posts/deleteInactivePosts');
var closePost = require('./posts/closePost');
var getWonPosts = require('./posts/getWonPosts');
var completePost = require('./posts/completePost');

/* bidding */
var getBids = require('./bidding/getBids');
var bid = require('./bidding/bid');

/* rating system endpoints */
var createRating = require('./ratings/createRating');
var getUserRatings = require('./ratings/getUserRatings');

/* report endpoints */
var getUserReports = require('./reports/getUserReports');
var createReport = require('./reports/createReport');


passport.serializeUser(function(user, done) {
  console.log("serializing user : " + user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
      console.log('no im not serial');
      done(null, user);
});

function findByUsername(username, fn) {
	var select = "SELECT * FROM Users WHERE Username LIKE " + connection.escape(username);

	/* query is not case sensitve */
	connection.query(select, function(err, rows) {
		if (err) {
			/* an error occured */
			console.log("Failed to find username");
			return fn(null, null);
		}
		else {
			if (rows.length == 1) {
				/* compare username - case sensitive */
				if (username == rows[0].Username) {
					console.log("findbyuser sending rows[0]: %j", rows[0]);
					return fn(null, rows[0]);
				}
				else {
					console.log("Username case mismatch");
					return fn(null, null);
				}
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

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

deleteInactivePosts();

app.get('/index.html', ensureAuthenticated, function(req, res) {
	console.log("dir = " + __dirname);
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/', ensureAuthenticated, function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/makepost.html', ensureAuthenticated, function(req, res) {
    res.sendFile(__dirname + '/public/makepost.html');
});

app.get('/userPost.html', ensureAuthenticated, function(req, res) {
    res.sendFile(__dirname + '/public/userPost.html');
});

app.get('/profile.html', ensureAuthenticated, function(req, res) {
	console.log("dir = " + __dirname);
    res.sendFile(__dirname + '/public/profile.html');
});

app.get('/updateProfile.html', ensureAuthenticated, function(req, res) {
	console.log("dir = " + __dirname);
    res.sendFile(__dirname + '/public/updateProfile.html');
});

app.get('/bid.html', ensureAuthenticated, function(req, res) {
    res.sendFile(__dirname + '/public/bid.html');
});

app.get('/userProfile.html', ensureAuthenticated, function(req, res) {
    res.sendFile(__dirname + '/public/userProfile.html');
});

app.use(express.static(path.join(__dirname, '/public')));

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
	login(req, res);
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

app.post('/RegisterButton', function(req, res) {
	register(req, res);
});

/* test stuff by sam, dont worry about this */

function ensureAuthenticated(req, res, next) {
  console.log("is auth? + "  + req.isAuthenticated());
  //console.log("req = %s", JSON.stringify(req.url));
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next(); }

  // denied. redirect to login
  res.redirect('/login.html')
}

app.post('/GetUser', function(req, res) {
 	getUser(req, res);
});

app.post('/GetAllUsers', function(req, res) {
 	getAllUsers(req, res);
});

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

app.post("/GetUserPosts", function(req, res) {
 	getUserPosts(req, res);
});

app.post("/GetWonPosts", function(req, res) {
 	getWonPosts(req, res);
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

app.post("/GetUserReposts", function(req, res) {
	getUserReposts(req, res);
});

app.post("/CreateReport", function(req, res) {
	createReport(req, res);
});

app.post("/CompletePost", function(req, res) {
	completePost(req, res);
});

app.post("/sendMail", function(req, res) {

            var mailOptions = {
				from: 'gigdotio@gmail.com', // sender address
				to: 'putemailhere', // list of receivers
				subject: 'Subject', // Subject line
				text: "text"
			};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
		    return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});

});
 app.post("/ClosePost", function(req, res) { 
 	closePost(req, res);
 });
/* start express server */
var server = app.listen(8081, function() {
	var host = server.address().address;
	var post = server.address().port;
})
