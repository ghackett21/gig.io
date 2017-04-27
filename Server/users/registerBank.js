var bcrypt = require('bcrypt');
var connection = require('./../helpers/connection');
var getDate = require('./../helpers/getDate');
var appToken = require('./../helpers/dwollaClient');

/**
 * Register a funding source with dwolla and store the funding source's id in the
 * database
 */
module.exports = function(req, res) {
	console.log("registerBank");
	/* callback function to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occured */
			res.json({"Resonse": "registerBank failed", "Uid": " ", "State": result});
		}
		else {
			res.json({"Response": "registerBank successful", "Uid": result, "State": 0});
		}
	}

	/* check for missing args */
	if (req.body.routingNum == undefined || req.body.accountNum == undefined || req.body.accountType == undefined || req.body.name == undefined) {
		console.log("registerBank: undefined args");
		callback(-1);
	}
	else {
		registerBank(req.body, callback);
	}
}

/**
 * Creates funding source with given information
 */
function registerBank(user, callback) {
	
	console.log("registerBank: ", user.routingNum, user.accountNum, user.accountType, user.name);
	
	/* check for existing user with username */
/*	var select = "SELECT * FROM Users WHERE username LIKE " + connection.escape(user.username);

	connection.query(select, function(err, rows) {
		if (err) {
			console.log("registerBank Failed: ", err);
			return callback(-2);
		}
		else {
*/
			/* if user with username already exists... */
			/*if (rows.length > 0) {
				console.log("user exists")
				return callback(-3);
			}*/
			//else {
                // Send account info to dwolla
                var requestBody = {
                    routingNumber: user.routingNum,
                    accountNumber: user.accountNum,
                    type: user.accountType,
                    name: user.name
                };

                var requestURL = "https://api-sandbox.dwolla.com/customers/" + user.dwollaID.dwollaUID + "/funding-sources"; 

                appToken.post(requestURL, requestBody).then(function(res) {
                    var paySourceID = res.headers.get('location');
                    paySourceID = paySourceID.replace("https://api-sandbox.dwolla.com/funding-sources/", "");

                    console.log(paySourceID);

    				//var selectUserId = "SELECT Uid from Users WHERE Username=" + connection.escape(user.username) + " AND Password='" + hash + "'";
				    //var insert = "INSERT INTO Users (Username, Password, EmailAddress, PhoneNumber, NumberOfStrikes, NUM_BidRate, NUM_PostRate, AVG_BidRate, AVG_PostRate, DateJoined, U_Location, U_Lat, U_Long, dwollaUID) VALUES (" + connection.escape(user.username) + ", '" + hash + "'," + connection.escape(user.email) + "," + connection.escape(user.phone) + " , 0, 0, 0, 0, 0, '" + getDate() + "', " + connection.escape(user.location) + ", " + user.lat + ", " + user.lng + ", " + connection.escape(dwollaID) + ")";
                    
                    var insert = "UPDATE Users SET dwollaPaySourceID=" + connection.escape(paySourceID) + " WHERE dwollaUID=" + connection.escape(user.dwollaID.dwollaUID);
                    console.log(insert);

				    connection.query(insert, function(err, rows) {
					    if (err) {
						    /* an error occured */
						    console.log("RegisterBank Failed", err);
						    return callback(-2);
					    }
					    else {
						    console.log("RegisterBank Successful");
						    return callback(0);

					    }
				    });
                });
			//}
//		}
	//});
}
