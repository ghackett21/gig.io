/**
 * makePostApp.js
 * This file is the controller for the make post page
 */

var app = angular.module("myApp", []);

var mylong;
var mylat;
app.controller("reportController", [ '$scope', '$http', function($scope, $http) {
    $scope.report;
    $scope.status = "";
    
    $scope.report = function() {
        console.log("reason = " + $scope.post.title);
        console.log("description = " + $scope.post.description);
        if($scope.report == undefined){
            return;
        }

        /* ensure all fields have been filled out before submitting */
        if($scope.report == undefined || $scope.report.reason == undefined || $scope.report.description == undefined){
            $scope.status = "Make Sure to fill in all required fields.";
            return;
        }
		$http.post('/createReport', $scope.post).then(function(response) {
                    $scope.report = null;
                    console.log(response);
                    if(response.data.State == 0){
                        $scope.status = "Report submitted successfully.";
                    }
                }).catch(function(response) {
                    console.log("error submitting report");
                });
       
    };
}]);
