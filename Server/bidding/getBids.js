var connection = require('./../helpers/connection');

/**
 * Returns all bids for a given post
 * Accepts: PostID
 * Returns: List of all bids for that post
 */
module.exports = function(req, res) {
	console.log("GetBids");

	/* callback to handle response */
  	var callback = function(result) {
  		if (result < 0) {
  			res.json({"Response": "GetBids failed", "Result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetBids successful", "Result": result, "State": 0 });
  		}
  	}

  	if (req.body.PostId == undefined) {
  		console.log("GetBids undfined args: requires PostId");
  		callback(-1);
  	}
  	else {
  		getBids(req.body.PostId, callback);
  	}
}

function getBids(postId, callback) {
	console.log("GetBids: " + postId);

	var select = "SELECT Bids.Bidid, Bids.Uid, Bids.Pid, Bids.BidTime, Bids.Amount, Users.Username FROM Bids Inner Join Users On Bids.Uid=Users.Uid WHERE Bids.Pid Like '" + postId + "'";

	connection.query(select, function(err, rows) {
		if (err) {
			console.log("GetBids: database error", err);
			return callback(-2);
		}
		else {
			return callback(rows);
		}
	}); 
}