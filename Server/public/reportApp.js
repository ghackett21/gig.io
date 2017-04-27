/**
 * reportApp.js
 * This file is the controller for the report page
 */

var app = angular.module("myApp", []);

app.controller("reportController", [ '$scope', '$http', function($scope, $http) {
    $scope.report;
    $scope.status = "";
	$scope.show="";
   window.onload = function() {
            if (localStorage.getItem("userAdmin") == 1){
                var nav = document.getElementById('secret');
                nav.innerHTML = "<a href=\"admin.html\">AdminCP</a>";
            }
    }

    $scope.report = function() {
        console.log("reason = " + $scope.report.reason);
        console.log("description = " + $scope.report.description);
        if($scope.report == undefined){
            return;
        }

        /* ensure all fields have been filled out before submitting */
        if($scope.report == undefined || $scope.report.reason == undefined || $scope.report.description == undefined){
            $scope.status = "Make Sure to fill in all required fields.";
            return;
        }
		var report_req = {"comment":$scope.report.description,"userId":localStorage.getItem("userId"),"type":$scope.report.reason};

		console.log("report: "+ report_req);
		console.log("comment: "+$scope.report.description);
		console.log("userId (user being reported): "+localStorage.getItem("userId"));
		console.log("type: "+$scope.report.reason);
		$http.post('/createReport', report_req).then(function(response) {
                    $scope.report = null;
                    console.log(response);
                    if(response.data.State == 0){
                        $scope.status = "Report submitted successfully.";
						$scope.show="false";
                    }
                }).catch(function(response) {
                    console.log("error submitting report");
                });
       
    };
}]);
