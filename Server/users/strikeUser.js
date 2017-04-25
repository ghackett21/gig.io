var connection = require('./../helpers/connection');
var deleteUserHelper = require('./../users/deleteUserHelper');

/*
 * Strike User
 * Increment the number of strikes for the specified user and delete the user if they have
 * three strikes 
 */

module.exports = function(req, res) {
 	console.log("Strike User");
	console.log("user = %s", JSON.stringify(req.user) );
 	/* callback to handle response */
 	var callback = function(result) {
 		if (result < 0) {
 			res.json({'Response': 'StrikeUser failed', 'State': result});
 		}
 		else {
 			res.json({'Response': 'StrikeUser successful', 'State': 0});
 		}
 	}

 	/* check for undefined args */
 	if (req.body.userId  == undefined) {
 		console.log("Strike user: undefined args: requires userId");
 		return callback(-1);
 	} 
 	else {
 		strikeUser(req.body.userId, callback);
 	}
}

function strikeUser(userId, callback) {
	var selectStrikes = "SELECT NumberOfStrikes FROM Users WHERE Uid=" + userId;

	connection.query(selectStrikes, function(err, rows) {
		if (err) {
			console.log("Stike User: database error getting number of strikes: " + err);
			return callback(-2);
		}
		else {
			numStrikes = rows[0].NumberOfStrikes;
			if (numStrikes < 2) {
				var incrementStrikes = "UPDATE Users SET NumberOfStikes=NumberOfStrikes+1 WHERE Uid=" + userId;

				connection.query(incrementStrikes, function(err, rows) {
					if (err) {
						console.log("Stike User: database error updating number of strikes: " + err);
						callback(-2);
					}
					else {
						console.log("Strike user successful");
						return callback(0);
					}
				});
			}
			else {
				console.log("Stike user: user has 3 or more strikes - deleting user");
				deleteUserHelper(userId, callback);
			}
		}
	});
}
