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
        var Uid = localStorage.getItem("userId");
        console.log("UserId: " + Uid);

        var userToView = {userId:Uid};
        $http.post("/GetUser", userToView).then(function(response) {
            console.log("Hello World");
            console.log(response);
            console.log(response.data.Result[0].Username);
            
            var template = document.querySelector('#tmplt');
            var clone = template.content.cloneNode(true);
            var h1 = clone.querySelectorAll('h1');
            h1[0].innerHTML = response.data.Result[0].Username;
            var h3 = clone.querySelectorAll('h3');
            h3[0].innerHTML = response.data.Result[0].U_Description;

            /* format post rating so it is only displayed to one decimal */
            var postText = response.data.Result[0].AVG_PostRate + "";
            postText = postText.substring(0, postText.indexOf(".") + 2) + "/5";
            h3[1].innerHTML = 'Post Rating: ' + postText;

            /* format bid rating so it is only displayed to one decimal */
            var bidText = response.data.Result[0].AVG_BidRate + "";
            bidText = bidText.substring(0, bidText.indexOf(".") + 2) + "/5";
            h3[2].innerHTML = 'Bid Rating ' + bidText;

            h3[3].innerHTML = response.data.Result[0].PhoneNumber;
            h3[4].innerHTML = response.data.Result[0].EmailAddress;
            template.parentNode.appendChild(clone);
            
            if (localStorage.getItem("userAdmin") == 1){
                var nav = document.getElementById('secret');
                nav.innerHTML = "<a href=\"admin.html\">AdminCP</a>";
            }
            

            var profileImage = document.getElementById('profile_image');

            profileImage.addEventListener('error', function(){
                console.log('loading img failed.');  
                profileImage.src = "assets/img/defaultImage.png";
            });

            /* display profile image */
            if (response.data.Result[0].U_Image != "null" && response.data.Result[0].U_Image != "") {
               profileImage.src = response.data.Result[0].U_Image;
            }
            else {
                profileImage.src = "assets/img/defaultImage.png";
            }

            var userInfo = {userId:Uid};
            console.log(userInfo);
            $http.post('/GetUserRatings', userInfo).then(function(response) {
                var template = document.querySelector('#rating_tmplt');
                var arr = response.data.Result;
                console.log(response.data);
                console.log(arr);
                if(arr == null)
                    return;
                for (var i = 0 ; i < arr.length; i++) {
                    var clone = template.content.cloneNode(true);
                    var td = clone.querySelectorAll('td');
                    var currRating = arr[i];

                    td[0].innerHTML = currRating.Username;
                    td[1].innerHTML = currRating.RatingValue;
                    td[2].innerHTML = currRating.Comment;

                      // Format date
                    var date = currRating.DateOfRating.substring(5, 7) + "/" +
                        currRating.DateOfRating.substring(8, 10) + "/" +
                        currRating.DateOfRating.substring(0, 4);

                    td[3].innerHTML = date;
                    template.parentNode.appendChild(clone);
                }
            });
        })//.catch(function(response) {
            //console.log("error getting user");
        //})
    };
}]);
