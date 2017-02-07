var app = angular.module("myApp", []);

app.controller("postController", function($scope) {

$scope.img = "http://howtodrawdat.com/wp-content/uploads/2014/03/1stpic-lucky-charms-leprechaun.png";

$scope.postsData  = [
        {
            username: "sfellers",
           	description: "rake my yard",
            bid: 8.00,
            location: "872 West Penn St."
        },
        {
            username: "jdoe",
           	description: "take photos of my dog",
            bid: 19.50,
            location: "1600 N Elm Ave."
        },
        {
            username: "dtrump",
           	description: "build a wall",
            bid: 290.00,
            location: "2980 Mexico St."
        }
    ];

$scope.usersData  = [
        {
            username: "sfellers",
           	description: "im sam.",
            avg_rating: 3.23,
			num_ratings: 23,
            location: "839 S Albany Ave.",
			profile_img: "http://howtodrawdat.com/wp-content/uploads/2014/03/1stpic-lucky-charms-leprechaun.png"
        },
        {
            username: "sfellers1",
           	description: "im sam.",
            avg_rating: 3.23,
			num_ratings: 23,
            location: "839 S Albany Ave.",
			profile_img: "http://howtodrawdat.com/wp-content/uploads/2014/03/1stpic-lucky-charms-leprechaun.png"
        },
        {
            username: "sfellers2",
           	description: "im sam.",
            avg_rating: 3.23,
			num_ratings: 23,
            location: "839 S Albany Ave.",
			profile_img: "http://howtodrawdat.com/wp-content/uploads/2014/03/1stpic-lucky-charms-leprechaun.png"
        }
    ];

$scope.getUserPic = function(username) {
	console.log("username is :" + username);
};

});


