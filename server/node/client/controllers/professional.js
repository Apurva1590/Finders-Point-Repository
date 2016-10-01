

angular.module('MyApp')
  
.controller('ProfessionalCtrl',  function($scope, $rootScope, $filter, $auth, $http, $window, toastr) {
    
    $scope.filter = {};
  $scope.filter.city = "";
  $scope.filter.designation = "";
    
    
    console.log("Hello World Professional from controller");
  
    

 var refresh = function(){                      $http.get('/professional').success(function(response){
        console.log("I got the data I requested");
            $scope.professional = response;
        });
 };

refresh();

    $scope.addProf = function() {
  console.log($scope.profess);
     $http.post('/professional', $scope.profess).success(function(response) { 
console.log(response);
toastr.info('You have successfully created a new Professional.');  //refresh();                                               
});
};

    
    

//$scope.mydiv = false;
$scope.showData = function(data){

    $scope.searchData = data ;
}
    
$scope.searchFilter = function (data) {
    if ((!$scope.filter.city || data.city === $scope.filter.city) &&
      (!$scope.filter.designation || data.designation === $scope.filter.designation)) {
      return true;
    } else {
      return false;
    }
  };
    
    
    
})

.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(professional) {
          var key = professional[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(professional);
          }
      });

      return output;
   };
});
