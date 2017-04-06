var connection = require('./../helpers/connection');

module.exports = function (postId, callback) {
	console.log("GetBids: " + postId);

	var select = "SELECT Bids.Bidid, Bids.Uid, Bids.Pid, Bids.BidTime, Bids.Amount, Users.Username, Users.AVG_BidRate FROM Bids Inner Join Users On Bids.Uid=Users.Uid WHERE Bids.Pid Like '" + postId + "'";

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