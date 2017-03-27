var connection = require('./../helpers/connection');
var deletePostHelper = require("./../helpers/deletePostHelper");

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