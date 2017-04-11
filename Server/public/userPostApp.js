var app = angular.module("myPostApp", []);
var distance;

var arr;
var address;
var myUser;
var loc_distance;
var expanded = 0;
var global_postId = -1;

app.controller("userPostController", [ '$scope', '$http', function($scope, $http) {
	$scope.user;
    $scope.test = "test";
    $scope.bidInfo;

//test stuff for server auth
	$scope.logout = function() {
		$http.post('/logout').then(function(response) {
			console.log("response = %j", response);
			window.location = response.data.redirect;
		});
	};

	/* load user and post data  when page loads */
    window.onload = function() {
        /* requst information about the currently logged-in user */
        $http.post('/GetUser').then(function(response) {
                        //console.log(response.data.Result[0]);
                        myUser = response.data.Result[0];
        })

        /* request post data */
        $http.post('/getUserPosts').then(function(response) {
            console.log("response: " + response)         
            $scope.count = response.data.result.length;
            $scope.index = 0;
            arr = response.data.result;
            var postData = [];
            var template = document.querySelector('#tmplt');
            /* make new rows in the post table for each post */
            for (var i = 0 ; i < arr.length; i++) {
                $scope.index = i;
                var post = arr[i];
                postData.push(arr[i]);
                var clone = template.content.cloneNode(true);
                var td = clone.querySelectorAll('td');
                /* set display text elements */
                td[0].innerHTML = post.P_Title;
                td[1].innerHTML = post.Username;
                td[2].innerHTML = post.P_Location;

                /* transform date easier to read format */
                var date = post.CreationTime.substring(0,10);
                var day = date.substring(8,date.length);
                var month = date.substring(5,7);
                var year = date.substring(0,4);

                date = month + "/" + day + "/" + year;

                td[3].innerHTML = date;

                var statusString = "";
                if (post.Status == 0) {
                    statusString = "Open";
                }
                else if (post.Status == 1) {
                    statusString = "Pending";
                }

                td[4].innerHTML = statusString;

                var tr = clone.querySelectorAll('tr');               
                tr[0].id = "post-"+i;
                template.parentNode.appendChild(clone);
            }

            /* set up each rows's onClick actions */
            setupPosts(postData);

            console.log(response.status);
            console.log(response);             
            if(response.status == 200){
                console.log("success");
            }else if(response.status == 401){
                console.log("failure");
            }
        }).catch(function(response) {
            /* catch error in reponse */
            $scope.user = null;
            console.log(response.status);
            console.log(response);
            if(response.status == 401){
                console.log("failure");
            }
        })
        
    };

$scope.sortByLowestBid = function() {
        var bidVal1;
        var bidVal2;
        var temp;
        var swapped;
        $http.post('/getUserPosts').then(function(response) {
            posts = response.data.result;

            /* Sort posts by number of bids */
            do {
                swapped = false;
                for (var i=0; i < posts.length-1; i++) {
                    bidVal1 = posts[i].NumberOfBids;
                    bidVal2 = posts[i+1].NumberOfBids;

                    if (bidVal1 < bidVal2) {
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
                td[0].innerHTML = posts[i].P_Title;
                td[1].innerHTML = posts[i].Username;
                td[2].innerHTML = posts[i].P_Location;

                var date = posts[i].CreationTime.substring(0,10);
                var day = date.substring(8,date.length);
                var month = date.substring(5,7);
                var year = date.substring(0,4);

                date = month + "/" + day + "/" + year;

                td[3].innerHTML = date;

                var statusString = "";
                if (post.Status == 0) {
                    statusString = "Open";
                }
                else if (post.Status == 1) {
                    statusString = "Pending";
                }

                td[4].innerHTML = statusString;
            }

             /* set up each rows's onClick actions */
            setupPosts(posts);

            console.log(response.status);
            console.log(response);
            if(response.status == 200){
                console.log("success");
            }else if(response.status == 401){
                console.log("failure");
            }
        }).catch(function(response) {
            console.log(response.status);
            console.log(response);
            if(response.status == 401){
                console.log("failure");
            }
        })
    };

    $scope.sortByAge = function() {
        var time1;
        var time2;
        var temp;
        var swapped;
        $http.post('/getUserPosts').then(function(response) {
            posts = response.data.result;

            /* Sort posts by date */
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
                td[0].innerHTML = posts[i].P_Title;
                td[1].innerHTML = posts[i].Username;
                td[2].innerHTML = posts[i].P_Location;

                var date = posts[i].CreationTime.substring(0,10);
                var day = date.substring(8,date.length);
                var month = date.substring(5,7);
                var year = date.substring(0,4);

                date = month + "/" + day + "/" + year;

                td[3].innerHTML = date;

                var statusString = "";
                if (post.Status == 0) {
                    statusString = "Open";
                }
                else if (post.Status == 1) {
                    statusString = "Pending";
                }

                td[4].innerHTML = statusString;
            }

             /* set up each rows's onClick actions */
            setupPosts(posts);

            console.log(response.status);
            console.log(response);
            if(response.status == 200){
                console.log("success");
            }else if(response.status == 401){
                console.log("failure");
            }
        }).catch(function(response) {
            console.log(response.status);
            console.log(response);
            if(response.status == 401){
                console.log("failure");
            }
        })
    };

    $scope.sortByDistance = function() {
                var time1;
                var time2;
                var temp;
                var swapped;
                $http.post('/getUserPosts').then(function(response) {
                    posts = response.data.result;

                    /* sort posts by distance to user's location */
                    do {
                        swapped = false;
                        for (var i=0; i < posts.length-1; i++) {
                            dist1 = getDistanceFromLatLonInKm(posts[i].P_Lat, posts[i].P_Long, myUser.U_Lat, myUser.U_Long)

                            dist2 = getDistanceFromLatLonInKm(posts[i+1].P_Lat, posts[i+1].P_Long, myUser.U_Lat, myUser.U_Long);

                            if (dist1 < dist2) {
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
                        td[0].innerHTML = posts[i].P_Title;
                        td[1].innerHTML = posts[i].Username;
                        td[2].innerHTML = posts[i].P_Location;

                        var statusString = "";
                        if (post.Status == 0) {
                            statusString = "Open";
                        }
                        else if (post.Status == 1) {
                            statusString = "Pending";
                        }

                        td[3].innerHTML = statusString;
                    }

                    /* set up each rows's onClick actions */
                    setupPosts(posts);

                    console.log(response.status);
                    console.log(response);
                    if(response.status == 200){
                        console.log("success");
                    }else if(response.status == 401){
                        console.log("failure");
                    }
                }).catch(function(response) {
                    console.log(response.status);
                    console.log(response);
                    if(response.status == 401){
                        console.log("failure");
                    }
                })
        };

    $scope.sortByNumOfBids = function() {
            var time1;
            var time2;
            var temp;
            var swapped;
            $http.post('/getUserPosts').then(function(response) {
                posts = response.data.result;

                /* Sort by number of bids */
                do {
                    swapped = false;
                    for (var i=0; i < posts.length-1; i++) {
                        nbids1 = new Date(posts[i].NumberOfBids);
                        nbids2 = new Date(posts[i+1].NumberOfBids);

                        if (nbids1 < nbids2) {
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
                    td[0].innerHTML = posts[i].P_Title;
                    td[1].innerHTML = posts[i].Username;
                    td[2].innerHTML = posts[i].P_Location;

                    var date = posts[i].CreationTime.substring(0,10);
                    var day = date.substring(8,date.length);
                    var month = date.substring(5,7);
                    var year = date.substring(0,4);

                    date = month + "/" + day + "/" + year;

                    td[3].innerHTML = date;

                    var statusString = "";
                    if (post.Status == 0) {
                        statusString = "Open";
                    }
                    else if (post.Status == 1) {
                        statusString = "Pending";
                    }

                    td[4].innerHTML = statusString;
                }

                /* set up each rows's onClick actions */
                setupPosts(posts);

                console.log(response.status);
                console.log(response);
                if(response.status == 200){
                    console.log("success");
                }else if(response.status == 401){
                    console.log("failure");
                }
            }).catch(function(response) {
                console.log(response.status);
                console.log(response);
                if(response.status == 401){
                    console.log("failure");
                }
            })
    };

    /* sets up all posts onClick actions (display info, load bids, and map) */
    function setupPosts(posts) {
        // Get the modal and the table rows
        var modal = document.getElementById('myModal');
        var rows = document.getElementById("postTable").rows;

        /* set the onclick action for each row/post */
        for (var i = 0; i < rows.length; i++) {
            rows[i].onclick = function() {
                /* only perform onclick action if there is no post expanded currently */
                if (expanded == 0) {
                    /* set flag */
                    //expanded = 1;
                   
                    rowID = this.id;
                    var j = 0;
                    var str;
                    for(j; j < rows.length; j++) {
                       str = "post-"+j;
                       if (str === rowID)
                            break;
                    }
                    var post = posts[j];

                    /* set display content */
                    $scope.owner = post.Username;
                    $scope.phone = post.PhoneNumber;
                    $scope.desc = post.P_Description;
                    $scope.title = post.P_Title;
                    $scope.Pid = post.Pid;
                    global_postId = post.Pid;

                    if (post.P_Image != "") {
                       document.getElementById("post_image").src = post.P_Image;
                    }
                    else {
                        document.getElementById("post_image").src = "assets/img/girl.png";
                    }

                    var statusString = "";
                    if (post.Status == 0) {
                        statusString = "Open";
                    }
                    else if (post.Status == 1) {
                        statusString = "Pending";
                    }
                    $scope.status = statusString

                    $scope.location = post.P_Location;
                    address = post.P_Location;
                    modal.style.display = "block";
                    $scope.$apply();

                    // Load bid history for current post
                    var bidData = new Object();
                    bidData.PostId = post.Pid;
                    loadBids(bidData);
                }
            };
        }

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            /* set flag */
            expanded = 0;
            modal.style.display = "none";
            global_postId = -1;
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                /* set flag */
                expanded = 0;
                modal.style.display = "none";
                global_postId = -1;
            }
        }
    }

    /* load bids for a post */
    function loadBids(bidData) {
        /* make request */
        $http.post("/GetBids", bidData).then(function(response) {
            var bids = response.data.Result;
             $scope.bidInfo = bids;
            var bidData = []
            var template = document.querySelector('#bidTemplate');
            while(template.parentNode.hasChildNodes()) {
                if (template.parentNode.lastChild == template)
                    break;
                template.parentNode.removeChild(template.parentNode.lastChild);
            }

            /* clone template row and fill in bid info */
            for (var i = 0; i < bids.length; i++) {


                // Format date
                var date = bids[i].BidTime.substring(5, 7) + "/" +
                           bids[i].BidTime.substring(8, 10) + "/" +
                           bids[i].BidTime.substring(0, 4) + ", " +
                           bids[i].BidTime.substring(11, 16);

                var clone = template.content.cloneNode(true);
                var td = clone.querySelectorAll('td');


                var amountString = "$" + bids[i].Amount;

                var index_of_decimal = amountString.indexOf(".");
                if (index_of_decimal == -1) {
                    console.log("Bid string case 1");
                    amountString += ".00";
                } 
                else if (index_of_decimal == amountString.length - 2) {
                    console.log("Bid string case 2");
                    amountString += "0";
                }

                /* fill in row information */
                td[0].innerHTML = date; 
                td[1].innerHTML = bids[i].Username;
                td[2].innerHTML = amountString
                td[3].innerHTML = bids[i].AVG_BidRate + "/5";
                td[4].id = bids[i].Bidid;
                template.parentNode.appendChild(clone);
            }
            /* call display map function */
            myMap(myUser.U_Location);
        }).catch(function(response) {
            console.log("error getting bids");
        });
    }


    // Called when the "Place bid" button is clicked
    $scope.closePostButton = function() {
        var bid = {Bidid:null, PostId:$scope.Pid};

        /* close post */
        $http.post('/ClosePost', bid).then(function(response) {
           location.reload(true);
           console.log("Close Post: " + bid.PostId + ", amount: " + bid.Amount);
        }).catch(function(response) {
            console.log("error in Close Post");
        })
    }

    function acceptBid() {
        console.log("function 2");
        //console.log("el: " + el);
        //console.log("bidid: " + el.parentElement.id);
        /* call closePost */
        //var bid = {Bidid:el.parentElement.id, PostId:global_postId};
        //console.log("Close Post: " + bid.PostId + ", bid: " + bid.Bidid);
    }

}]);

/*
function acceptBid(el) {
    console.log("function 2");
    console.log("el: " + el);
    console.log("bidid: " + el.parentElement.id);
    var bid = {Bidid:el.parentElement.id, PostId:global_postId};
    console.log("Close Post: " + bid.PostId + ", bid: " + bid.Bidid);
}
*/

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
