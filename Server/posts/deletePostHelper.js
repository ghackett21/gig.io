var connection = require('./../helpers/connection');

module.exports = function(postId, callback) {
	console.log("DeletePost: postId: " + postId);

	var deleteStatement = "DELETE FROM Posting WHERE Pid = " + postId;

	connection.query(deleteStatement, function(err, rows) {
		if (err) {
			console.log("DeletePost: database error, " + err);
			if (callback) {
				return callback(-2);
			}
		}
		else {
			/* delete associated bids from bid table */
			var deleteBids = "DELETE FROM Bids WHERE Pid="  + postID;
			connection.query(deleteBids, function(err, rows) {
				if (err) {
					console.log("DeletePost: database error when deleting bids.", err);
					if (callback) {
						return callback(-2);
					}
				}
				else {
					if (callback) {
						return callback(0);
					}
				}
			});
		}
	});
}