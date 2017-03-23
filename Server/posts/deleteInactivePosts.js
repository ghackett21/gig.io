var connection = require('./../helpers/connection');

/**
 * automatic inactive post deletion 
 * delete any and all posts that have been inactive for 30 or more days
 */

module.exports = function() {
	console.log("Delete Inactive Posts");

	/* find newest bid on all active posts and delete ones that
	 occured more than 30 days ago */
	 
	/* get list of all postIds */
	var selectPostIds = "SELECT Pid, CreationTime, Status FROM Posting";

	connection.query(selectPostIds, function(err, rows) {
		if (err) {
			console.log("Delete Inactive Posts: database error: " + err);
		}
		else {
			console.log(JSON.stringify(rows));
			console.log();
			for (var post in rows) {
				if (rows.hasOwnProperty(post)) {
					console.log(JSON.stringify(post.Pid));
				}

				/* check date of post - ignore if less than 30 days old */
				//if (post.CreationTime)
			}
		}

	});

	/* for each postId - check date - if post is less than 30 days old, move on */

	/* find all bids for that post */

	/* find newest bid for that post - if older than 30 days, then delete post */

	/* if post is older than 30 days and there are no bids, then delete post */
}	