var app = angular.module("makePostApp", []);

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

		//NEED TO CONVERT LOCATION TO COORDINATES AND SEND TO DATABASE AS WELL
		var myloc = $scope.post.location;
		console.log("My loc:  = " + myloc);
		for(var i=0;i<10;i++){
		getCoordinates(myloc);}
		console.log("My longitude = "+mylong);
		console.log("My latitude = "+mylat);
		$scope.post.lat=mylat;
		$scope.post.long=mylong;
		console.log("scope.post.lat="+$scope.post.lat+"    scope.post.lng="+$scope.post.lng);
		$http.post('/CreatePost', $scope.post).then(function(response) {
			//getCoordinates(myloc);
		console.log("My longitude = "+mylong);
		console.log("My latitude = "+mylat);
			$scope.post = null;
			//$scope.status = "Post successfully created!";
			console.log(response);
			if(response.data.State == 0){
				$scope.status = "Post successfully created! Don't forget to check for bids.";
				//alert("");
				//window.location = response.data.redirect;
			}
		});
	};
	
	

}]);