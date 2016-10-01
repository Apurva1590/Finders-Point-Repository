angular.module('MyApp')
  
.controller('ContactlistCtrl',  function($scope, $auth, $http, $window, toastr) {
    console.log("Hello World from controller");
    
     var refresh = function(){                      $http.get('/contactlist').success(function(response){
        console.log("I got the data I requested");
            $scope.contactlist = response;
        });
 };
    
refresh();

    $scope.addContact = function() {
  console.log($scope.contact);
     $http.post('/contactlist', $scope.contact).success(function(response) {  console.log(response);
toastr.info('You have successfully created a new contact');  refresh();                                               
});
};
    
    
$scope.remove = function(id){
console.log(id);
$http.delete('/contactlist/' + id).success(function(response){
refresh();
})
};  
    
$scope.edit = function(id){
console.log(id);
    $http.get('/contactlist/' + id).success(function(response){
    $scope.contact = response;
    });
};
   
$scope.update = function(){
console.log($scope.contact._id);
    $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response){
   refresh();
    });
};  
   
$scope.deselect = function(){
 $scope.contact = ""; 
};  
    
    
//$scope.showDetails = function(contact){
//    
//    console.log("I entered in show details function in Contactlist.js");
//$scope.contact = contact;
//    console.log($scope.contact);
//   //  $window.location.href="/views/details.html";
//};



});