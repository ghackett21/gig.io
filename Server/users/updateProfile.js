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

	
	updateLocation(req.user.Uid, req.body.email, req.body.description, req.body.image, req.body.phone, req.body.location, req.body.lat, req.body.lng, req.body.username, callback);
}

function updateLocation(userId, email, description, profileImage, phoneNumber, location, lat, long, username, callback) {
	console.log("Update userlocation and coordinates");

	if (location != undefined && lat != undefined && long != undefined) {
		var update_location = "Update Users SET U_Location=" + connection.escape(location) + ", U_Lat=" + lat + ", U_Long=" + long + " WHERE Uid=" + userId;

		connection.query(update_location, function(err, rows) { 
			if (err) {
				console.log("Update user loaction: database error " + err);
				return callback(-2);
			}
			else {
					updateUsername(userId, email, description, profileImage, phoneNumber, username, callback);
			}
		});
	}
	else {
		updateUsername(userId, email, description, profileImage, phoneNumber, username, callback);
	}	
}

function updateUsername(userId, email, description, profileImage, phoneNumber, username, callback) {
	console.log("Update username");

	if (username != undefined) {
		var update_username = "Update Users SET Username=" + connection.escape(username) + " WHERE Uid=" + userId;

		connection.query(update_username, function(err, rows) { 
				if (err) {
					console.log("UpdateProfile username: database error: " + err);
					return callback(-2);
				}
				else {
					updateEmail(userId, email, description, profileImage, phoneNumber, callback);
				}
		});
	}
	else {
		updateEmail(userId, email, description, profileImage, phoneNumber, callback);
	}
}

function updateEmail(userId, email, description, profileImage, phoneNumber, callback) {
	console.log("Update email");

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

function updateDescription(userId, description, profileImage, phoneNumber, callback) {
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
		var update_image = "Update Users SET U_Image=" + connection.escape(profileImage) + " WHERE Uid=" + userId;

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