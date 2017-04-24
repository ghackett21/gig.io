var deleteUserHelper = require('./../users/deleteUserHelper');

/**
 * Delete user
 * Accepts: userId (optional)
 * Returns state
 */
module.exports = function(req, res) {
 	console.log("GetUser");
	console.log("user = %s", JSON.stringify(req.user) );
 	/* callback to handle response */
 	var callback = function(result) {
 		if (result < 0) {
 			res.json({'Response': 'GetUser failed', 'State': result});
 		}
 		else {
 			res.json({'Response': 'GetUser successful', 'State': 0});
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
