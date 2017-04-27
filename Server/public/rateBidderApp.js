/**
 * makePostApp.js
 * This file is the controller for the make post page
 */

var app = angular.module("myApp", []);

app.controller("rateBidderController", [ '$scope', '$http', function($scope, $http){
    $scope.rating;
    $scope.status = "";
	$scope.show="";
    /* logout user on button press */
    $scope.logout = function() {
        $http.post('/logout').then(function(response) {
            console.log("response = %j", response);
            window.location = response.data.redirect;
        });
    };
    
    $scope.rate = function() {
        console.log("rate bidder");

        console.log("score = " + $scope.rating.score);
        console.log("description = " + $scope.rating.description);
        
        if($scope.rate == undefined){
            return;
        }

        /* ensure all fields have been filled out before submitting */
        if($scope.rating == undefined || $scope.rating.score == undefined || $scope.rating.description == undefined){
            $scope.status = "Make Sure to fill in all required fields.";
            return;
        }


        var rate_req = {"comment":$scope.rating.description, "userId":localStorage.getItem("bidder_userId"), "ratingValue":$scope.rating.score, "postId":localStorage.getItem("postId"), "ratingType":"Bid"};

        console.log("rating: " + rate_req);

        $http.post('/CreateRating', rate_req).then(function(response) {
            $scope.rate = null;
            console.log(response);
            if(response.data.State == 0){
                $scope.status = "Rating submitted successfully. Thank you for your feedback on this user.";
				$scope.show="false";
            }
            else if (response.data.State == -3) {
                $scope.status = "Cannot submit multiple ratings for a single post.";
				$scope.show="false";
            }
        }).catch(function(response) {
            console.log("error submitting rating");
        });
    }; 
}]);
