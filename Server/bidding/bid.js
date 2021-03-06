var connection = require('./../helpers/connection');
var getDate = require('./../helpers/getDate');
var getBidsHelper = require('./../bidding/getBidsHelper');

/** 
 * Place a bid on a post
 * Accepts: UserId, PostId, and $ Amount
 * Returns BidID
 */
module.exports = function(req, res) {
	console.log("Bid");

	/* callback to handle response */
  	var callback = function(result) {
  		if (result < 0) {
  			res.json({"Response": "Bid failed", "Result":"", "State": result });
  		}
  		else {
  			res.json({"Response": "Bid successful", "Result":result, "State": 0 });
  		}
  	}

  	/* check for missing args */
  	if (req.body.UserId == undefined || req.body.PostId == undefined || req.body.Amount == undefined) {
        console.log("Bid: undfined args: requires UserId, PostId, and Amount");
  		callback(-1);
  	}
  	else {
  		/* assume current user is placing bid */
  		//bid(req.User.Uid, req.body.PostId, req.body.Amount, callback);
        bid(req.body.UserId, req.body.PostId, req.body.Amount, callback);
  	}
}

function bid(userId, postId, amount, callback) {
	console.log("Bid: userId=" + userId + ", postId=" + postId + ", amount=" + amount);
	/* check userId of bid aginst userId of post */
	var selectPostUserId = "SELECT Uid FROM Posting WHERE Pid=" + postId;

	connection.query(selectPostUserId, function(err, rows) {
		if (err) {
			console.log("Bid: error getting post!");
			return callback(-2);
		}
		else {
			if (rows[0].Uid == userId) {
				console.log("Bid: User cannot bid on their own post!");
				return callback(-3);
			}
			else {
				/* get any current bid by same user on the same post */
				var selectExistingBid = "SELECT Bidid, Amount FROM Bids WHERE Uid=" + userId + " AND Pid=" + postId;

				connection.query(selectExistingBid, function(err, rows){ 
					if (err) {
						console.log("Bid: error getting existing bid!");
						return callback(-2);
					}
					else {
						if (rows.length == 0) {
							insertBid(userId, postId, amount, true, callback);
						}
						else if (rows[0].Amount < amount) {
							console.log("Cannot bid more than already bid on same post!");
							return callback(-4);
						}
						else {
							insertBid(userId, postId, amount, false, callback);

							var deleteOldBid = "DELETE FROM Bids WHERE Bidid=" + rows[0].Bidid;

							connection.query(deleteOldBid, function(err, rows) {
								if (err) {
									console.log("Bid: error deleting existing bid!");
								}
							});
						}
					}
				});
			}
		}
	});
}

function insertBid(userId, postId, amount, newBidder, callback) {
	var bidTime = getDate();
	var insert = "INSERT INTO Bids (Uid, Pid, BidTime, Amount) VALUES (" + userId + ", " + postId + ", '" + bidTime + "', " + amount + ")";


	connection.query(insert, function(err, rows) {
		if (err) {
			console.log("Bid: database error", err);
			return callback(-2);
		}
		else {
			if (newBidder) {
				/* increment the number of bids on the post the bid was for */
				var updateNumBids = "UPDATE Posting SET NumberOfBids=NumberOfBids+1 WHERE PID=" + postId;

				connection.query(updateNumBids, function(err, rows) {
					if (err) {
						console.log("Bid: database error: " + err);
						return callback(-2);
					}
					else {
						updateLowestBid(postId, amount, callback) 
					}
				});
			}
			else {
				updateLowestBid(postId, amount, callback) 
			}
		}
	});
}

function updateLowestBid(postId, amount, callback) {
	/* check lowest bid and update if needed */
	var selectLowestBid = "SELECT LowestBid FROM Posting WHERE Pid=" + postId;

	connection.query(selectLowestBid, function(err, rows) {
		if (err) {
			console.log("Bid: database error: " + err);
			return callback(-2);
		}
		else {
			if (rows[0].LowestBid == 0.0 || amount < rows[0].LowestBid) {
				/* update value in Db */
				var updateLowestBid = "UPDATE Posting SET LowestBid=" + amount + " WHERE Pid=" + postId;

				connection.query(updateLowestBid, function(err, rows) {
					if (err) {
						console.log("Bid: database error: " + err);
						return callback(-2);
					}
					else {
						getBidsHelper(postId, callback);
					}
				});
			}
			else {
				getBidsHelper(postId, callback);
			}
		}
	});
}