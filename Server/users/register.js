var bcrypt = require('bcrypt');
var connection = require('./../helpers/connection');
var getDate = require('./../helpers/getDate');

/**
 * Register a new user with the provided username and password.
 * Returns userID if successful.
 * Accepts: Username, Password
 * Returns: State, UserID
 */
module.exports = function(req, res) {
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
	if (req.body.username == undefined || req.body.password == undefined || req.body.location == undefined || req.body.lat == undefined || req.body.lng == undefined) {
		console.log("Register: undefined args");
		callback(-1);
	}
	else {
		register(req.body, callback);
	}
}

/**
 * Creates a new user with the given username and password
 * Checks that no user with the same username exists
 */
function register(user, callback) {
	
	console.log("Register: ", user.username, user.password, user.email, user.location, user.lat, user.lng);
	
	/* check for existing user with username */
	var select = "SELECT * FROM Users WHERE username LIKE " + connection.escape(user.username);

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
				var insert = "INSERT INTO Users (Username, Password, EmailAddress, PhoneNumber, NumberOfStrikes, NUM_BidRate, NUM_PostRate, AVG_BidRate, AVG_PostRate, DateJoined, U_Location, U_Lat, U_Long) VALUES (" + connection.escape(user.username) + ", '" + hash + "'," + connection.escape(user.email) + "," + connection.escape(user.phone) + " , 0, 0, 0, 0, 0, '" + getDate() + "', " + connection.escape(user.location) + ", " + user.lat + ", " + user.lng + ")";

				connection.query(insert, function(err, rows) {
					if (err) {
						/* an error occured */
						console.log("Register Failed", err);
						return callback(-2);
					}
					else {
						var selectUserId = "SELECT Uid from USERS WHERE Username=" + connection.escape(user.username) + " AND Password='" + hash + "'";

						connection.query(selectUserId, function(err, rows) {
							if (err) {
								console.log("Register: error getting user: " + err);
								console.log(-2);
							}
							else {
								console.log("Register Successful: Uid=" + rows[0].Uid);
								return callback(rows[0].Uid);
							}
						});
					}
				});
			}
		}
	});
}