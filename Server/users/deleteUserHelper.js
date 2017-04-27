
 module.exports = function(userId, callback) {
 	console.log("Delete User: userId " + userId);

 	var select = "DELETE FROM Users WHERE Uid LIKE '" + userId + "'";

 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("DeleteUser: database error: " + err);
 			return callback(-2);
 		}
 		else {
 			var deletePosts = "DELETE FROM Posting WHERE Uid=" + userId;

 			connection.query(deletePosts, function(err, rows) {
 				if (err) {
 					console.log("Delete user helper: error deleting posts: " + err);
 					return callback(-2);
 				}
 				else {
 					var deleteBids = "DELETE FROM Bids WHERE Uid=" + userId;

 					connection.query(deleteBids, function(err, rows) {
 						if (err) {
		 					console.log("Delete user helper: error deleting bids: " + err);
		 					return callback(-2);
		 				}
		 				else {
		 					var deleteRatings = "DELETE FROM RATINGS WHERE Uid=" + userId  + " OR UidRater=" userId;

		 					connection.query(deleteRatings, function(err, rows) {
		 						if (err) {
		 							console.log("Delete user helper: error deleting ratings: " + err);
		 							return callback(-2);
		 						}
		 						else {
		 							var deleteReports = "DELETE FROM Reports WHERE Uid=" + userId;

		 							connection.query(deleteReports, function(err, rows) {
		 								if (err) {
		 									console.log("Delete user helper: error deleting reports");
		 									return callback(-2);
		 								}
		 								else {
		 									return callback(0);
		 								}
		 							});
		 						}
		 					});
		 				}
 					});
 				}
 			});
 		}
 	});
 }