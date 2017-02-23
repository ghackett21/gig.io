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
			profile_img: "https://d29vij1s2h2tll.cloudfront.net/~/media/images/taco-bell/products/default/22200_burritos_beanburrito_600x600.jpg",
			api_key: "g4fgh2gfhg"
        },
        {
            username: "jdoe",
           	description: "im joe.",
            avg_rating: 4.53,
			num_ratings: 73,
            location: "309 S Main St.",
			profile_img: "https://www.pandasinternational.org/wptemp/wp-content/uploads/2012/10/slider1.jpg"
        },
        {
            username: "dtrump",
           	description: "im sam.",
            avg_rating: 1.23,
			num_ratings: 13,
            location: "922 S Penn Ave.",
			profile_img: "http://howtodrawdat.com/wp-content/uploads/2014/03/1stpic-lucky-charms-leprechaun.png"
        }
    ];

$scope.getUserPic = function(username) {
	//console.log("username is :" + username);
	for(var i=0;i<3;i++){
		//console.log("username: " + $scope.usersData[i].username + "matches : " + username);
		if($scope.usersData[i].username == username){
			//console.log("username match :" + username);
			//console.log("returning profile image :" + $scope.usersData[i].profile_img);
			return $scope.usersData[i].profile_img;
		}
	}
};

});

app.controller("mainController", [ '$scope', '$http', function($scope, $http) {
	$scope.user;
    $scope.test = "test";

//test stuff for server auth
	$scope.testAuth = function() {
		$http.get('/protected').then(function(response) {
			console.log("protected response = %j", response);
		});
	};

	window.onload = function() {

		/*if($scope.user == undefined){
			console.log("Scope user undefined");
			return;
		}
		if($scope.user == undefined || $scope.user.username == undefined || $scope.user.password == undefined){
			console.log("Other undefined stuff");
			return;
		}
		console.log("username = " + $scope.user.username);
		console.log("password = " + $scope.user.password);
		*/
		$http.post('/GetAllPosts').then(function(response) {
			$scope.user = null;
			$scope.location = response.data.result[1].Location;
			$scope.desc = response.data.result[1].Description;
			console.log("Number of returned elements: " + response.data.result.length);
			console.log(response.status);
			console.log(response);
			if(response.status == 200){
				console.log("success");
				//window.location.href = 'http://localhost:8081/index.html';
			}else if(response.status == 401){
				console.log("failure");
				//console.log(response.data);
				//window.location.href = 'http://localhost:8081/login.html';
			}
			//load response
		}).catch(function(response) {
			$scope.user = null;
			console.log(response.status);
			console.log(response);
			if(response.status == 401){
				console.log("failure");
				//window.location.href = 'http://localhost:8081/login.html';
			}
			//load response
		})
		/*
		$http.post('/api/authenticate', $scope.user.api_key).then(function(response) {
			$scope.user = null;
			console.log(response);
		});
		*/
	};
}]);
