var app = angular.module("userProfileApp", []);

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
        var user = localStorage.getItem("username");
        var template = document.querySelector('#tmplt');
        var clone = template.content.cloneNode(true);
        var h1 = clone.querySelectorAll('h1');
        h1[0].innerHTML = user;
        var h3 = clone.querySelectorAll('h3');
        h3[0].innerHTML = localStorage.getItem("description");
        h3[1].innerHTML = 'Post Rating: ' + localStorage.getItem("post_rating") + '/5.0';
        h3[2].innerHTML = 'Bid Rating ' + localStorage.getItem("bid_rating") + '/5.0';
        h3[3].innerHTML = localStorage.getItem("phone");
        h3[4].innerHTML = localStorage.getItem("email");
        template.parentNode.appendChild(clone);
        if (localStorage.getItem("profileImage") != null && localStorage.getItem("profileImage") != "") {
           document.getElementById("profile_image").src = localStorage.getItem("profileImage");
        }
        else {
            document.getElementById("profile_image").src = "assets/img/girl.png";
        }
    };
}]);
