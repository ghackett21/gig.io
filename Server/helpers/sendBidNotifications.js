var sendNotification = require('./../helpers/sendNotification');
var connection = require('./../helpers/connection');


//bid notification
//postid -> winning bid id + losers bid id's
//post.winningbid
module.exports = function(postid, cb) {
	console.log("sendingBidNotifications");
	var callback = function(poster, losers, winner) {
		if (poster < 0) {
			/* an error occured */
			//res.json({'Response': 'sendBid failed', 'State': result});
			console.log("failed");
		}
		else {
			//res.json({'Response' : 'sendBid successful', 'State': result});
			sendNotification(winner, poster, 1);
			sendNotification(losers, poster, 0, cb);
		}
	}
	
	GetWinner(postid, callback);

}


function GetWinner(postId, callback) {
 	var select = "SELECT Posting.Winning_Uid, Posting.Winning_Bidid, Posting.P_Title, Users.Username, Users.EmailAddress, Bids.Amount FROM Posting INNER JOIN Users On Posting.Winning_Uid=Users.Uid INNER JOIN Bids On Posting.Winning_Bidid=Bids.Bidid WHERE Posting.Pid LIKE '" + postId + "'";

 	connection.query(select, function(err, rows) {
 		if (err) {
			console.log("UICHDHSV*&HEEHDUCFHUIEWHFUI");
 			console.log("GetWinner: database error: " + err);
 			return callback(-2);
 		}
 		else {
			if(rows.length == 0){
				console.log("here");
				GetClose(postId, callback);			
			}else{
				console.log(rows.length);
				console.log("GetWinner: %j", rows);
				GetOtherBids(postId, rows, callback);
			}
 		}
 	});
}
function GetClose(postId, callback){
 	var select = "SELECT Posting.P_Title, Posting.Pid FROM Posting WHERE Posting.Pid LIKE '" + postId + "'";

 	connection.query(select, function(err, rows) {
 		if (err) {
			console.log("UICHDHSV*&HEEHDUCFHUIEWHFUI");
 			console.log("GetClose: database error: " + err);
 			return callback(-2);
 		}
 		else {
			console.log("uirehuierhge %j", rows[0]);
			GetOtherBids(postId, rows, callback);
 		}
 	});
}

function GetOtherBids(postId, winner, callback) {
	//console.log("GETOTHERBIDS WinningUid = " + winner[0].Winning_Uid);
	console.log("WINNER = %j", winner);
	if(winner[0].Winning_Uid == undefined){
		var select = "SELECT Bids.Uid, Users.Username, Users.EmailAddress, Posting.Pid, Posting.P_Title FROM Bids INNER JOIN Users On Bids.Uid=Users.Uid INNER JOIN Posting On Bids.Pid=Posting.Pid WHERE Bids.Pid LIKE '" + postId + "'";
	}else{
 		var select = "SELECT Bids.Uid, Users.Username, Users.EmailAddress, Posting.Pid, Posting.P_Title FROM Bids INNER JOIN Users On Bids.Uid=Users.Uid INNER JOIN Posting On Bids.Pid=Posting.Pid WHERE Bids.Pid LIKE '" + postId + "'" + "AND Bids.Uid NOT LIKE '" + winner[0].Winning_Uid + "'";
	}
 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("GetOtherBids: database error: " + err);
 			return callback(-2);
 		}
 		else {
			console.log("GetOtherBids: %j", rows);
 			//return callback(rows, winner, callback);
			GetPoster(postId, rows, winner, callback);
 		}
 	});
}

function GetPoster(postId, losers, winner, callback) {

 	var select = "SELECT Users.Username, Users.EmailAddress FROM Users INNER JOIN Posting On Posting.Uid=Users.Uid WHERE Posting.Pid LIKE '" + postId + "'";
 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("GetPoster: database error: " + err);
 			return callback(-2);
 		}
 		else {
	console.log(rows[0]);
			return callback(rows, losers, winner);
 		}
 	});
}

