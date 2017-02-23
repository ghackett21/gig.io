var app = angular.module("myApp", []);

app.controller("postController", [ '$scope', '$http', function($scope, $http) {

$scope.img = "http://howtodrawdat.com/wp-content/uploads/2014/03/1stpic-lucky-charms-leprechaun.png";
$scope.postsData = [];

/*
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
*/
$scope.usersData  = [
		{
			uid : 1,
            username: "test",
           	description: "test description.",
            avg_rating: 0,
			num_ratings: 0,
            location: "894 N Main St.",
			profile_img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/DU30_small_triambic_icosahedron.png/240px-DU30_small_triambic_icosahedron.png"
        },
        {
			uid : 4,
            username: "sfellers",
           	description: "im sam.",
            avg_rating: 3.23,
			num_ratings: 23,
            location: "839 S Albany Ave.",
			profile_img: "https://d29vij1s2h2tll.cloudfront.net/~/media/images/taco-bell/products/default/22200_burritos_beanburrito_600x600.jpg"
        },
        {
			uid : 5,
            username: "jdoe",
           	description: "im joe.",
            avg_rating: 4.53,
			num_ratings: 73,
            location: "309 S Main St.",
			profile_img: "https://www.pandasinternational.org/wptemp/wp-content/uploads/2012/10/slider1.jpg"
        },
        {
			uid : 3,
            username: "dtrump",
           	description: "im sam.",
            avg_rating: 1.23,
			num_ratings: 13,
            location: "922 S Penn Ave.",
			profile_img: "http://howtodrawdat.com/wp-content/uploads/2014/03/1stpic-lucky-charms-leprechaun.png"
        }
    ];


$scope.getUserData = function(id) {
	for(var i=0;i<$scope.usersData.length;i++){
		if($scope.usersData[i].uid == id){
			return $scope.usersData[i];
		}
	}
};

$scope.getPosts = function(){
	$http.post('/GetAllPosts').then(function(response) {
		console.log(response);
		$scope.postsData = response.data.result;
	});
};

$scope.getUser = function(id){
	$http.post('/user', {"Uid" : id }).then(function(response) {
		console.log(response);
		return response.data.result;
	});
};


}]);

app.controller("loginController", [ '$scope', '$http', function($scope, $http) {
	$scope.user;
	
	$scope.clickButton = function() {

		if($scope.user == undefined){
			return;
		}
		if($scope.user == undefined || $scope.user.username == undefined || $scope.user.password == undefined){
			return;
		}
		console.log("username = " + $scope.user.username);
		console.log("password = " + $scope.user.password);
		$http.post('/login', $scope.user).then(function(response) {
			$scope.user = null;
			console.log(response.status);
			console.log(response);
			if(response.data.status == 200){
				console.log("success");
				console.log("redirect = ", response.data.redirect);
				window.location = response.data.redirect;
			}else if(response.status == 401){
				console.log("failure");
			}
			//load response
		}).catch(function(response) {
			$scope.user = null;
			console.log(response.status);
			console.log(response);
			if(response.status == 401){
				console.log("failure1");
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

app.controller("registrationController", [ '$scope', '$http', function($scope, $http) {
	$scope.user;
	$scope.status = "";
	$scope.clickButton = function() {
		console.log("username = " + $scope.user.username);
		console.log("email = " + $scope.user.email);
		console.log("password = " + $scope.user.password);
		console.log("retyped password = " + $scope.user.password1);
		if($scope.user == undefined){
			return;
		}
		if($scope.user == undefined || $scope.user.username == undefined || $scope.user.email == undefined || $scope.user.password == undefined || $scope.user.password1 == undefined){
			$scope.status = "Make Sure to fill in all fields.";
			return;
		}
		if($scope.user.password != $scope.user.password1){
			$scope.status = "The 2 passwords entered do not match.";
			return;
		}
		if($scope.user.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null){
			$scope.status = "Please enter a valid email";
			return;
		}
		$http.post('/RegisterButton', $scope.user).then(function(response) {
			$scope.user = null;
			$scope.status = "";
			console.log(response);
		});
	};
	
	

}]);

