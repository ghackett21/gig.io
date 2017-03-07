var connection = require('./../helpers/connection');

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
  			res.json({"Response": "Bid failed", "Result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "Bid successful", "Result": result, "State": 0 });
  		}
  	}

  	/* check for missing args */
  	if (req.body.UserId == undefined || req.body.PostId == undefined || req.body.Amount == undefined) {
  		console.log("Bid: unddfined args: requires UserId, PostId, and Amount");
  		callback(-1);
  	}
  	else {
  		bid(req.body.UserId, req.body.PostId, req.body.Amount, callback);
  	}
}

function bid(userId, postId, amount, callback) {
	var bidTime = GetDate();
	var insert = "INSERT INTO Bids (Uid, Pid, BidTime, Amount) VALUES (" + userId + ", " + postId + ", '" + bidTime + "', " + amount + ")";

	connection.query(insert, function(err, rows) {
		if (err) {
			console.log("Bid: database error", err);
			return callback(-2);
		}
		else {
			bidId = rows[0].Bidid;
			
			// check if lowest bid

			/* increment the number of bids on the post the bid was for */
			var update = "UPDATE Posting SET NumberOfBids=NumberOfBids+1 WHERE PID=" + postId;

			connection.query(update, function(err, rows) {
				if (err) {
					console.log("Bid: database error: " + err);
					return callback(-2);
				}
				else {
					return callback(bidId);
				}
			});
		}
	});
}