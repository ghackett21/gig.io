var app = angular.module("myPostApp", []);
var distance;

//var directionsService = new google.maps.DirectionsService();

var arr;
var address;
var myUser;
var loc_distance;
var expanded = 0;

app.controller("userPostController", [ '$scope', '$http', function($scope, $http) {
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
        $http.post('/GetUser').then(function(response) {
                        //console.log(response.data.Result[0]);
                        myUser = response.data.Result[0];
        })

		$http.post('/getUserPosts').then(function(response) {
			//$scope.user = null;
			console.log(response);
			console.log(response.data.Result.length);
			$scope.count = response.data.Result.length;
			console.log(response.data.Result.length);
			$scope.index = 0;
			arr = response.data.Result;
			var postData = [];
			var template = document.querySelector('#tmplt');
			for (var i = 0 ; i < arr.length; i++) {
				$scope.index = i;
				var post = arr[i];
				postData.push(arr[i]);
				var clone = template.content.cloneNode(true);
				var td = clone.querySelectorAll('td');

				console.log(post.P_Description);
				console.log(post.Username);
				console.log(post.P_Location);

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
            var rows = document.getElementById("postTable").rows;

            for (var i = 0; i < rows.length; i++) {
                //console.log(postData);
                rows[i].onclick = function() {
                    //console.log(arr);

                    /* check that a row is not already expanded */
                    if (expanded == 0) {
                        /* set flag */
                        expanded = 1;
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
                         // Load bid history for current post
                        var bidData = new Object();
                        bidData.PostId = post.Pid;
                        $http.post("/GetBids", bidData).then(function(response) {

                            var bids = response.data.Result;
                            var bidData = []
                            var template = document.querySelector('#bidTemplate');
                            while(template.parentNode.hasChildNodes()) {
                                if (template.parentNode.lastChild == template)
                                    break;
                                template.parentNode.removeChild(template.parentNode.lastChild);
                            }
                            for (var i = 0; i < bids.length; i++) {

                                // Format date
                                var date = bids[i].BidTime.substring(5, 7) + "/" +
                                           bids[i].BidTime.substring(8, 10) + "/" +
                                           bids[i].BidTime.substring(0, 4) + ", " +
                                           bids[i].BidTime.substring(11, 16);

                                var clone = template.content.cloneNode(true);
                                var td = clone.querySelectorAll('td');
                                td[0].innerHTML = date; //bids[i].BidTime;
                                td[1].innerHTML = bids[i].Username;
                                td[2].innerHTML = "$" + bids[i].Amount;
                                template.parentNode.appendChild(clone);
                            }
                            myMap(myUser.U_Location);

                        }).catch(function(response) {
                            console.log("error getting bids");
                        })
                    }
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
                /* set flag */
                expanded = 0;
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                    /* set flag */
                    expanded = 0;
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
        $http.post('/getUserPosts').then(function(response) {
            posts = response.data.Result;

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
                var date = posts[i].CreationTime.substring(0,10);
                var day = date.substring(8,date.length);
                var month = date.substring(5,7);
                var year = date.substring(0,4);

                date = month + "/" + day + "/" + year;

                td[3].innerHTML = date;
            }

            // Get the modal
            var modal = document.getElementById('myModal');

            // Get the button that opens the modal
            var rows = document.getElementById("postTable").rows;

            for (var i = 0; i < rows.length; i++) {
                //console.log(postData);
                rows[i].onclick = function() {
                    if (expanded == 0) {
                        /* set flag */
                        expanded = 1;
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
                         // Load bid history for current post
                        var bidData = new Object();
                        bidData.PostId = post.Pid;
                        $http.post("/GetBids", bidData).then(function(response) {

                            var bids = response.data.Result;
                            var bidData = []
                            var template = document.querySelector('#bidTemplate');
                            while(template.parentNode.hasChildNodes()) {
                                if (template.parentNode.lastChild == template)
                                    break;
                                template.parentNode.removeChild(template.parentNode.lastChild);
                            }
                            for (var i = 0; i < bids.length; i++) {

                                // Format date
                                var date = bids[i].BidTime.substring(5, 7) + "/" +
                                           bids[i].BidTime.substring(8, 10) + "/" +
                                           bids[i].BidTime.substring(0, 4) + ", " +
                                           bids[i].BidTime.substring(11, 16);

                                var clone = template.content.cloneNode(true);
                                var td = clone.querySelectorAll('td');
                                td[0].innerHTML = date; //bids[i].BidTime;
                                td[1].innerHTML = bids[i].Username;
                                td[2].innerHTML = "$" + bids[i].Amount;
                                template.parentNode.appendChild(clone);
                            }
                            myMap(myUser.U_Location);

                        }).catch(function(response) {
                            console.log("error getting bids");
                        })
                    }
                };
            }
            //var btn = document.getElementById("post-1");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks the button, open the modal

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                /* set flag */
                expanded = 0;
                modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    /* set flag */
                    expanded = 0;
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

$scope.sortByLowestBid = function() {
	    var bidVal1;
        var bidVal2;
        var temp;
        var swapped;
        $http.post('/getUserPosts').then(function(response) {
            posts = response.data.Result;

            //Sort by date
            do {
                swapped = false;
                for (var i=0; i < posts.length-1; i++) {
                    bidVal1 = posts[i].NumberOfBids;
                    bidVal2 = posts[i+1].NumberOfBids;

                    if (bidVal1 < bidVal2) {
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
                var date = posts[i].CreationTime.substring(0,10);
                var day = date.substring(8,date.length);
                var month = date.substring(5,7);
                var year = date.substring(0,4);

                date = month + "/" + day + "/" + year;

                td[3].innerHTML = date;
            }

            // Get the modal
            var modal = document.getElementById('myModal');

            // Get the button that opens the modal
            var rows = document.getElementById("postTable").rows;

            for (var i = 0; i < rows.length; i++) {
                //console.log(postData);
                rows[i].onclick = function() {
                    if (expanded == 0) {
                        /* set flag */
                        expanded = 1;
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

                        // Load bid history for current post
                        var bidData = new Object();
                        bidData.PostId = post.Pid;
                        $http.post("/GetBids", bidData).then(function(response) {

                            var bids = response.data.Result;
                            var bidData = []
                            var template = document.querySelector('#bidTemplate');
                            while(template.parentNode.hasChildNodes()) {
                                if (template.parentNode.lastChild == template)
                                    break;
                                template.parentNode.removeChild(template.parentNode.lastChild);
                            }
                            for (var i = 0; i < bids.length; i++) {

                                // Format date
                                var date = bids[i].BidTime.substring(5, 7) + "/" +
                                           bids[i].BidTime.substring(8, 10) + "/" +
                                           bids[i].BidTime.substring(0, 4) + ", " +
                                           bids[i].BidTime.substring(11, 16);

                                var clone = template.content.cloneNode(true);
                                var td = clone.querySelectorAll('td');
                                td[0].innerHTML = date; //bids[i].BidTime;
                                td[1].innerHTML = bids[i].Username;
                                td[2].innerHTML = "$" + bids[i].Amount;
                                template.parentNode.appendChild(clone);
                            }

                            /* set bid onlick() */
                            var bidRows = document.getElementById("bid-table").rows;

                            for var j = 0; j < bidRows.length; j++) {
                                bidRows[i].onclick() = function() {
                                    console.log("bid " + i + " clicked!");
                                }
                            }

                            myMap(myUser.U_Location);

                        }).catch(function(response) {
                            console.log("error getting bids");
                        })
                    }
                };
            }
            //var btn = document.getElementById("post-1");

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks the button, open the modal

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                /* set flag */
                expanded = 0;
                modal.style.display = "none";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    /* set flag */
                    expanded = 0;
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

	$scope.sortByDistance = function() {
        	    var time1;
                var time2;
                var temp;
                var swapped;
                $http.post('/getUserPosts').then(function(response) {
                    posts = response.data.Result;

                    do {
                        swapped = false;
                        for (var i=0; i < posts.length-1; i++) {
                            dist1 = getDistanceFromLatLonInKm(posts[i].P_Lat, posts[i].P_Long, myUser.U_Lat, myUser.U_Long)

                            dist2 = getDistanceFromLatLonInKm(posts[i+1].P_Lat, posts[i+1].P_Long, myUser.U_Lat, myUser.U_Long);

                            if (dist1 < dist2) {
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
                            myMap(myUser.U_Location);
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

                    //console.log(response.status);
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

	$scope.sortByNumOfBids = function() {
    	    var time1;
            var time2;
            var temp;
            var swapped;
            $http.post('/getUserPosts').then(function(response) {
                posts = response.data.Result;

                //Sort by date
                do {
                    swapped = false;
                    for (var i=0; i < posts.length-1; i++) {
                        nbids1 = new Date(posts[i].NumberOfBids);
                        nbids2 = new Date(posts[i+1].NumberOfBids);

                        if (nbids1 < nbids2) {
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
                    var date = posts[i].CreationTime.substring(0,10);
                    var day = date.substring(8,date.length);
                    var month = date.substring(5,7);
                    var year = date.substring(0,4);

                    date = month + "/" + day + "/" + year;

                    td[3].innerHTML = date;
                }

                // Get the modal
                var modal = document.getElementById('myModal');

                // Get the button that opens the modal
                var rows = document.getElementById("postTable").rows;

                for (var i = 0; i < rows.length; i++) {
                    //console.log(postData);
                    rows[i].onclick = function() {
                        if (expanded == 0) {
                            /* set flag */
                            expanded = 1;
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
                        }
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
                    /* set flag */
                    expanded = 0;
                    modal.style.display = "none";
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        /* set flag */
                        expanded = 0;
                        modal.style.display = "none";
                    }
                }

                //console.log(response.status);
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

}]);

function myMap(loc) {
    console.log("Loc: " + loc);
	var myAddress = address;
	console.log("My Address: " + myAddress);

    /* make sure the loc and address are not null */
    if (loc != undefined && myAddress != undefined) {

        var request = {
          origin      : loc, // a city, full address, landmark etc
          destination : myAddress,
          travelMode  : google.maps.DirectionsTravelMode.DRIVING
        };

        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
          if ( status == google.maps.DirectionsStatus.OK ) {
            console.log( response.routes[0].legs[0].distance.value ); // the distance in metres
          }
          else {
            // oops, there's no route between these two locations
            // every time this happens, a kitten dies
            // so please, ensure your address is formatted properly
          }
        });

    	/*console.log(navigator.geolocation.getCurrentPosition(function(position) {
             var pos = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
             };
             console.log(pos);

        }));*/

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
             getCoordinates(myAddress);
          }
       });
}
}

function getCoordinates(location) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address' : location
        },
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var myResult = results[0].geometry.location;
                console.log(myResult.lat() + " , " + myResult.lng());
            }
    });
}

function getMonth(str) {
    console.log(str);
    return str;
}

function calculateDistance(origin, destination) {
    console.log(destination);
    var service = new google.maps.DistanceMatrixService();
    var dist = service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    }, callback);
    setTimeout(function() {}, 100);
    console.log(dist);
  }

  function callback(response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
      //$('#result').html(err);
      console.log("Distance Matrix Error!");
    } else {
      var origin = response.originAddresses[0];
      var destination = response.destinationAddresses[0];
      if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
        console.log("No route found");
      } else {
        var distance = response.rows[0].elements[0].distance.value;
        //console.log(typeof distance);
        //console.log("Distance: " + distance);
        loc_distance = distance;
        //return distance;
      }
    }
  }

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
