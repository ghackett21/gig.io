var connection = require('./../helpers/connection');
var convertDateToUTC = require('./../helpers/convertDateToUTC');

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

	connection.query(selectPostIds, function(err, postRows) {
		if (err) {
			console.log("Delete Inactive Posts: database error: " + err);
		}
		else {
			console.log(JSON.stringify(postRows));
			for (const postKey of Object.keys(postRows)) {
				console.log("\n" + postKey, postRows[postKey]);

				/* check state of the post - only delete if still open */
				if (postRows[postKey].Status == 0) {
					/* check date of post - ignore if less than 30 days old */
					var msec = Date.parse(postRows[postKey].CreationTime);
					console.log("old date: " + convertDateToUTC(new Date(msec)));
					msec += 2592000000;	/* add 30 days in milliseconds */
					var postDate = convertDateToUTC(new Date(msec));
					console.log("updated date: " + postDate);
					var currentDate = convertDateToUTC(new Date());
					console.log("current date: " + currentDate);

					/* compare dates */
					if (postDate > currentDate) {
						console.log("Older than 30 days: false");
					}
					else {
						console.log("Older than 30 days: true");

						/* find most recent bid on post */
						var selectBids = "SELECT BidTime FROM Bids WHERE Pid=" + postRows[postKey].Pid;

						connection.query(selectBids, function(err, bidRows) {
							if (err) {
								console.log("Datebase error retrieving bids!");
							}
							else {
								console.log("Number of bids: " + bidRows.size());
								var mostRecentDate = postDate;
								for (const bidKey of Object.keys(bidRows)) {
									console.log("Pid:" + postRows[postKey], bidKey, bidRows[bidKey]);
									var bidmsec = Date.parse(bidRows[bidKeys].BidTime);
									bidmsec += 2592000000;	/* add 30 days in milliseconds */
									var bidDate = convertDateToUTC(bidmsec);
									console.log("Bid date: " + bidDate);

									if (bidDate > mostRecentDate) {
										mostRecentDate = bidDate;
									}
								}

								/* most recent date is now the time of the most recent bid */
								console.log("Most recent date: " + mostRecentDate);
								if (mostRecentDate < currentDate) {
									"Inactive for 30 days or more: true";
								}
								else {
									"Inactive for 30 days or more: fakse";
								}
							}
						});
					}
				}
				else {
					console.log("Post Pending");
				}
			}
		}

	});

	/* for each postId - check date - if post is less than 30 days old, move on */

	/* find all bids for that post */

	/* find newest bid for that post - if older than 30 days, then delete post */

	/* if post is older than 30 days and there are no bids, then delete post */
}	
