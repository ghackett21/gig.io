var app = angular.module("myUpdateProfileApp", []);

app.controller("updateProfileController", [ '$scope', '$http', function($scope, $http) {
    $scope.user;

    $scope.updateProfile = function() {
        console.log("email = " + $scope.user.email);
        console.log("description = " + $scope.user.description);
        console.log("image link = " + $scope.user.image);
        console.log("phone number = " + $scope.user.phone);

    }

	$scope.logout = function() {
		$http.post('/logout').then(function(response) {
			console.log("response = %j", response);
			window.location = response.data.redirect;
		});
	};

}]);
