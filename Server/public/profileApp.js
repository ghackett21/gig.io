var app = angular.module("myProfileApp", []);

app.controller("profileController", [ '$scope', '$http', function($scope, $http) {
    $scope.testAuth = function() {
    		$http.post('/protected').then(function(response) {
    			console.log("response = %j", response);
    			//window.location = response.data.redirect;
    		});
    };
	$scope.logout = function() {
		$http.post('/logout').then(function(response) {
			console.log("response = %j", response);
			window.location = response.data.redirect;
		});
	};
    window.onload = function() {
    	$http.post('/GetUser').then(function(response) {
    	    console.log(response.data.Result[0]);
     	    var user = response.data.Result[0];
     	    var template = document.querySelector('#tmplt');
     	    var clone = template.content.cloneNode(true);
     	    var h1 = clone.querySelectorAll('h1');
            h1[0].innerHTML = user.Username;
            var h3 = clone.querySelectorAll('h3');
            h3[0].innerHTML = user.U_Description;
            h3[1].innerHTML = user.PhoneNumber;
            h3[2].innerHTML = user.EmailAddress;

            /*var rating = user.AverageRating;

            for(var i = 0; i < rating; i++) {
                AddImage();
            }*/
            template.parentNode.appendChild(clone);
        })
    };
}]);
