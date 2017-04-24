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

        /* format post rating so it is only displayed to one decimal */
        var postText = localStorage.getItem("post_rating") + "";
        postText = postText.substring(0, postText.indexOf(".") + 2) + "/5";
        h3[1].innerHTML = 'Post Rating: ' + postText;

        /* format bid rating so it is only displayed to one decimal */
        var bidText = ocalStorage.getItem("bid_rating") + "";
        bidText = bidText.substring(0, bidText.indexOf(".") + 2) + "/5";
        h3[2].innerHTML = 'Bid Rating ' + bidText;

        h3[3].innerHTML = localStorage.getItem("phone");
        h3[4].innerHTML = localStorage.getItem("email");
        template.parentNode.appendChild(clone);
		if(user.Admin == 1){
			var nav = document.getElementById('secret');
			nav.innerHTML = "<a href=\"admin.html\">AdminCP</a>";
		}

        var profileImage = document.getElementById('profile_image');

        profileImage.addEventListener('error', function(){
            console.log('loading img failed.');  
            profileImage.src = "assets/img/defaultImage.png";
        });

        /* display profile image */
        if (localStorage.getItem("profileImage") != "null" && localStorage.getItem("profileImage") != "") {
           profileImage.src = user.U_Image;
        }
        else {
            profileImage.src = "assets/img/defaultImage.png";
        }
    };
}]);
