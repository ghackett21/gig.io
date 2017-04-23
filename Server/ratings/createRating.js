var getDate = require('./../helpers/getDate');
var connection = require('./../helpers/connection');

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
	if (req.body.comment == undefined || req.body.userId == undefined || req.body.ratingValue == undefined || req.body.postId == undefined) {
		console.log("CreateRating: undefined args: requires ratingType, userId, userIdRater, postId, and comment");
		callback(-1);
	}
	else if (req.body.ratingType != "Bid" && req.body.ratingType != "Posting") {
		/* check that rating type is valid */
		console.log("CreateRating: ratingType must be either \"Bid\" or \"Post\".");
		callback(-1);
	}
	else if (req.body.userId == req.user.Uid) {
		/* check that userId and userIdRater are not equal */
		console.log("CreateRating: a user cannot rate themselves!");
		return callback(-1);
	}
	else {
		createRatingHelper(req.body.ratingType, req.body.userId, req.user.Uid, req.body.comment, req.body.ratingValue, req.body.postId, callback);
	}
}

function createRatingHelper(ratingType, userId, userIdRater, comment, ratingValue, postId, callback) {
	console.log("CreateRating: ratingType: " + ratingType + ", userId: " + userId + ", userIdRater: " + userIdRater + ", comment: " + comment + ", ratingValue: " + ratingValue);

	var insert = "INSERT INTO RATINGS (Uid, Comment, UidRater, DateOfRating, RatingType, RatingValue) VALUES (" + userId + ", '" + comment + "', " + userIdRater + ", '" + getDate() + "', '" + ratingType + "', " + ratingValue + ")";

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
					/* update user average ratings */
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
							/* retrieve post rating state */
							var selectRatingState = "SELECT RatingState, Uid, Winning_Uid FROM Posting WHERE PID=" + postId;

							connection.query(selectRatingState, function(err, rows) {
								if (err) {
									console.log("CreateRating: error getting post info: " + err);
									return callback(-2);
								}
								else {
									var ratingState = rows[0].RatingState;

									/* rating states:
										0: no rating for post 
										1: only post creator has filed rating
										2: only winning bidder has filed rating
										3: both post craetor and winning bidder have filed reivews for this post 
									*/

									if (ratingState == 3) {
										console.log("Ratings for this post have already been submitted, cannot submit more than one rating per user per post.");
										/* return -3 special state */
										console.log(-3);
									}

									if (userId == rows[0].Uid) {
										/* reviewer is post create */
										if (ratingState == 0) {
											ratingState = 1;
										}
										else if (ratingState == 2) {
											ratingState = 3;
										}
									}
									else if (userId == rows[0].Winning_Uid) {
										if (ratingState == 0) {
											ratingState = 2;
										}
										else if (ratingState == 1) {
											ratingState = 3;
										}
									}
									else {
										console.log("Reviewer is neither post creator nor winning bidder!");
										return callback(-2);
									}

									/* update rating state of post */
									var updateRatingState = "UPDATE Posting SET RatingState=" + ratingState + " WHERE PID=" + postId;

									connection.query(updateRatingState, function(err, rows) {
										if (err) {
											console.log("CreateRating: error update post ratingState: " + err);
											return callback(-2);
										}
										else {
											console.log("CreateRating successful!");
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
