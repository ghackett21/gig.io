var connection = require('./../helpers/connection');

/**
 * Returns post details given postID
 * Accepts: PostID
 * Returns: State, Entire post info from database  
 */
module.exports = function(req, res) {
 	console.log("GetPost");

 	/* register callback to handle response */
 	var callback = function(result) {
 		if (result < 0) {
 			/* an error occurred */
 			res.json({'Response': 'GetPost failed', 'Post': " ", 'State': result});
 		}
 		else {
 			res.json({'Response': 'GetPosts successful', 'Post': result, 'State': 0});
 		}
 	}

 	/* check for missing args */
 	if (req.body.postId == undefined) {
 		console.log("GetPost: undefined args. Requires: postId");
 		callback(-1);
 	}
 	else {
 		getPost(req.body.postId, callback);
 	}
 }

/**
*	Returns the post information given a postId
*/
function getPost(PostId, callback) {
	console.log("GetPost: ", PostId);

	var select = "SELECT * FROM Posting WHERE Pid LIKE " + PostId;

	connection.query(select, function(err, rows) {
		if (err) {
			/* database error */
			console.log("GetPost: database error: ", err);
			return callback(-2);
		}
		else {
			if (rows.length == 1) {
				var post = rows[0];
				
				/* get user information also */
				var select = "SELECT * FROM Users WHERE Uid LIKE '" + post.Uid + "'";

		 	connection.query(select, function(err, rows) {
		 		if (err) {
		 			console.log("GetPost: database error: " + err);
		 			return callback(-2);
		 		}
		 		else {
		 			return callback(Object.assign(post, rows));
		 		}
		 	});
			}
			else {
				console.log("GetPost: PostId matches multiple posts!");
				return callback(-2);
			}
		}
	});
}
