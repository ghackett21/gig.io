module.exports =  function(req, res) {

	console.log("sending post login req = %j", req.user);
	//res.json({"status": 200, "redirect" : "/index.html"});
	req.logIn(req.user, function(err) {
			
			if (err) {
				   return res.status(500).json({
				       err: 'Could not log in user'
				   });
			}
			console.log("is auth? + "  + req.isAuthenticated()); 
			req.session.save(() => {
				res.json({"status": 200, "redirect" : "/index.html"});
    		})
	});	
}

/**
 * Search the database for a User with the given username and password,
 * if exactly one user matches, return success.
 */ 
//function login(username, password, callback) {
//	console.log("Login: ", username, password);
//	var select = "SELECT * FROM Users WHERE Username LIKE '" + username + "'";
//	connection.query(select, function(err, rows) {
//		if (err) {
//			/* an error occured */
//			console.log("Login Failed");
//			return callback(-2);
//		}
//		else {
//			if (rows.length == 1) {
//					console.log("password = %s, hash = %s\n", password, rows[0].Password);
//				if(bcrypt.compareSync(password, rows[0].Password)){
//					console.log("Login Successful");
//					return callback(0);
//				}else{
//					console.log("Login Failed: Bad Pass");
//					return callback(-3);
//				}
//			}
//			else {
//				return callback(-2);
//			}
//		}
//	});
//}
