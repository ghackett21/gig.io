var app = angular.module("myPostApp", []);
var distance;

var arr;
var address;
var myUser;
var loc_distance;
var expanded = 0;
var global_postId = -1;
var global_http = null;

/* mode enum */
var modeEnum = Object.freeze({
    POSTED: 0,
    WON: 1
});

var currentMode = modeEnum.POSTED;

app.controller("userPostController", [ '$scope', '$http', function($scope, $http) {
	$scope.user;
    $scope.test = "test";
    $scope.bidInfo;
    global_http = $http;

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
        });
        displayPosts();

    }

    function displayPosts() {

        if (currentMode == modeEnum.POSTED) {
            $scope.modeText = "View Won Posts";
            /* request post data */
            $http.post('/getUserPosts').then(function(response) {
                fillRows(response);
            }).catch(function(response) {
                /* catch error in reponse */
                $scope.user = null;
                console.log(response.status);
                console.log(response);
                if(response.status == 401){
                    console.log("failure");
                }
            });
        }
        else if (currentMode == modeEnum.WON) {
            $scope.modeText = "View Created Posts";
            /* request post data */
            $http.post('/getWonPosts').then(function(response) {
                fillRows(response);
            }).catch(function(response) {
                /* catch error in reponse */
                $scope.user = null;
                console.log(response.status);
                console.log(response);
                if(response.status == 401){
                    console.log("failure");
                }
            });
        }
    };

    function fillRows(response) {
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

            console.log("post.Status: " + post.Status);

            var statusString = "";
            if (post.Status == 0) {
                statusString = "Open";
            }
            else if (post.Status == 1) {
            	if (currentMode == modeEnum.POSTED) {
                statusString = "Pending";
            	}
            	else {
            		statusString = "Won";
            	}
            }
            else if (post.Status == 2) {
            	statusString= "Completed"
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
    }

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
		        	if (currentMode == modeEnum.POSTED) {
		            statusString = "Pending";
		        	}
		        	else {
		        		statusString = "Won";
		        	}
		        }
		        else if (post.Status == 2) {
		        	statusString= "Completed"
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
	            	if (currentMode == modeEnum.POSTED) {
	                statusString = "Pending";
	            	}
	            	else {
	            		statusString = "Won";
	            	}
	            }
	            else if (post.Status == 2) {
	            	statusString= "Completed"
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
	            	if (currentMode == modeEnum.POSTED) {
	                statusString = "Pending";
	            	}
	            	else {
	            		statusString = "Won";
	            	}
	            }
	            else if (post.Status == 2) {
	            	statusString= "Completed"
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
	            	if (currentMode == modeEnum.POSTED) {
	                statusString = "Pending";
	            	}
	            	else {
	            		statusString = "Won";
	            	}
	            }
	            else if (post.Status == 2) {
	            	statusString= "Completed"
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
        });
    };

    /* sets up all posts onClick actions (display info, load bids, and map) */
    function setupPosts(posts) {
        // Get the modal and the table rows
        var openModal = document.getElementById('openModal');
        var pendingModal = document.getElementById('pendingModal');
        var wonModal = document.getElementById('wonModal');
        var completedPosterModal = document.getElementById('completedPosterModal');
        var completedBidderModal = document.getElementById('completedBidderModal');
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


                    var postImage = null;
                    var statusString = "";
                    if (post.Status == 0) {
               			statusString = "Open";
                        postImage = document.getElementById('open_image');
		            }
		            else if (post.Status == 1) {
		            	if (currentMode == modeEnum.POSTED) {
		                    statusString = "Pending";

                            postImage = document.getElementById('pending_image');
		            	}
		            	else {
		            		statusString = "Won";

                            postImage = document.getElementById('won_image');
		            	}
		            }
		            else if (post.Status == 2) {
                        statusString= "Completed"
                        if (currentMode == modeEnum.POSTED) {
                            postImage = document.getElementById('completed_poster_image');
                        }
                        else {
                            postImage = document.getElementById('completed_bidder_image');
                        }
		            }

                    postImage.addEventListener('error', function(){
                        console.log('loading img failed.');  
                        postImage.src = "assets/img/girl.png";
                    });

                    if (post.P_Image != "") {
                       postImage .src = post.P_Image;
                    }
                    else {
                        postImage .src = "assets/img/girl.png";
                    }

                    
                    $scope.status = statusString

                    $scope.location = post.P_Location;
                    address = post.P_Location;


                    /*use the correct modal based on post status */
                    if (post.Status == 0) {
                        openModal.style.display = "block";

                        // Load bid history for current post
                        var bidData = new Object();
                        bidData.PostId = post.Pid;
                        loadBids(bidData, 0);
                        $scope.$apply();
                    }
                    else if (post.Status == 1) {
                        if (currentMode == modeEnum.POSTED) {
                            pendingModal.style.display = "block";
                        }
                        else if (currentMode == modeEnum.WON) {
                            wonModal.style.display = "block";
                        }
                        // Load bid history for current post
                        var bidData = new Object();
                        bidData.PostId = post.Pid;
                        loadBids(bidData, 1);
                        $scope.$apply();
                    }
                    else if (post.Status == 2) {
                        if (currentMode == modeEnum.POSTED) {
                            completedPosterModal.style.display = "block";
                        }
                        else {
                            completedBidderModal.style.display = "block";
                        }
                        var bidData = new Object();
                        bidData.PostId = post.Pid;
                        loadBids(bidData, 2);
                        $scope.$apply();
                    }
                }
            };
        }

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close");

        // When the user clicks on <span> (x), close the modal
        span[0].onclick = function() {
            /* set flag */
            expanded = 0;
            openModal.style.display = "none";
            global_postId = -1;
        }

        span[1].onclick = function() {
            expanded = 0;
            pendingModal.style.display = "none";
        }

        span[2].onclick = function() {
            expanded = 0;
            wonModal.style.display = "none";
        }

        span[3].onclick = function() {
            expanded = 0;
            completedPosterModal.style.display = "none";
        }

        span[4].onclick = function() {
            expanded = 0;
            completedBidderModal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == openModal) {
                /* set flag */
                expanded = 0;
                openModal.style.display = "none";
                global_postId = -1;
            }
            else if (event.target == pendingModal) {
                expanded = 0;
                pendingModal.style.display = "none";
            }
            else if (event.target == wonModal) {
                expanded = 0;
                pendingModal.style.display = "none";
            }
            else if (event.target == completedPosterModal) {
                expanded = 0;
                completedPosterModal.style.display = "none";
            }
            else if (event.target == completedBidderModal) {
                expanded = 0;
                completedBidderModal.style.display = "none";
            }
        }
    }

    /* load bids for a post */
    function loadBids(bidData, status) {
        console.log("load bids");
        /* make request */
        $http.post("/GetBids", bidData).then(function(response) {
            var bids = response.data.Result;
            $scope.bidInfo = bids;
            var bidData = []
            var template = null;

            if (status == 0) {
               template = document.querySelector('#openBidTemplate');
            }
            else if (status == 1) {
                if (currentMode == modeEnum.POSTED) {
                    template = document.querySelector('#pendingBidTemplate');
                }
                else {
                    template = document.querySelector('#wonBidTemplate');
                }
            }
            else if (status == 2) {
                if (currentMode == modeEnum.POSTED) {
                    template = document.querySelector('#completedPosterBidTemplate');
                }
                else {
                    template = document.querySelector('#completedBidderBidTemplate');
                }
            }

            while(template.parentNode.hasChildNodes()) {
                if (template.parentNode.lastChild == template)
                    break;
                template.parentNode.removeChild(template.parentNode.lastChild);
            }

            console.log("before for loop in getbids");
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

                /* ensure two decimal places are dispalyed for bid amount text */
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
                if (status == 0) {
                    td[4].id = bids[i].Bidid;
                }
                template.parentNode.appendChild(clone);

            }

            console.log("call myMap");
            /* call display map function */
            myMap(myUser.U_Location, status);
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

    // Called when the "Completed" button is clicked
    $scope.completeButton = function() {
    	 console.log("Completed Button function");
        var bid = {PostId:$scope.Pid};

        /* close post */
        $http.post('/CompletePost', bid).then(function(response) {
           location.reload(true);
           console.log("Close Post: " + bid.PostId + ", amount: " + bid.Amount);
        }).catch(function(response) {
            console.log("error in Close Post");
        })
    } 

    $scope.changeMode = function() {
        if (currentMode == modeEnum.POSTED) {
            currentMode = modeEnum.WON;
        }
        else if (currentMode == modeEnum.WON) {
            currentMode = modeEnum.POSTED;
        }
        /* clear old rows */
        var tableParent = document.querySelector('#tmplt').parentNode;
        var postRows = tableParent.querySelectorAll('tr');
        for (var i = 0; i < postRows.length; i++) {
            if (postRows[i].id.includes("post")) {
                tableParent.removeChild(postRows[i]);
            }
        }

        displayPosts();
    }
}]);

function acceptBid(el) {
    console.log("function 2");
    console.log("el: " + el);
    console.log("bidid: " + el.parentElement.id);
    var bid = {Bidid:el.parentElement.id, PostId:global_postId};
    console.log("Close Post: " + bid.PostId + ", bid: " + bid.Bidid);

    /* close post */
    global_http.post('/ClosePost', bid).then(function(response) {
       location.reload(true);
    })//.catch(function(response) {
       // console.log("error in Close Post");
    //})
}


function myMap(loc, status) {
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
            console.log("error with direction service");
            // oops, there's no route between these two locations
            // every time this happens, a kitten dies
            // so please, ensure your address is formatted properly
          }
        });

        if (status == 0) {
            var map = new google.maps.Map(document.getElementById('open_map'), {
               mapTypeId: google.maps.MapTypeId.TERRAIN,
               zoom: 10
            });
        }
        else if (status == 1) {
            if (currentMode == modeEnum.POSTED) {
                var map = new google.maps.Map(document.getElementById('pending_map'), {
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    zoom: 10

                });
            } 
            else {
                var map = new google.maps.Map(document.getElementById('won_map'), {
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    zoom: 10

                });
            }
        }
        else if (status == 2) {
            if (currentMode == modeEnum.POSTED) {
                var map = new google.maps.Map(document.getElementById('completed_poster_map'), {
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    zoom: 10

                });
            } 
            else {
                var map = new google.maps.Map(document.getElementById('completed_bidder_map'), {
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    zoom: 10

                });
            }
        }

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
