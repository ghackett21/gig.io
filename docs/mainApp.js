var app = angular.module("myApp", []);
var distance;

app.controller("postController", function($scope) {

$scope.img = "http://howtodrawdat.com/wp-content/uploads/2014/03/1stpic-lucky-charms-leprechaun.png";

$scope.postsData  = [
        {
            username: "sfellers",
           	description: "rake my yard",
            bid: 8.00,
            location: "872 West Penn St."
        },
        {
            username: "jdoe",
           	description: "take photos of my dog",
            bid: 19.50,
            location: "1600 N Elm Ave."
        },
        {
            username: "dtrump",
           	description: "build a wall",
            bid: 290.00,
            location: "2980 Mexico St."
        }
    ];

$scope.usersData  = [
        {
            username: "sfellers",
           	description: "im sam.",
            avg_rating: 3.23,
			num_ratings: 23,
            location: "839 S Albany Ave.",
			profile_img: "https://d29vij1s2h2tll.cloudfront.net/~/media/images/taco-bell/products/default/22200_burritos_beanburrito_600x600.jpg",
			api_key: "g4fgh2gfhg"
        },
        {
            username: "jdoe",
           	description: "im joe.",
            avg_rating: 4.53,
			num_ratings: 73,
            location: "309 S Main St.",
			profile_img: "https://www.pandasinternational.org/wptemp/wp-content/uploads/2012/10/slider1.jpg"
        },
        {
            username: "dtrump",
           	description: "im sam.",
            avg_rating: 1.23,
			num_ratings: 13,
            location: "922 S Penn Ave.",
			profile_img: "http://howtodrawdat.com/wp-content/uploads/2014/03/1stpic-lucky-charms-leprechaun.png"
        }
    ];

$scope.getUserPic = function(username) {
	//console.log("username is :" + username);
	for(var i=0;i<3;i++){
		//console.log("username: " + $scope.usersData[i].username + "matches : " + username);
		if($scope.usersData[i].username == username){
			//console.log("username match :" + username);
			//console.log("returning profile image :" + $scope.usersData[i].profile_img);
			return $scope.usersData[i].profile_img;
		}
	}
};

});

var arr;
var address;

app.controller("mainController", [ '$scope', '$http', function($scope, $http) {
	$scope.user;
    $scope.test = "test";

//test stuff for server auth
	$scope.logout = function() {
		$http.post('/logout').then(function(response) {
			console.log("response = %j", response);
			window.location = response.data.redirect;
		});
	};

	$scope.testAuth = function() {
		$http.post('/protected').then(function(response) {
			console.log("response = %j", response);
			//window.location = response.data.redirect;
		});
	};

	window.onload = function() {
		$http.post('/GetAllPosts').then(function(response) {
			$scope.user = null;
			$scope.count = response.data.result.length;
			$scope.index = 0;
			arr = response.data.result;
			var postData = [];
			var template = document.querySelector('#tmplt');
			for (var i = 0 ; i < arr.length; i++) {
				$scope.index = i;
				var post = arr[i];
				postData.push(arr[i]);
				var clone = template.content.cloneNode(true);
				var td = clone.querySelectorAll('td');
				td[0].innerHTML = post.P_Description;
				td[1].innerHTML = post.Username;
				td[2].innerHTML = post.P_Location;

                console.log();
				var date = post.CreationTime.substring(0,10);
				var day = date.substring(8,date.length);
				var month = date.substring(5,7);
				var year = date.substring(0,4);

				date = month + "/" + day + "/" + year;

				td[3].innerHTML = date;
				var tr = clone.querySelectorAll('tr');
				tr[0].id = "post-"+i;
				template.parentNode.appendChild(clone);
			}

            // Get the modal
            var modal = document.getElementById('myModal');

            // Get the button that opens the modal
            var rows = document.getElementsByTagName("tr");

            for (var i = 0; i < rows.length; i++) {
                //console.log(postData);
                rows[i].onclick = function() {
                    //console.log(arr);
                    rowID = this.id;
                    var j = 0;
                    var str;
                    for(j; j < rows.length; j++) {
                       str = "post-"+j;
                       if (str === rowID)
                            break;
                    }
                    var post = arr[j];
                    $scope.owner = post.Username;
                    $scope.phone = post.PhoneNumber;
                    $scope.desc = post.U_Description;
					$scope.pid = post.Pid;
                    $scope.location = post.P_Location;
                    address = post.P_Location;
                    modal.style.display = "block";
                    $scope.$apply();
					myMap();
                };
            }
            //var btn = document.getElementById("post-1");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks the button, open the modal
            /*btn.onclick = function() {
                modal.style.display = "block";
            }*/

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
			console.log(response.status);
			console.log(response);
			if(response.status == 200){
				console.log("success");
				//window.location.href = 'http://localhost:8081/index.html';
			}else if(response.status == 401){
				console.log("failure");
				//console.log(response.data);
				//window.location.href = 'http://localhost:8081/login.html';
			}
			//load response
		}).catch(function(response) {
			$scope.user = null;
			console.log(response.status);
			console.log(response);
			if(response.status == 401){
				console.log("failure");
				//window.location.href = 'http://localhost:8081/login.html';
			}
			//load response
		})
	};

	$scope.sortByAge = function() {
	    var time1;
        var time2;
        var temp;
        var swapped;
        $http.post('/GetAllPosts').then(function(response) {
            posts = response.data.result;

            //Sort by date
            do {
                swapped = false;
                for (var i=0; i < posts.length-1; i++) {
                    time1 = new Date(posts[i].CreationTime);
                    time2 = new Date(posts[i+1].CreationTime);

                    if (time1.getTime() < time2.getTime()) {
                        //console.log("I'm In!");
                        var temp = posts[i];
                        posts[i] = posts[i+1];
                        posts[i+1] = temp;
                        swapped = true;
                    }
                }
            } while (swapped);

            var template = document.querySelector('#tmplt');
            for (var i = 0; i < posts.length; i++) {
                var currRow = document.getElementById("post-"+i);
                var td = currRow.querySelectorAll('td');
                td[0].innerHTML = posts[i].P_Description;
                td[1].innerHTML = posts[i].Username;
                td[2].innerHTML = posts[i].P_Location;
            }

            // Get the modal
            var modal = document.getElementById('myModal');

            // Get the button that opens the modal
            var rows = document.getElementsByTagName("tr");

            for (var i = 0; i < rows.length; i++) {
                //console.log(postData);
                rows[i].onclick = function() {
                    //console.log(arr);
                    rowID = this.id;
                    var j = 0;
                    var str;
                    for(j; j < rows.length; j++) {
                       str = "post-"+j;
                       if (str === rowID)
                            break;
                    }
                    var post = posts[j];

                    $scope.owner = post.Username;

                    $scope.phone = post.PhoneNumber;
                    $scope.desc = post.U_Description;
                    $scope.pid = post.Pid;
                    $scope.location = post.P_Location;
                    address = post.P_Location;
                    modal.style.display = "block";
                    $scope.$apply();
                    myMap();
                };
            }
            //var btn = document.getElementById("post-1");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks the button, open the modal
            /*btn.onclick = function() {
                modal.style.display = "block";
            }*/

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }

            console.log(response.status);
            console.log(response);
            if(response.status == 200){
                console.log("success");
                //window.location.href = 'http://localhost:8081/index.html';
            }else if(response.status == 401){
                console.log("failure");
                //console.log(response.data);
                //window.location.href = 'http://localhost:8081/login.html';
            }
            //load response
        }).catch(function(response) {
            //$scope.user = null;
            console.log(response.status);
            console.log(response);
            if(response.status == 401){
                console.log("failure");
                //window.location.href = 'http://localhost:8081/login.html';
            }
            //load response
        })
	};

    $scope.placeBid = function() {
        console.log("button clicked");
    };

}]);

function myMap() {
	var myAddress = address;
	console.log("My Address: " + myAddress);

	console.log(navigator.geolocation.getCurrentPosition(function(position) {
         var pos = {
           lat: position.coords.latitude,
           lng: position.coords.longitude
         };
         console.log(pos);

    }));

   var map = new google.maps.Map(document.getElementById('map'), {
       mapTypeId: google.maps.MapTypeId.TERRAIN,
       zoom: 10
   });

   var geocoder = new google.maps.Geocoder();

   geocoder.geocode({
      'address': myAddress
   },
   function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
         new google.maps.Marker({
            position: results[0].geometry.location,
            map: map
         });
         map.setCenter(results[0].geometry.location);
      }
   });

}

function getMonth(str) {
    console.log(str);
    return str;
}