var app = angular.module("myApp", []);

var mylong;
var mylat;
app.controller("makePostController", [ '$scope', '$http', function($scope, $http) {
    $scope.post;
    $scope.status = "";
    
    $scope.makePost = function() {
        console.log("title = " + $scope.post.title);
        console.log("description = " + $scope.post.description);
        console.log("location = " + $scope.post.location);
        console.log("imageLink = " + $scope.post.imageLink);
        
        if($scope.post == undefined){
            return;
        }

        if($scope.post == undefined || $scope.post.title == undefined || $scope.post.description == undefined || $scope.post.location == undefined){
            $scope.status = "Make Sure to fill in all required fields.";
            return;
        }
        /*if($scope.post.imageLink.match((http(s?):)|([/|.|\w|\s])*\.(?:jpg|gif|png) == null){
            $scope.status = "Please enter a valid imageLink URL";
            return;
        }*/

        /* get coordinates of location and send request for create post */
        var myloc = $scope.post.location;
        getCoordinatesForMakePost(myloc);
       
    };

    function getCoordinatesForMakePost(location) {
    console.log("location: " + location);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address' : location
        },
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var myResult = results[0].geometry.location;
                console.log(myResult.lat() + " , " + myResult.lng());
                $scope.post.lat = myResult.lat();
                $scope.post.lng = myResult.lng();
                console.log("$scope.post: " + $scope.post);
                $http.post('/CreatePost', $scope.post).then(function(response) {
                    $scope.post = null;
                    console.log(response);
                    if(response.data.State == 0){
                        $scope.status = "Post successfully created! Don't forget to check for bids.";
                    }
                }).catch(function(response) {
                    console.log("error creating post");
                });
           }
    });

    }
}]);

function myMap(Loc) {
        /* do nothing */
}