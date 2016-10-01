angular.module('MyApp')
  
.service('multipartForm', function($http){

    this.post = function(uploadUrl, data){
        var fd = new FormData();
        
        for(var key in data)
            fd.append(key, data[key]);
        $http.post(uploadUrl, fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}
                                  
                                  })
    
    }
    

})

.controller('ImageSubmitCtrl',['$scope', 'multipartForm', function($scope, multipartForm) {
    
    console.log("Hello World from Image controller");
    
    $scope.customer = {};
    $scope.imgSubmit = function(){
    
        var uploadUrl = '/upload';
        multipartForm.post(uploadUrl, $scope.customer);
        
    }
}]);

//.controller('ImageSubmitCtrl',['$scope', '$http', function($scope, $http) {
//
//      $scope.customer = {};
//    $scope.imgSubmit = function(){
//      
//var file = $scope.customer.file;
//    var uploadUrl = '/upload';
//        var fd = new FormData();
//        fd.append('file', file);
//        
//        $http.post(uploadUrl, $scope.customer, fd, {
//         
//            transformRequest: angular.identity,                 headers: {'Content-Type': undefined}   
//        
//        })
//        .success(function(){
//         console.log("Success!!");            
//        })
//        .error(function(){
//        console.log("error!!");
//        });
//    };
//    
//}]);
