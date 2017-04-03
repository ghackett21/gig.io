var connection = require('./../helpers/connection');

/** 
 * Updates a user's profile information in the database 
 * Accepts: Username, password, Email, description, profile image, location, phone number
 * Returns: state
 */
module.exports = function(req, res) {
	console.log("UpdateProfile");

	/* register callback to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occured */
			res.json({'Response': 'update failed', 'State': result});
		}
		else {
			res.json({'Response' : 'update successful', 'State': result});
		}
	}

	/* check for missing args */
	if (req.body.userId == undefined || req.body.Email == undefined || req.body.Description == undefined || req.body.ProfileImage == undefined || req.body.PhoneNumber == undefined) {
		console.log("Update Profile: undefined args");
		callback(-1);
	}
	else {
		updateProfile(req.body.userId, req.body.Email, req.body.Description, req.body.ProfileImage, req.body.PhoneNumber, callback);
	}
}

/**
 * Updates user info in database
 */
function updateProfile(userID, username, email, description, profileImage, location, phoneNumber, callback) {
	console.log("UpdateProfile: ", userId, email, description, location, phonenNumber);

	var update = "UPDATE Users SET EmailAddress='" + email + "', Description='" + description + "', PhoneNumber='" + phoneNumber + "' WHERE Uid=" + userId;

	connection.query(update, function(err, rows) {
		if (err) {
			console.log("UpdateProfile: database error:" + err);

			return callback(-2);
		}
		else {
			return callback(0);
		}
	});
}