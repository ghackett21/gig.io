/**
 * makePostApp.js
 * This file is the controller for the make post page
 */

var app = angular.module("myApp", []);

app.controller("rateController", [ '$scope', '$http', function($scope, $http){
    $scope.rating;
    $scope.status = "";
    $scope.rate = function() {
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

        console.log("rate: " + $scope.rating);

        $http.post('/CreateRating', $scope.rating).then(function(response) {
                    $scope.rate = null;
                    console.log(response);
                    if(response.data.State == 0){
                        $scope.status = "Rating submitted successfully. Thank you for your feedback on this user.";
                    }
                }).catch(function(response) {
                    console.log("error submitting rating");
                });
       
    };
    

}]);
