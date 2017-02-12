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
			profile_img: "https://d29vij1s2h2tll.cloudfront.net/~/media/images/taco-bell/products/default/22200_burritos_beanburrito_600x600.jpg"
        },
        {
            username: "sfellers1",
           	description: "im sam.",
            avg_rating: 3.23,
			num_ratings: 23,
            location: "839 S Albany Ave.",
			profile_img: "https://www.pandasinternational.org/wptemp/wp-content/uploads/2012/10/slider1.jpg"
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
	for(var i=0;i<3;i++){
		console.log("username: " + $scope.usersData[i].username + "matches : " + username);
		if($scope.usersData[i].username == username){
			console.log("username match :" + username);
			console.log("returning profile image :" + $scope.usersData[i].profile_img);
			return $scope.usersData[i].profile_img;
		}
	}
};

});


