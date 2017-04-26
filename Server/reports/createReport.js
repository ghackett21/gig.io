/* createReport.js */

var getDate = require('./../helpers/getDate');
var connection = require('./../helpers/connection');

/**
* Create a new Rating
* Accepts: ratingType ("Bid" or "Post"), Comment, userIdReporter, userId, ratingValue 
* Returns: State
*/
module.exports = function(req, res){
	console.log("CreateReport");

	/* callback to handle response */
	var callback = function(result) {
		if (result < 0) {
				res.json({"Response": "CreateReport failed", "State": result });
			}
			else {
				res.json({"Response": "CreateReport successful", "State": result });
			}
	}

	/* check for undefined args */
	if (req.body.comment == undefined ||  req.body.userId == undefined || req.body.type == undefined) {
		console.log("CreateReport: undefined args: requires comment, userId, and type");
		console.log("userId: "+req.body.userId);
		console.log("comment: "+req.body.comment);
		console.log("type: "+req.body.type);
		callback(-1);
	}
	else if (req.user.Uid == req.body.userId) {
		/* check that userId and userIdReporter are not equal */
		console.log("CreateReport: a user cannot report themselves!");
		return callback(-1);
	}
	else {
		createReport(req.body.userId, req.body.type, req.user.Uid, req.body.comment, callback);
	}
}

function createReport(userId, type, userIdReporter, comment, callback) {
	console.log("CreateReport: type: " + type + ", userId: " + userId + ", userIdReporter: " + userIdReporter + ", comment: " + comment);

	var insert = "INSERT INTO Reports (Uid, Type, UidReporter, Time, Comment) VALUES (" + connection.escape(userId) + ", " + connection.escape(type) + ", " + connection.escape(userIdReporter) + ", '" + getDate() + "', " + connection.escape(comment) + ")";

	connection.query(insert, function(err, rows) { 
		if (err) {
			console.log("CreateReport: database error: " + err);
			return callback(-2);
		}
		else {
			var update = "UPDATE Users SET PendingReports=PendingReports+1 WHERE Uid=" + userId;

			connection.query(update, function(err, rows) {
				if (err) {
					console.log("Create Report: error updating user: " + err);
					return callback(-2);
				}
				else {
					console.log("Create Report successful");
					return callback(0);
				}
			});
		}
	});
}
