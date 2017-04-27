/**
 * bankApp.js
 * This file is the controller for the bank info input page
 */

var app = angular.module("myApp", []);

app.controller("bankController", [ '$scope', '$http', function($scope, $http) {
    $scope.user;
    $scope.status = "";
    $scope.addAccount = function() {
      
        /* check for empty or incorrectly filled out fields */
        if($scope.user == undefined){
            return;
        } else if($scope.user == undefined || $scope.user.routingNum == undefined 
            || $scope.user.accountNum == undefined || $scope.user.accountType == undefined 
            || $scope.user.name == undefined){
            $scope.status = "Make Sure to fill in all fields.";
            return;
        }

        console.log("bank submit button clicked");

        //  get dwolla ID from GetUser response
        var Uid = localStorage.getItem("userID");
        Uid = {userId:Uid};
        $http.post('/GetUser', Uid).then(function(response) {
            $scope.user.dwollaID = response.data.Result[0];

            // send info to server
            $http.post('/BankButton', $scope.user).then(function(response) {
                $scope.user = null;
                console.log(response);

                // navigate to login
                window.open("index.html", "_top");
            }).catch(function(response) {
                console.log("error getting banking info");
            });
        });
    };
}]);
