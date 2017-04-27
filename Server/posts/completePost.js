/* closePost.js */
var connection = require('./../helpers/connection');
var deletePostHelper = require("./../posts/deletePostHelper");
var appToken = require('./../helpers/dwollaClient');

/** close a Post -
 * UserId is optional, if one is provied they are notified and the post is set to pending,
 * otherwise, the post is just deleted with no winner
 */
module.exports = function(req, res) {
	console.log("Complete Post");

	/* callback to handle response */
	var callback = function(result) {
		if (result < 0) {
			res.json({"Response": "Complete Post failed", "State": result });
		}
		else {
			res.json({"Response": "Complete Post successful", "State": 0 });
		}
	}

	console.log("complete post: Bidid: " + req.body.Bidid + ", PostId: " + req.body.PostId);

	/* check for missing args */
	if (req.body.PostId == undefined) {
      	console.log("Complete Post: undfined args: requires BidId (optional) and PostId");
		callback(-1);
	}
	else {
      	completePost(req.body.Bidid, req.body.PostId, callback);
	}
}

function completePost(bidId, postId, callback) {
	/* check if there is winner */
	console.log("Complete post " + postId);

	/* change post status to pending */
    var updatePostStatus = "UPDATE Posting SET STATUS=" + 2 + " WHERE Pid=" + postId;

    connection.query(updatePostStatus, function(err, rows) {
	    if (err) {
	        console.log("Complete Post: database error!" + err);
	        return callback(-2);
	    }
	    else {
	      	/* send notification */
	        return callback(0);
	    }
    });

    //TODO - get user bank info from DB
    //TODO - get amount from Bids table
    //TODO - get Uids from Posting table ==> get dwollaPaymentID from Users table
    // Process transaction with dwolla API
    var requestBody = {
        _links: {
            source: {
                href: 'temp'//TODO - link
            },
            destionation: {
                href: 'temp'//TODO - link
            }
        },
        amount: {
            currency: 'USD',
            value: 'temp'//TODO - get value
        }
    };

    appToken.post('transfers', requestBody).then(function(res) {
        console.log(res.headers.get('location'));
    });

}

