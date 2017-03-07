var connection = require('./../helpers/connection');

/**
 * Get user info
 * Accepts: userId
 * Returns user info (not password)
 */
module.exports = function(req, res) {
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
 
 	getUser(req.user.Uid, callback);
 }

 function getUser(userId, callback) {
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