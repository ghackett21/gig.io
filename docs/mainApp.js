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
			if(response.status == 200){
				console.log("success");
				window.location.href = 'http://localhost:8081/index.html';
			}else if(response.status == 401){
				console.log("failure");
				window.location.href = 'http://localhost:8081/login.html';
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

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("mow");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function myMap() {
	var address = '1275 1st Street, West Lafayette, IN, USA';

   var map = new google.maps.Map(document.getElementById('map'), {
       mapTypeId: google.maps.MapTypeId.TERRAIN,
       zoom: 10
   });

   var geocoder = new google.maps.Geocoder();

   geocoder.geocode({
      'address': address
   },
   function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
         new google.maps.Marker({
            position: results[0].geometry.location,
            map: map
         });
         map.setCenter(results[0].geometry.location);
      }
   });

}