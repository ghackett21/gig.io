/**
 * makePostApp.js
 * This file is the controller for the make post page
 */

var app = angular.module("myApp", []);

app.controller("rateController", [ '$scope', '$http', function($scope, $http){
    $scope.rate;
    $scope.status = "";
    $scope.rate = function() {
        console.log("score = " + $scope.rate.score);
        console.log("description = " + $scope.rate.description);
        
        if($scope.rate == undefined){
            return;
        }

        /* ensure all fields have been filled out before submitting */
        if($scope.rate == undefined || $scope.rate.score == undefined || $scope.rate.description == undefined){
            $scope.status = "Make Sure to fill in all required fields.";
            return;
        }
        $http.post('/CreateRating', $scope.rate).then(function(response) {
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
