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

	
	updateEmail(req.user.Uid, req.body.email, req.body.description, req.body.image, req.body.phone, callback);
}

/**
 * Updates user info in database
 */
function updateEmail(userId, email, description, profileImage, phoneNumber, callback) {
	console.log("UpdateProfile: ", userId, email, description, phoneNumber);

	if (email != undefined) {
		var update_email = "Update Users SET EmailAddress=" + connection.escape(email) + " WHERE Uid=" + userId;

		connection.query(update_email, function(err, rows) { 
				if (err) {
					console.log("UpdateProfile email: database error: " + err);
					return callback(-2);
				}
				else {
					updateDescription(userId, description, profileImage, phoneNumber, callback);
				}
		});
	}
	else {
		updateDescription(userId, description, profileImage, phoneNumber, callback);
	}
}

function updateDescription(userId, dsecription, profileImage, phoneNumber, callback) {
	console.log("Update user description");

	if (description != undefined) {
		var update_description = "Update Users SET U_Description=" + connection.escape(description) + " WHERE Uid=" + userId;

		connection.query(update_description, function(err, rows) { 
			if (err) {
				console.log("Update user description: database error " + err);
				return callback(-2);
			}
			else {
				updateImage(userId, profileImage, phoneNumber, callback);
			}
		});
	}
	else {
		updateImage(userId, profileImage, phoneNumber, callback);
	}
}

function updateImage(userId, profileImage, phoneNumber, callback) {
	console.log("Update user image");

	if (profileImage != undefined) {
		var update_iamge = "Update Users SET U_Image=" + connection.escape(profileImage) + " WHERE Uid=" + userId;

		connection.query(update_image, function(err, rows) { 
			if (err) {
				console.log("Update user image: database error " + err);
				return callback(-2);
			}
			else {
				updatePhone(userId, phoneNumber, callback)
			}
		});
	}
	else {
		updatePhone(userId, phoneNumber, callback)
	}
}

function updatePhone(userId, phoneNumber, callback) {
	console.log("Update user phone number");

	if (phoneNumber != undefined) {
		var update_phone = "Update Users SET PhoneNumber=" + connection.escape(phoneNumber) + " WHERE Uid=" + userId;

		connection.query(update_phone, function(err, rows) { 
			if (err) {
				console.log("Update user phone number: database error " + err);
				return callback(-2);
			}
			else {
					return callback(0);
			}
		});
	}
	else {
		return callback(0);
	}
}