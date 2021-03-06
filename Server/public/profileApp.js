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
      var user;
      console.log("profile onload");
    	$http.post('/GetUser').then(function(response) {
    	    console.log(response.data.Result[0]);
     	    user = response.data.Result[0];
      		if(user.Admin == 1){
      				var nav = document.getElementById('secret');
      				nav.innerHTML = "<a href=\"admin.html\">AdminCP</a>";
      		}
     	    var template = document.querySelector('#tmplt');
     	    var clone = template.content.cloneNode(true);
     	    var h1 = clone.querySelectorAll('h1');
            h1[0].innerHTML = user.Username;
            var h3 = clone.querySelectorAll('h3');
            h3[0].innerHTML = user.U_Description;

            /* format post rating so it is only displayed to one decimal */
            var postText = user.AVG_PostRate + "";
            postText = postText.substring(0, postText.indexOf(".") + 2) + " / 5";
            h3[1].innerHTML = 'Post Rating: ' + postText;

            /* format bid rating so it is only displayed to one decimal */
            var bidText = user.AVG_BidRate + "";
            bidText = bidText.substring(0, bidText.indexOf(".") + 2) + " / 5";
            h3[2].innerHTML = 'Bid Rating: ' + bidText;

            h3[3].innerHTML = 'Phone Number: ' + user.PhoneNumber;
            h3[4].innerHTML = 'Email Address: ' + user.EmailAddress;
            h3[5].innerHTML = 'Address: ' + user.U_Location;

            template.parentNode.appendChild(clone);

            var profileImage = document.getElementById('profile_image');

            console.log("Profile image: " + user.U_Image);

            /* display profile image */
            if (user.U_Image != "" && user.U_Image != "null" && user.U_Image != null) {
               profileImage.src = user.U_Image;
            }
            else {
                profileImage.src = "assets/img/defaultImage.png";
            }

            var userInfo = {userId:user.Uid};
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

                      td[0].innerHTML = "<b><a class=\'bidprof-link ng-binding\' style=\"font-size:18px\" onclick=\"angular.element(this).scope().otherUserProfile(" + currRating.UidRater + ")\">" + currRating.Username + "</a></b>";
                      td[1].innerHTML = currRating.RatingValue;
                      td[2].innerHTML = currRating.Comment;

                      // Format date
                      var date = currRating.DateOfRating.substring(5, 7) + "/" +
                          currRating.DateOfRating.substring(8, 10) + "/" +
                          currRating.DateOfRating.substring(0, 4);

                      td[3].innerHTML = date;
                      template.parentNode.appendChild(clone);
                  }
            })
        })
    };

    $scope.otherUserProfile = function(uid) {
        console.log("In viewBidUserProfile");
        console.log(uid);
        localStorage.setItem("userId", uid); 
        window.open("userProfile.html", "_top");
    };
}]);
