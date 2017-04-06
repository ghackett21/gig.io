var app = angular.module("myUpdateProfileApp", []);

app.controller("updateProfileController", [ '$scope', '$http', function($scope, $http) {
    $scope.user;
     $scope.status = "";

    $scope.update = function() {
        console.log("email = " + $scope.user.email);
        console.log("description = " + $scope.user.description);
        console.log("image link = " + $scope.user.image);
        console.log("phone number = " + $scope.user.phone);

        /* make register request */
        $http.post('/UpdateProfile', $scope.user).then(function(response) {
            $scope.user = null;
            console.log(response);
            if(response.data.State == 0){
                $scope.status = "Update Successful!";
            }
        }).catch(function(response) {
                    console.log("error updating profile");
        });
    }

	$scope.logout = function() {
		$http.post('/logout').then(function(response) {
			console.log("response = %j", response);
			window.location = response.data.redirect;
		});
	};

}]);
