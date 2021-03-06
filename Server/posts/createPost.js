var connection = require('./../helpers/connection');
var getDate = require('./../helpers/getDate');

/**
 * Creates a new post given the userId of the creator, the location, and the description/title
 * Accepts: UserId, Location, Description
 * Returns: State, PostID
 */
module.exports = function(req, res) {
	console.log("Create Post");
	/* register callback to handle response */
	var callback = function(result) {
		if (result < 0) {
			/* an error occurred */
			res.json({'Response': 'createPost failed', 'PostId': " ", 'State': result});
		}
		else {
			res.json({'Response' : 'createPost successful', 'PostId': result, 'State': 0});
		}
	}
	
	/* check for missing args */
	if (req.body.title == undefined || req.body.location == undefined || req.body.description == undefined) {
		console.log("CreatePost: undefined args, requires Uid, location, and description");
		callback(-1);
	}
	else {
		var imageLink = "";
		if (req.body.imageLink != undefined) {
			imageLink = req.body.imageLink;
		}
	console.log("%s\n%s\n%s\n%s\n%s\n%s\n%s\n",  req.user.Uid, req.body.title, req.body.location, req.body.lat, req.body.lng, req.body.description, imageLink);
		createPost(req.user.Uid, req.body.title, req.body.location, req.body.lat, req.body.lng, req.body.description, imageLink, callback);
	}
}

/**
 * inserts new post into the database 
 */

function createPost(userId, title, location, lat, lng, description, image, callback) {
	console.log("CreatePost: ", userId, location, description);

	var creationTime = getDate();
	var insert = "INSERT INTO Posting (Uid, P_Title, P_Location, P_Lat, P_Long, CreationTime, Status, P_Description, P_Image) VALUES ('" + userId + "', " + connection.escape(title) + ", " + connection.escape(location) + ", " + lat + ", " + lng + ", '" + creationTime + "', 0, " + connection.escape(description) + ", " + connection.escape(image) + ")";  


	connection.query(insert, function (err, rows) {
		if (err) {
			/* database error occured */
			console.log("CreatePost: database error: ", err);
			return callback(-2);
		}
		else {
			/* return the new postId */
			console.log("rows:" + rows);
			return callback(0);
		}
	});
}
