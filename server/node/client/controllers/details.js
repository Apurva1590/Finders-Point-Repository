angular.module('MyApp')
  
.controller('DetailCtrl',  function($scope, $rootScope, $auth, $http, toastr) {
    console.log("Hello World from Detail controller");
    
//    $scope.showDetails = function(contact){
//    
//    console.log("I entered in show details function");
//$rootScope.contact = contact;
//    console.log($rootScope.contact);   
//   
//};
//    
    
 $scope.showProfessionals = function(professional){
    
    console.log("I entered in show details function");
$rootScope.professional = professional;
    console.log($rootScope.professional);   
   
};
    
    $scope.submitReview = function(id){
    
            console.log($scope.reviews);
        $scope.reviews.date = new Date().toISOString();
        $scope.professional.reviews.push($scope.reviews);
        $scope.reviewForm.$setPristine();
        
//        $scope.review = {author: "", rating: 5, comment: "", date: new Date().toISOString()};
//        console.log($scope.review);
        
        $http.post('/professional/id/', $scope.reviews).success(function(response) { 
console.log(response);
toastr.info('You have successfully created a new Review.');
        console.log($scope.professional.reviews);
    });
    };
    
});