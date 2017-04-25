var connection = require('./../helpers/connection');

/**
 * Delete user
 * Accepts: userId (optional)
 * Returns state
 */
module.exports = function(req, res) {
 	console.log("DeleteUser");
 	/* callback to handle response */
 	var callback = function(result) {
 		if (result < 0) {
 			res.json({'Response': 'DeleteUser failed', 'State': result});
 		}
 		else {
 			res.json({'Response': 'DeleteUser successful', 'State': 0});
 		}
 	}

 	/* check for undefined args */
 	if (req.body.userId  == undefined) {
 		console.log("Delete user: undefined args: requires userId");
 	} 
 	else {
 		deleteUserHelper(req.body.userId, callback);
 	}
}

function deleteUserHelper(userId, callback) {
 	console.log("Delete User: userId " + userId);

 	var select = "DELETE FROM Users WHERE Uid LIKE '" + userId + "'";

 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("DeleteUser: database error: " + err);
 			return callback(-2);
 		}
 		else {
 			return callback(0);
 		}
 	});
 }
