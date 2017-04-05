var connection = require('./../helpers/connection')

/**
 * Returns the reports for the given user or the currently logged in user if no userId is specified
 * Accepts: userId (optional)
 * Returns: average ratings for both bidding and posting
 */
module.exports = function(req, res) {
 	console.log("GetUserRatings");

 	var callback = function(result) {
 		if (result < 0) {
 			res.json({"Response": "GetUserReports failed", "Result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetUserReports successful", "Result": result, "State": 0 });
  		}
 	}

 	if (req.body.userId == undefined) {
 		getUserReports(req.user.Uid, callback);
 	}
 	else {
 		getUserReports(req.body.userId, callback);
 	}
}

function getUserReports(userId, callback) {
	console.log("GetUserReports: userId " + userId);
	
	var select = "SELECT * FROM Reports WHERE Uid LIKE " + userId;

	connection.query(select, function(err, rows) { 
		if (err) {
			console.log("GetUserReports: database error: " + err);
			return callback(-2);
		}
		else {
			return callback(rows);
		}
	});
}