var connection = require('./../helpers/connection');

/** 
 * Returns a list of all postIds currently in the database
 * should it check status?
 */
module.exports = function(req, res) {

  	/* callback to handle response */
  	var callback = function(result) {
  		if (result < 0) {
  			res.json({"Response": "GetAllUsers failed", "result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetAllUsers successful", "result": result, "State": 0 });
  		}
  	}

  	getAllUsers(callback);
}

function getAllUsers(callback) {
  	var select = "SELECT * FROM Users";

  	connection.query(select, function(err, rows) {
  		if (err) {
  			console.log("GetAllUsers: database error", err);
  			return callback(-2);
  		}
  		else {
  			console.log("rows[]" + JSON.stringify(rows[2]));

  			return callback(rows);
  		}
  	});
}
