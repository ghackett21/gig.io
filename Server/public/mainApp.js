/** mainApp.js 
 *  This file contains the controller for the index (main) page
 */

var app = angular.module("myApp", []);
var distance;

var arr;
var address;
var myUser;
var loc_distance;
var expanded = 0;
var currUid = 0;

app.controller("mainController", [ '$scope', '$http', function($scope, $http, $compile) {
	$scope.user;
    $scope.userToView;
    $scope.test = "test";

    /* logout user on button press */
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
			if(myUser.Admin == 1){
				var nav = document.getElementById('secret');
				nav.innerHTML = "<a href=\"admin.html\">AdminCP</a>";
			}
            /* save admin status */     
            localStorage.setItem("userAdmin", myUser.Admin); 
            localStorage.setItem("currentUid", myUser.Uid); 
        })

        /* request post data */
		$http.post('/GetAllPosts').then(function(response) {
			//$scope.user = null;
			$scope.count = response.data.result.length;
			$scope.index = 0;
			arr = response.data.result;
			var postData = [];
			var template = document.querySelector('#tmplt');
			console.log("template = " + template)
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

                var amountString = "-";
                /* format amount text */
                if (post.NumberOfBids != 0) {
                    amountString = "$" + post.LowestBid;
                    var amountString = "$" + post.LowestBid;
                    var index_of_decimal = amountString.indexOf(".");
                    if (index_of_decimal == -1) {
                        console.log("Bid string case 1");
                        amountString += ".00";
                    } 
                    else if (index_of_decimal == amountString.length - 2) {
                        console.log("Bid string case 2");
                        amountString += "0";
                    }
                }


				td[3].innerHTML = amountString;
				td[4].innerHTML = post.NumberOfBids;

                /* transform date easier to read format */
				var date = post.CreationTime.substring(0,10);
				var day = date.substring(8,date.length);
				var month = date.substring(5,7);
	    		var year = date.substring(0,4);

				date = month + "/" + day + "/" + year;

				td[5].innerHTML = date;
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
        console.log("I'm in!");
	    var bidVal1;
        var bidVal2;
        var temp;
        var swapped;
        $http.post('/GetAllPosts').then(function(response) {
            posts = response.data.result;

            /* Sort posts by number of bids */
            do {
                swapped = false;
                for (var i=0; i < posts.length-1; i++) {
                    bidVal1 = posts[i].LowestBid;
                    bidVal2 = posts[i+1].LowestBid;

                    if (bidVal1 > bidVal2) {
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
                if (posts[i].NumberOfBids != 0)
                    td[3].innerHTML = '$' + posts[i].LowestBid;
                else
                    td[3].innerHTML = "-";
                td[4].innerHTML = posts[i].NumberOfBids;
                var date = posts[i].CreationTime.substring(0,10);
                var day = date.substring(8,date.length);
                var month = date.substring(5,7);
                var year = date.substring(0,4);

                date = month + "/" + day + "/" + year;

                td[5].innerHTML = date;
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

	$scope.sortType = function() {
	 console.log("in sort type")
     var sortKey = $scope.selected;
     console.log(sortKey);
     switch (sortKey) {
       case 'age':
         $scope.sortByAge();
         break;
       case 'low_bid':
         $scope.sortByLowestBid();
         break;
       case 'dist':
         $scope.sortByDistance();
         break;
       case 'num_bids':
         $scope.sortByNumOfBids();
         break;
       default:
     }
     //$translate.use(langKey);
   }

	$scope.sortByAge = function() {
	    var time1;
        var time2;
        var temp;
        var swapped;
        $http.post('/GetAllPosts').then(function(response) {
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
                if (posts[i].NumberOfBids != 0)
                    td[3].innerHTML = '$' + posts[i].LowestBid;
                else
                    td[3].innerHTML = "-";
                td[4].innerHTML = posts[i].NumberOfBids;
                var date = posts[i].CreationTime.substring(0,10);
                var day = date.substring(8,date.length);
                var month = date.substring(5,7);
                var year = date.substring(0,4);

                date = month + "/" + day + "/" + year;

                td[5].innerHTML = date;
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
        $http.post('/GetAllPosts').then(function(response) {
            posts = response.data.result;

            /* sort posts by distance to user's location */
            do {
                swapped = false;
                for (var i=0; i < posts.length-1; i++) {
                    dist1 = getDistanceFromLatLonInKm2(posts[i].P_Lat, posts[i].P_Long, myUser.U_Lat, myUser.U_Long);

                    dist2 = getDistanceFromLatLonInKm2(posts[i+1].P_Lat, posts[i+1].P_Long, myUser.U_Lat, myUser.U_Long);

                    if (dist1 > dist2) {
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
                if (posts[i].NumberOfBids != 0)
                    td[3].innerHTML = '$' + posts[i].LowestBid;
                else
                    td[3].innerHTML = "-";
                td[4].innerHTML = posts[i].NumberOfBids;
                var date = posts[i].CreationTime.substring(0,10);
                var day = date.substring(8,date.length);
                var month = date.substring(5,7);
                var year = date.substring(0,4);

                date = month + "/" + day + "/" + year;

                td[5].innerHTML = date;
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
        $http.post('/GetAllPosts').then(function(response) {
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
                if (posts[i].NumberOfBids != 0)
                    td[3].innerHTML = '$' + posts[i].LowestBid;
                else
                    td[3].innerHTML = "-";
                td[4].innerHTML = posts[i].NumberOfBids;
                var date = posts[i].CreationTime.substring(0,10);
                var day = date.substring(8,date.length);
                var month = date.substring(5,7);
                var year = date.substring(0,4);

                date = month + "/" + day + "/" + year;

                td[5].innerHTML = date;
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

    /* Called when the "Place bid" button is clicked */
	$scope.placeBid = function() {
        // Check that user isn't poster
        if ($scope.owner == myUser.Username) {
            alert("You can't bid on your own post!");
            return;
        }

        if ($scope.bid.Amount == "") {
            alert("No bid amount entered!");
            return;
        }

        $scope.bid.PostId = $scope.Pid;
        $scope.bid.UserId = myUser.Uid;

        console.log("bid: postid: " + $scope.bid.PostId + ", userId: " + $scope.bid.UserId + ", amount: " + $scope.bid.Amount);

        // Bid
        $http.post('/Bid', $scope.bid).then(function(response) {
            if (response.data.State == -4) {
                alert("New bids must be lower than previous bids!");
            }

            var bids = response.data.Result;
            if (bids.length > 0) {
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
                    console.log("Fixing HTML");
                    td[0].innerHTML = date; 
                    td[1].innerHTML = "<b><a class=\'bidprof-link ng-binding\' style=\"font-size:18px\" onclick=\"angular.element(this).scope().viewBidUserProfile(" + bids[i].Uid + ")\">" + bids[i].Username + "</a></b>";
                    td[2].innerHTML = amountString;
                    td[3].innerHTML = bids[i].AVG_BidRate + "/5";
                    template.parentNode.appendChild(clone);
                }
            }
            
        }).catch(function(response) {
            console.log("error bidding");
        })
    };

    /* sets up all posts onClick actions (display info, load bids, and map) */
    function setupPosts(posts) {
        console.log("IN SETUPPOSTS");
        // Get the modal and the table rows
        var modal = document.getElementById('myModal');
        var rows = document.getElementById("postTable").rows;

        /* set the onclick action for each row/post */
        for (var i = 0; i < rows.length; i++) {
            rows[i].onclick = function() {
                /* only perform onclick action if there is no post expanded currently */
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
                    var post = posts[j];

                    /* set display content */
                    console.log(post);
                    currUid = post.Uid;
                    $scope.owner = post.Username;
                    $scope.phone = post.PhoneNumber;
                    $scope.desc = post.P_Description;
                    $scope.title = post.P_Title;
                    console.log("postid: " + post.Pid);
                    $scope.Pid = post.Pid;

                    var postImage = document.getElementById('post_image');

                    postImage.addEventListener('error', function(){
                        console.log('loading img failed.');  
                        postImage.src = "assets/img/defaultImage.png";
                    });

                    if (post.P_Image != "") {
                       postImage .src = post.P_Image;
                    }
                    else {
                        postImage .src = "assets/img/defaultImage.png";
                    }

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
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                /* set flag */
                expanded = 0;
                modal.style.display = "none";
            }
        }
    }

    /* load bids for a post */
    function loadBids(bidData) {
        /* make request */
        $http.post("/GetBids", bidData).then(function(response) {
            var bids = response.data.Result;
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
                td[1].innerHTML = "<b><a class=\'bidprof-link ng-binding\' style=\"font-size:18px\" onclick=\"angular.element(this).scope().viewBidUserProfile(" + bids[i].Uid + ")\">" + bids[i].Username + "</a></b>";
                td[2].innerHTML = amountString;
                
                /* format bid rating so it is only displayed to one decimal */
                var bidText = bids[i].AVG_BidRate + "";
                bidText = bidText.substring(0, bidText.indexOf(".") + 2) + "/5";
                td[3].innerHTML = bidText;

                template.parentNode.appendChild(clone);
            }
            /* call display map function */
            myMap(myUser.U_Location);

        }).catch(function(response) {
            console.log("error getting bids");
        })
    }

    $scope.viewUserProfile = function() {
        console.log("In viewUserProfile");
        console.log(currUid);
        if (myUser.Uid == currUid) {
            window.open("profile.html", "_top");
        }
        else {
            localStorage.setItem("userId", currUid);       
            window.open("userProfile.html", "_top");
        }
    }

    $scope.viewBidUserProfile = function(uid) {
        console.log("In viewBidUserProfile");
        console.log(uid);
        if (myUser.Uid == uid) {
            window.open("profile.html", "_top");
        }
        else {
            localStorage.setItem("userId", uid); 
            window.open("userProfile.html", "_top");
        }
    }

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
    console.log("location: " + location);
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
        loc_distance = distance;
      }
    }
  }

  function getDistanceFromLatLonInKm2(lat1,long1,lat2,long2) {
      dlong = (long2 - long1) * (Math.PI / 180.0);
      dlat = (lat2 - lat1) * (Math.PI / 180.0);
      a = Math.pow(Math.sin(dlat/2.0), 2) + Math.cos(lat1*(Math.PI / 180.0)) * Math.cos(lat2*(Math.PI / 180.0)) * Math.pow(Math.sin(dlong/2.0), 2);
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      d = 6367 * c;

      return d;
  }

app.controller("adminController", ['$scope', '$http', function($scope, $http) {
	$scope.user;
	$scope.userList;
	$scope.searchBar = '';

    /* logout user on button press */
	$scope.logout = function() {
		$http.post('/logout').then(function(response) {
			window.location = response.data.redirect;
		});
	};
	window.onload = function() {
        /* requst information about the currently logged-in user */
        $http.post('/GetUser').then(function(response) {
            //console.log(response.data.Result[0]);
        	$scope.user = response.data.Result[0];
				if($scope.user.Admin == 1){
					var nav = document.getElementById('secret');
					nav.innerHTML = "<a href=\"admin.html\">AdminCP</a>";
				}
        })

        /* request post data */
		$http.post('/GetAllUsers').then(function(response) {
			console.log("GET ALL USERS")
            console.log(response);	   
			$scope.userList = response.data.result;
			console.log("User[0] = %j", $scope.userList[0]);


			//$('#dt1').dataTable();


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

	$scope.adminModal = function(uid){
		var format = {userId:uid};
		//format.userId = uid
        $http.post('/GetUser', format).then(function(response) {
        	$scope.userL = response.data.Result[0];
			console.log("userL = %j", $scope.userL);
        })

        $http.post('/GetUserReports', format).then(function(response) {
        	$scope.reportL = response.data.Result;
			console.log("reportL = %j", $scope.reportL);
			if($scope.reportL[0] == undefined){
				document.getElementById('reportHistory').style.display = "none";
				document.getElementById('noReports').style.display = "block";
			}
        })
		console.log("hello " + uid);
		var modal = document.getElementById('myModal');

        /* set display content */
		modal.style.display = "flex";
       // $scope.$apply();

        $scope.close = function() {
            /* set flag */
            expanded = 0;
            modal.style.display = "none";
			document.getElementById('reportHistory').style.display = "block";
			document.getElementById('noReports').style.display = "none";
        }

	}
		$scope.deleteUser = function(uid){
			var format1 = {userId:uid};
			console.log("uid = %j", format1);
			//$scope.close();
        	$http.post('/DeleteUser', format1).then(function(response) {
				console.log("Delete");
        	}).catch(function(response) {
				console.log("ded");			
			});
		}


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
                    expanded = 1;
                   
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
                    $scope.name = post.Username;
                    $scope.phone = post.PhoneNumber;
                    $scope.desc = post.P_Description;
					$scope.location = post.P_Location;
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
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                /* set flag */
                expanded = 0;
                modal.style.display = "none";
            }
        }
    }

    /* load bids for a post */
    function loadBids(bidData) {
        /* make request */
        $http.post("/GetBids", bidData).then(function(response) {
            var bids = response.data.Result;
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
                td[2].innerHTML = amountString;
                td[3].innerHTML = bids[i].AVG_BidRate + "/5";
                template.parentNode.appendChild(clone);
            }
            /* call display map function */
            myMap(myUser.U_Location);

        }).catch(function(response) {
            console.log("error getting bids");
        })
    }

}]);
