app.controller("loginController", [ '$scope', '$http', function($scope, $http) {
    $scope.user;
    
    $scope.clickButton = function() {

        if($scope.user == undefined){
            return;
        }
        if($scope.user == undefined || $scope.user.username == undefined || $scope.user.password == undefined){
            return;
        }
        console.log("username = " + $scope.user.username);
        console.log("password = " + $scope.user.password);
        $http.post('/login', $scope.user).then(function(response) {
            $scope.user = null;
            console.log(response.status);
            console.log(response);
            if(response.data.status == 200){
                console.log("success");
                console.log("redirect = ", response.data.redirect);
                window.location = response.data.redirect;
            }else if(response.status == 401){
                console.log("failure");
            }
            //load response
        }).catch(function(response) {
            $scope.user = null;
            console.log(response.status);
            console.log(response);
            if(response.status == 401){
                console.log("failure1");
            }
            //load response
        })
    };
}]);