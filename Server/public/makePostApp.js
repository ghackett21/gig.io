/**
 * makePostApp.js
 * This file is the controller for the make post page
 */

var app = angular.module("myApp", []);

var mylong;
var mylat;
app.controller("makePostController", [ '$scope', '$http', function($scope, $http) {
    $scope.post;
    $scope.status = "";
	$scope.user;

    /* logout user on button press */
    $scope.logout = function() {
        console.log("logout function called");
        $http.post('/logout').then(function(response) {
            console.log("response = %j", response);
            window.location = response.data.redirect;
        });
    };

    window.onload = function() {
    	$http.post('/GetUser').then(function(response) {
     	    $scope.user = response.data.Result[0];
			if($scope.user.Admin == 1){
					var nav = document.getElementById('secret');
					nav.innerHTML = "<a href=\"admin.html\">AdminCP</a>";
			}
		});
	}

    $scope.makePost = function() {
        console.log("title = " + $scope.post.title);
        console.log("description = " + $scope.post.description);
        console.log("location = " + $scope.post.location);
        console.log("imageLink = " + $scope.post.imageLink);
        
        if($scope.post == undefined){
            return;
        }

        /* ensure all fields have been filled out before submitting */
        if($scope.post == undefined || $scope.post.title == undefined || $scope.post.description == undefined || $scope.post.location == undefined){
            $scope.status = "Make Sure to fill in all required fields.";
            return;
        }

        /* get coordinates of location and send request for create post */
        var myloc = 1;
$scope.post.lat = 1;
            $scope.post.lng = 1;
       // getCoordinatesForMakePost(myloc);
                   $http.post('/CreatePost', $scope.post).then(function(response) {
                $scope.post = null;
                console.log(response);
                if(response.data.State == 0){
                    $scope.status = "Post successfully created! Don't forget to check for bids.";
                }
            }).catch(function(response) {
                console.log("error creating post");
                alert("Error creating post!");
            });
    };

    function getCoordinatesForMakePost(location) {
    console.log("location: " + location);
    /* get coordinates of location */
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address' : location
    },
    function(results, status) {
       if (status == google.maps.GeocoderStatus.OK) {
            var myResult = results[0].geometry.location;
            console.log(myResult.lat() + " , " + myResult.lng());
            $scope.post.lat = myResult.lat();
            $scope.post.lng = myResult.lng();

            console.log("$scope.post: " + $scope.post);

            /* make createPost request */
            $http.post('/CreatePost', $scope.post).then(function(response) {
                $scope.post = null;
                console.log(response);
                if(response.data.State == 0){
                    $scope.status = "Post successfully created! Don't forget to check for bids.";
                }
            }).catch(function(response) {
                console.log("error creating post");
                alert("Error creating post!");
            });
       }
       else {
             /* display message */
            alert("Please enter valid address!");
        }
        
    });

    }
}]);

function myMap(Loc) {
        /* do nothing */
}
