var getBidsHelper = require('./../bidding/getBidsHelper');

/**
 * Returns all bids for a given post
 * Accepts: PostID
 * Returns: List of all bids for that post
 */
module.exports = function(req, res) {
	console.log("GetBids");

	/* callback to handle response */
  	var callback = function(result) {
  		if (result < 0) {
  			res.json({"Response": "GetBids failed", "Result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetBids successful", "Result": result, "State": 0 });
  		}
  	}

  	if (req.body.PostId == undefined) {
  		console.log("GetBids undfined args: requires PostId");
  		callback(-1);
  	}
  	else {
  		getBidsHelper(req.body.PostId, callback);
  	}
}
