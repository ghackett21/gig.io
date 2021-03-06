var connection = require('./../helpers/connection');
var convertDateToUTC = require('./../helpers/convertDateToUTC');
var deletePostHelper = require("./../posts/deletePostHelper");

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
					//console.log("old date: " + convertDateToUTC(new Date(msec)));
					msec += 2592000000;	/* add 30 days in milliseconds */
					var postDate = convertDateToUTC(new Date(msec));
					//console.log("updated date: " + postDate);
					var currentDate = convertDateToUTC(new Date());
					//console.log("current date: " + currentDate);

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
								//console.log("Number of bids: " + bidRows.length);
								if (bidRows.length == 0) {
									console.log("Delete Post: " + postRows[postKey].Pid);
									/* delete post */
									deletePostHelper(postRows[postKey].Pid, null);
								}
								else {
									var mostRecentDate = postDate;
									for (const bidKey of Object.keys(bidRows)) {
										//console.log("Pid:" + postRows[postKey].Pid, bidKey, bidRows[bidKey]);
										var bidmsec = Date.parse(bidRows[bidKey].BidTime);
										bidmsec += 2592000000;	/* add 30 days in milliseconds */
										var bidDate = convertDateToUTC(new Date(bidmsec));
										//console.log("Bid date: " + bidDate);

										if (bidDate > mostRecentDate) {
											mostRecentDate = bidDate;
										}
									}

									/* most recent date is now the time of the most recent bid */
									console.log("Pid:" + postRows[postKey].Pid + ", Most recent date: " + mostRecentDate);
									if (mostRecentDate < currentDate) {
										console.log("Pid: " + postRows[postKey].Pid + ", Inactive for 30 days or more: true");
										/* delete post */
										deletePostHelper(postRows[postKey].Pid, null);
									}
									else {
										console.log("Pid: " + postRows[postKey].Pid + ", Inactive for 30 days or more: false");
									}
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
}	
