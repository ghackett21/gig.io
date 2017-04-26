var connection = require('./../helpers/connection');
var deleteUserHelper = require('./../users/deleteUserHelper');

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

