/**
 * registrationApp.js
 * This file is the controller for the registration page
 */

var app = angular.module("myApp", []);

app.controller("registrationController", [ '$scope', '$http', function($scope, $http) {
    $scope.user;
    $scope.status = "";
    $scope.register = function() {
        console.log("username = " + $scope.user.username);
        console.log("email = " + $scope.user.email);
        console.log("password = " + $scope.user.password);
        console.log("retyped password = " + $scope.user.password1);
        console.log("phone number = " + $scope.user.phone);
        console.log("location = " + $scope.user.location);

        /* check for empty or incorrectly filled out fields */
        if($scope.user == undefined){
            return;
        }
        else if($scope.user == undefined || $scope.user.username == undefined || $scope.user.email == undefined || $scope.user.password == undefined || $scope.user.password1 == undefined){
            $scope.status = "Make Sure to fill in all fields.";
            return;
        }
        else if($scope.user.password != $scope.user.password1){
            /* make sure passwords match */
            $scope.status = "The 2 passwords entered do not match.";
            return;
        }
        else if($scope.user.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null){
            /* make sure email is valud */
            $scope.status = "Please enter a valid email";
            return;
        }
        else if ($scope.user.location == undefined) {
            /* ensure address has been entered */
            $scope.status = "Address is required";
            return;
        }
        else {
                /* get coordinates of location and make register request */
                getCoordinatesForRegister($scope.user.location);
        }
    };

    function getCoordinatesForRegister(location) {
    console.log("location: " + location);
    /* get coordinates */
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address' : location
    },
    function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var myResult = results[0].geometry.location;
            console.log(myResult.lat() + " , " + myResult.lng());
            $scope.user.lat = myResult.lat();
            $scope.user.lng = myResult.lng();
            console.log("$scope.user: " + $scope.user);

            /* make register request */
            $http.post('/RegisterButton', $scope.user).then(function(response) {
                $scope.user = null;
                console.log(response);
                if(response.data.State == 0){
                    $scope.status = "Registration Successful! Proceed to Login";
                }
            }).catch(function(response) {
                console.log("error registering");
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