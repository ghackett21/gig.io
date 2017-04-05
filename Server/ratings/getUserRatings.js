var connection = require('./../helpers/connection')

/**
 * Returns the ratings for the currently logged in user
 * Accepts: nothing
 * Returns: average ratings for both bidding and posting
 */
module.exports = function(req, res) {
 	console.log("GetUserRatings");

 	var callback = function(result) {
 		if (result < 0) {
 			res.json({"Response": "GetUserRatings failed", "Result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetUserRatings successful", "Result": result, "State": 0 });
  		}
 	}

 	if (req.body.userId == undefined) {
 		getUserRatings(req.user.Uid, callback);
 	}
 	else {
 		getUserRatings(req.body.userId, callback);
 	}
}

function getUserRatings(userId, callback) {
	console.log("GetUserRatings userId " + userId);
	
	var select = "SELECT FROM AVG_PostRate, AVG_BidRate FROM Users WHERE Uid LIKE " + userId;

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