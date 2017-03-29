var connection = require('./../helpers/connection');

/** 
 * Returns a list of all postIds currently in the database
 * should it check status?
 */
module.exports = function(req, res) {
    console.log("GetALLPosts");

  	/* callback to handle response */
  	var callback = function(result) {
  		if (result < 0) {
  			res.json({"Response": "GetAllPosts failed", "result": "", "State": result });
  		}
  		else {
  			res.json({"Response": "GetAllPosts successful", "result": result, "State": 0 });
  		}
  	}

  	getAllPosts(callback);
}

function getAllPosts(callback) {
  	var select = "SELECT Posting.Pid, Posting.P_Location, Posting.P_Lat, Posting.P_Long, Posting.CreationTime, Posting.P_Description, Posting.NumberOfBids, Posting.LowestBid, Users.Uid, Users.Username, Users.U_Description, Users.U_Location, Users.PhoneNumber, Users.DateJoined, Users.EmailAddress, Users.AVG_PostRate, Users.AVG_BidRate FROM Posting Inner Join Users On Posting.Uid=Users.Uid WHERE Posting.Status=" + 0;

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