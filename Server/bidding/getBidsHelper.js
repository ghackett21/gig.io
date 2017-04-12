var connection = require('./../helpers/connection');

module.exports = function (postId, callback) {
	console.log("GetBids: " + postId);

	/* first get post status */
	var selectPost = "SELECT Status, Winning_Bid FROM Posting WHERE Pid LIKE " + postId;

	connection.query(selectPost, function(err, rows) {
		if (err) {
			console.log("Get bids helper: error getting post info!");
			return callback(-2);
		}
		else {
			if (rows[0].Status == 0) {
				/* if the post is open, return all bids */
				var selectBids = "SELECT Bids.Bidid, Bids.Uid, Bids.Pid, Bids.BidTime, Bids.Amount, Users.Username, Users.AVG_BidRate FROM Bids Inner Join Users On Bids.Uid=Users.Uid WHERE Bids.Pid Like '" + postId + "'";

				connection.query(selectBids, function(err, rows) {
					if (err) {
						console.log("GetBids Helper: database error", err);
						return callback(-2);
					}
					else {
						return callback(rows);
					}
				}); 
			}
			else if (rows[0].Status == 1) {
				/* if the post is pending, only return info of the winning bid */
				var selectBids = "SELECT Bids.Bidid, Bids.Uid, Bids.Pid, Bids.BidTime, Bids.Amount, Users.Username, Users.AVG_BidRate FROM Bids Inner Join Users On Bids.Uid=Users.Uid WHERE Bids.Bidid Like '" + rows[0].Bidid + "'";

				connection.query(selectBids, function(err, rows) {
					if (err) {
						console.log("GetBids Helper: database error", err);
						return callback(-2);
					}
					else {
						return callback(rows);
					}
				}); 
			}
		}
	})
}