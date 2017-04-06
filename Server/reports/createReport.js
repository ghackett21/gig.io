/* createReport.js */

var getDate = require('./../helpers/getDate');
var connection = require('./../helpers/connection');

/**
* Create a new Rating
* Accepts: ratingType ("Bid" or "Post"), Comment, userIdRater, userId, ratingValue 
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
	if (req.body.comment == undefined || req.body.userId == undefined || req.body.userIdReporter == undefined || req.body.type == undefined) {
		console.log("CreateRating: undefined args: requires ratingType, userId, userIdRater, and comment");
		callback(-1);
	}
	else if (req.body.userId == req.body.userIdRater) {
		/* check that userId and userIdRater are not equal */
		console.log("CreateReport: a user cannot report themselves!");
		return callback(-1);
	}
	else {
		createReport(req.body.userId, req.body.type, req.body.userIdReporter, req.body.comment, callback);
	}
}

function createReport(userId, type, userIdReporter, comment, callback) {
	console.log("CreateReport: type: " + type + ", userId: " + userId + ", userIdReporter: " + userIdReporter + ", comment: " + comment);

	var insert = "INSERT INTO Reports (Uid, Type, UidReporter, Time, Comment) VALUES (" + connection.escape(userId) + ", " + connection.escape(type) + ", " + connection.escape(userIdRater) + ", '" + getDate() + "', " + connection.escape(comment) + ")";

	connection.query(insert, function(err, rows) { 
		if (err) {
			console.log("CreateReport: database error: " + err);
			return callback(-2);
		}
		else {
			return callback(0);
		}
	});
}
