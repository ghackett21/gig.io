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
	if (req.body.PostId == undefined) {
      console.log("Close Post: undfined args: requires BidId (optional) and PostId");
		callback(-1);
	}
	else if (req.body.BidId == undefined) {
		closePost(null, req.body.PostId, req.body.Amount, callback);
	}
	else {
      closePost(req.body.BidId, req.body.PostId, req.body.Amount, callback);
	}
}

function closePost(bidId, postId, amount, callback) {
	/* check if there is winner */
	if (bidId == null) {
		/* no winner - delete post */
		console.log("Close post " + postId + " with no winner.");
		deletePostHelper(postId, callback);
	}
	else {
		console.log("Close post " + postId + " with winning bid " + bidId);

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
