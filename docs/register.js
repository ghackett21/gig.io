var app = angular.module("myApp", []);

app.controller("registrationController", [ '$scope', '$http', function($scope, $http) {
  $scope.user;

	$scope.clickButton = function() {

		if($scope.user == undefined || $scope.user.username == undefined || $scope.user.password == undefined){
      return;
		}

		$http.post('/loginButton', $scope.user).then(function(response) {
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

		})
	};
}]);
