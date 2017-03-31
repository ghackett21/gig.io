/* closePost.js */
var connection = require('./../helpers/connection');
var deletePostHelper = require("./../posts/deletePostHelper");

/** close a Post -
 * UserId is optional, if one is provied they are notified and the post is set to pending,
 * otherwise, the post is just deleted with no winner
 */
module.exports = function(req, res) {
	console.log("Close Post");

	/* callback to handle response */
	var callback = function(result) {
		if (result < 0) {
			res.json({"Response": "Close Post failed", "State": result });
		}
		else {
			res.json({"Response": "Close Post successful", "State": 0 });
		}
	}

	/* check for missing args */
	if (req.body.PostId == undefined || req.body.Amount == undefined) {
      console.log("Close Post: undfined args: requires UserId (optional), PostId, and Amount");
		callback(-1);
	}
	else if (req.body.UserId == undefined) {
		closePost(null, req.body.PostId, req.body.Amount, callback);
	}
	else {
      closePost(req.body.UserId, req.body.PostId, req.body.Amount, callback);
	}
}

function closePost(userId, postId, amount) {
	/* check if there is winner */
	if (userId == null) {
		/* no winner - delete post */
		console.log("Close post " + postId + " with no winner.");
		deletePostHelper(postId, callback);
	}
	else {
		console.log("Close post " + postId + " with winning bid by user " + userId);

	    /* change post status to pending */
	    var updatePostStatus = "UPDATE Posting SET STATUS=" + 1 + " WHERE Pid=" + postId;

	    connection.query(updatePostStatus, function(err, rows) {
	      if (err) {
	        console.log("Close Post: database error!");
	        return callback(-2);
	      }
	      else {
	      	/* send notification */
	        return callback(0);
	      }
	    });
	}
}