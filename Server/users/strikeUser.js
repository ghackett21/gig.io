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
 	if (req.body.userId  == undefined || req.body.reportId == undefined) {
 		console.log("Strike user: undefined args: requires userId and reportId");
 		return callback(-1);
 	} 
 	else {
 		strikeUser(req.body.userId, req.body.reportId, callback);
 	}
}

function strikeUser(userId, reportId, callback) {
	/* make sure that the report state is 1 */
	var selectReportState = "SELECT State FROM Reports WHERE Rid=" + reportId;

	connection.query(selectReportState, function(err, rows) { 
		if (err) {
			console.log("StrikeUser: error getting report state: " + err);
			return callback(-2);
		}
		else if (rows[0].State < 2) {
			var selectStrikes = "SELECT NumberOfStrikes FROM Users WHERE Uid=" + userId;

			connection.query(selectStrikes, function(err, rows) {
				if (err) {
					console.log("Strike User: database error getting number of strikes: " + err);
					return callback(-2);
				}
				else {
					numStrikes = rows[0].NumberOfStrikes;
					if (numStrikes < 2) {
						var incrementStrikes = "UPDATE Users SET NumberOfStrikes=NumberOfStrikes+1 WHERE Uid=" + userId;

						connection.query(incrementStrikes, function(err, rows) {
							if (err) {
								console.log("Strike User: database error updating number of strikes: " + err);
								return callback(-2);
							}
							else {
								var updateReportState = "UPDATE Reports SET State=2 WHERE Rid=" + reportId;

								connection.query(updateReportState, function(err, rows) {
									if (err) {
										console.log("StrikeUser: Error update report state: " + err);
										return callback(-2);
									}
									else {
										console.log("Strike user successful");
										return callback(0);
									}
								});
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
		else {
			console.log("Report already accepted.");
			return callback(0);
		}
	});
}
 
