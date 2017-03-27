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
			if (callback) {
				return callback(0);
			}
		}
	});
}