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
    	$http.post('/GetUser').then(function(response) {
    	    console.log(response.data.Result[0]);
     	    user = response.data.Result[0];
     	    var template = document.querySelector('#tmplt');
     	    var clone = template.content.cloneNode(true);
     	    var h1 = clone.querySelectorAll('h1');
            h1[0].innerHTML = user.Username;
            var h3 = clone.querySelectorAll('h3');
            h3[0].innerHTML = user.U_Description;
            h3[1].innerHTML = 'Post Rating: ' + user.AVG_PostRate + '/5.0';
            h3[2].innerHTML = 'Bid Rating ' + user.AVG_BidRate + '/5.0';
            h3[3].innerHTML = user.PhoneNumber;
            h3[4].innerHTML = user.EmailAddress;
            h3[5].innerHTML = user.U_Location;

            /*var rating = user.AverageRating;

            for(var i = 0; i < rating; i++) {
                AddImage();
            }*/
            template.parentNode.appendChild(clone);


            var profileImage = document.getElementById('profile_image');

            profileImage.addEventListener('error', function(){
                console.log('loading img failed.');  
                profileImage.src = "assets/img/defaultImage.png";
            });

            /* display profile image */
            if (user.U_Image != "") {
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

                      var thisUser = {userId:currRating.UidRater};
                      $http.post("/GetUser", thisUser).then(function(response) {
                            td[0].innerHTML = response.data.Result[0].Username;
                      })
                      td[1].innerHTML = currRating.RatingValue;
                      td[2].innerHTML = currRating.Comment;
                      template.parentNode.appendChild(clone);
                  }
            })
        })
    };
}]);
