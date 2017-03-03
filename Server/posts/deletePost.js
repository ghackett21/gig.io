var connection = require('./../helpers/connection');

/**
* Delete post based on postId
* Accepts: postId
* Returns: State
*/ 
module.exports = function(req, res) {
	console.log("DeletePost");

	var callback = function(result) {
		if (result < 0) {
			res.json({"Response": "DeletePost failed", "State": result });
		}
		else {
			res.json({"Response": "DeletePost successful", "State": result });
		}
	}

	deletePost(req.body.postId, callback);
}

function deletePost(postId, callback) {
	console.log("DeletePost: postId: " + postId);

	var deleteStatement = "DELETE FROM Posting WHERE Pid = " + postId;

	connection.query(deleteStatement, function(err, rows) {
		if (err) {
			console.log("DeletePost: database error, " + err);
			return callback(-2);
		}
		else {
			return callback(0);
		}
	});
}