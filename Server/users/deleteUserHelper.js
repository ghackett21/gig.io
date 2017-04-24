
 module.exports = function(userId, callback) {
 	console.log("Delete User: userId " + userId);

 	var select = "DELETE FROM Users WHERE Uid LIKE '" + userId + "'";

 	connection.query(select, function(err, rows) {
 		if (err) {
 			console.log("DeleteUser: database error: " + err);
 			return callback(-2);
 		}
 		else {
 			return callback(0);
 		}
 	});
 }