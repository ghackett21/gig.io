/* closePost.js */
var sendBidNotifications = require('./../helpers/sendBidNotifications');
var sendNotification = require('./../helpers/sendNotification');
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

	console.log("close post: Bidid: " + req.body.Bidid + ", PostId: " + req.body.PostId);

	/* check for missing args */
	if (req.body.PostId == undefined) {
      console.log("Close Post: undfined args: requires BidId (optional) and PostId");
		callback(-1);
	}
	else if (req.body.Bidid == undefined) {
		closePost(null, req.body.PostId, callback);
	}
	else {
      closePost(req.body.Bidid, req.body.PostId, callback);
	}
}

function closePost(bidId, postId, callback) {
	/* check if there is winner */
	if (bidId == null) {
		/* no winner - delete post */
		console.log("Close post " + postId + " with no winner.");
		sendBidNotifications(postId, callback);
	}
	else {
		console.log("Close post " + postId + " with winning bid " + bidId);
		/*
        var mailOptions = {
			from: 'gigdotio@gmail.com', // sender address
			to: req.user.Email, // list of receivers
			subject: 'Post has been closed', // Subject line
			text: "This is a notification to alert you that your post has been closed."
		};


		transporter.sendMail(mailOptions, function(error, info){
			if(error){
			    return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});
		*/

		/* get userId of winning bidder */
		var selectUid = "SELECT Uid FROM Bids WHERE Bidid=" + bidId;

		connection.query(selectUid, function(err, rows) {
			if (err) {
				console.log("Close Post: error getting Uid: " + err);
				return callback(-2);
			}
			else {
				/* change post status to pending */
			    var updatePostStatus = "UPDATE Posting SET STATUS=" + 1 + ", Winning_Bidid=" + bidId + ", Winning_Uid=" + rows[0].Uid + " WHERE Pid=" + postId;

			    connection.query(updatePostStatus, function(err, rows) {
			      if (err) {
			        console.log("Close Post: database error!" + err);
			        return callback(-2);
			      }
			      else {
			      	/* send notification */
					sendBidNotifications(postId);
			        return callback(0);
			      }
			    });
			}
		});
	}
}
