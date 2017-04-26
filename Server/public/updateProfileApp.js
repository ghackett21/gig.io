var app = angular.module("myUpdateProfileApp", []);

app.controller("updateProfileController", [ '$scope', '$http', function($scope, $http) {
    $scope.user;
    $scope.status = "";

    $scope.update = function() {
        console.log($scope.user);
        if ($scope.user != null) {
            console.log("email = " + $scope.user.email);
            console.log("description = " + $scope.user.description);
            console.log("image link = " + $scope.user.image);
            console.log("phone number = " + $scope.user.phone);
            console.log("location = " + $scope.user.location);
            console.log("username = " + $scope.user.username);
			if($scope.user.Admin == 1){
					var nav = document.getElementById('secret');
					nav.innerHTML = "<a href=\"admin.html\">AdminCP</a>";
			}

            if($scope.user.email != undefined && $scope.user.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null){
                /* make sure email is valud */
                alert("Please enter a valid email address");
                return;
            }

            if (/\S/.test($scope.user.description)) {
                $scope.user.description = undefined;
            }

            if ($scope.user.image == "") {
                $scope.user.image = undefined;
            }

            if ($scope.user.location == undefined) {
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
            else {
                getCoordinatesForUpdateProfile($scope.user.location);
            }
        }
    }

    function getCoordinatesForUpdateProfile(location) {
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
        else {
            /* display message */
            alert("Please enter valid address!");
        }
    });

    }

	$scope.logout = function() {
		$http.post('/logout').then(function(response) {
			console.log("response = %j", response);
			window.location = response.data.redirect;
		});
	};

}]);

function myMap(Loc) {
    /* do nothing */
}
