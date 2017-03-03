/**
* Create a new Rating
* Accepts: ratingType ("Bid" or "Post"), Comment, userIdRater, userId, ratingValue 
* Returns: State
*/
module.exports = function(req, res){
	console.log("CreateRating");

	/* callback to handle response */
	var callback = function(result) {
		if (result < 0) {
				res.json({"Response": "CreateRating failed", "State": result });
			}
			else {
				res.json({"Response": "CreateRating successful", "State": result });
			}
	}

	/* check for undefined args */
	if (req.body.comment == undefined || req.body.userId == undefined || req.body.userIdRater == undefined || req.body.ratingValue == undefined) {
		console.log("CreateRating: undefined args: requires ratingType, userId, userIdRater, and comment");
		callback(-1);
	}
	else if (req.body.ratingType != "Bid" && req.body.ratingType != "Posting") {
		/* check that rating type is valid */
		console.log("CreateRating: ratingType must be either \"Bid\" or \"Post\".");
		callback(-1);
	}
	else if (req.body.userId == req.body.userIdRater) {
		/* check that userId and userIdRater are not equal */
		console.log("CreateRating: a user cannot rate themselves!");
		return callback(-1);
	}
	else {
		createRating(req.body.ratingType, req.body.userId, req.body.userIdRater, req.body.comment, req.body.ratingValue, callback);
	}
}

function createRatingHelper(ratingType, userId, userIdRater, comment, ratingValue, callback) {
	console.log("CreateRating: ratingType: " + ratingType + ", userId: " + userId + ", userIdRater: " + userIdRater + ", comment: " + comment + ", ratingValue: " + ratingValue);

	var insert = "INSERT INTO RATINGS (Uid, Comment, UidRater, DateOfRating, RatingType, RatingValue) VALUES (" + userId + ", '" + comment + "', " + userIdRater + ", '" + GetDate() + "', '" + ratingType + "', " + ratingValue + ")";

	connection.query(insert, function(err, rows) { 
		if (err) {
			console.log("CreateRating: database error: " + err);
			return callback(-2);
		}
		else {
			/* update rated user's avg rating and number of ratings for the type of rating */
			var avg = "AVG_PostRate";
			var num = "NUM_PostRate";
			if (ratingType == "Bid") {
				avg = "AVG_BidRate";
				num = "NUM_BidRate";
			}

			var select = "SELECT " + avg + ", " + num + " FROM Users WHERE Uid LIKE " + userId;

			connection.query(select, function(err, rows) {
				if (err) {
					console.log("CreateRating: database error: " + err);
					return callback(-2);
				}
				else {
					if (ratingType == "Post") {
						num_ratings = rows[0].NUM_PostRate;
						avg_rating = rows[0].AVG_PostRate
					}
					else {
						num_ratings = rows[0].NUM_BidRate;
						avg_rating = rows[0].AVG_BidRate
					}

					/* update number and calculate new average */
					num_ratings += 1;
					avg_rating = avg_rating * ((num_ratings - 1) / num_ratings) + ratingValue * (1 / num_ratings);

					console.log("Update: avg_rating: " + avg_rating + ", num_ratings " + num_ratings);

					var update = "UPDATE Users SET " + avg + "=" + avg_rating + "," + num + "=" + num_ratings + " WHERE Uid=" + userId;

					connection.query(update, function(err, rows) {
						if (err) {
							console.log("CreateRating: database error: " + err);
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
