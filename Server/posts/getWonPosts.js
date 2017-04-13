var connection = require('./../helpers/connection');

/** 
 * Returns a list of all posts won by the current user 
 * should it check status?
 */
module.exports = function(req, res) {
    console.log("GetWonPosts");

  	/* callback to handle response */
  	var callback = function(result) {
  		if (result < 0) {
  			res.json({"Response": "GetWonPosts failed", "result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetWonPosts successful", "result": result, "State": 0 });
  		}
  	}

  	getWonPosts(req.user.Uid, callback);
}

function getWonPosts(userId, callback) {

  	connection.query(select, function(err, rows) {
  		if (err) {
  			console.log("GetAllPosts: database error", err);
  			return callback(-2);
  		}
  		else {
  			console.log("rows[]" + JSON.stringify(rows[2]));

  			return callback(rows);
  		}
  	});
}
