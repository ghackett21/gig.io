

/* create database connection */
var connection = mysql.createConnection({
	host     : 	"mydb.itap.purdue.edu",
	user     : 	"sfellers",
	password : 	"Te5UVB7vvR7SjJ6y",
	database : 	"sfellers"
});

/* connect to database */
connection.connect(function(err) {
	if (err) {
		console.log("Error connecting to database!", err);
	}
	else {
		console.log("connection to database successful");
	}
});

module.exports = connection;