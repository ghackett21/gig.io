var sendNotification = require('./../helpers/sendNotification');
var connection = require('./../helpers/connection');


//bid notification
//postid -> winning bid id + losers bid id's
//post.winningbid
module.exports = function(postid) {

	



	
}


function GetWinner(postId, callback) {

 	var select = "SELECT Winning_Uid FROM Posting WHERE Pid LIKE '" + postId + "'";

 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("GetWinner: database error: " + err);
 			return callback(-2);
 		}
 		else {
 			return callback(rows);
 		}
 	});
}

function GetOtherBids(postId, Uid2, callback) {

 	var select = "SELECT Uid FROM Bids WHERE Pid LIKE '" + postId + "'" + "AND Uid NOT LIKE '" + Uid2 + "'";

 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("GetOtherBids: database error: " + err);
 			return callback(-2);
 		}
 		else {
 			return callback(rows);
 		}
 	});
}
