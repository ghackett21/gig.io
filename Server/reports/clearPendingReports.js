var connection = require('./../helpers/connection')

/**
 * Returns the reports for the given user or the currently logged in user if no userId is specified
 * Accepts: userId (optional)
 * Returns: average ratings for both bidding and posting
 */
module.exports = function(req, res) {
 	console.log("ClearPendingReports");

 	var callback = function(result) {
 		if (result < 0) {
 			res.json({"Response": "ClearPendingReports failed", "State": result });
  		}
  		else {
  			res.json({"Response": "ClearPendingReports successful", "State": 0 });
  		}
 	}

 	if (req.body.userId == undefined) {
 		console.log("Clear pending reports: Uid required");
 		callback(-1);
 	}
 	getUserReports(req.body.userId, callback);
}

function getUserReports(userId, callback) {
	console.log("GetUserReports: userId " + userId);
	
	var select = "UPDATE Users Set PendingReports=0 WHERE Uid LIKE " + userId;

	connection.query(select, function(err, rows) { 
		if (err) {
			console.log("Clear Pending Reports: database error: " + err);
			return callback(-2);
		}
		else {
			return callback(0);
		}
	});
}