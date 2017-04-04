var connection = require('./../helpers/connection');

/**
 * Returns posts created by the currently logged in user
 * Accepts: nothing
 * Returns: list of posts created by user
 */
 module.exports = function(req, res) {
 	console.log("GetUserPosts");

 	/* callback to handle response */
 	var callback = function(result) {
 		if (result < 0) {
 			res.json({"Response": "GetUserPosts failed", "Result": "", "State": result});
 		}
 		else {
 			res.json({"Response": "GetUserPosts successful", "Result": result, "State": 0});
 		}
 	}

 	getUserPosts(req.user.Uid, callback);
 }

function getUserPosts(userId, callback) {
	console.log("GetUserPosts: userId " + userId);
	var select = "SELECT Posting.P_Title, Posting.Pid, Posting.P_Location, Posting.CreationTime, Posting.P_Description, Users.Uid, Users.Username, Users.U_Description, Users.U_Location, Users.PhoneNumber, Users.DateJoined, Users.EmailAddress, Users.AVG_PostRate, Users.AVG_BidRate FROM Posting Inner Join Users On Posting.Uid=Users.Uid WHERE Users.Uid LIKE " + userId;

	connection.query(select, function(err, rows) {
		if (err) {
			console.log("GetUserPosts: database error: " + err);
			return callback(-2);
		}
		else {
			return callback(rows);
		}
	});
} 