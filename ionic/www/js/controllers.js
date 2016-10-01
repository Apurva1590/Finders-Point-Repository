angular.module('FP.controllers', [])

 .controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  })

.controller('HomeCtrl', ['$scope', 'AuthService', 'AUTH_EVENTS', '$ionicPopup', '$state', '$q', '$http', 'API_ENDPOINT',  function($scope, AuthService, AUTH_EVENTS, $ionicPopup, $state, $q, $http, API_ENDPOINT) {
    console.log("Hello World from  App controller");
    
    
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('menu.home');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
    
  

}])

//.controller('HomeCtrl', function() {
//  
//})
 
.controller('LoginCtrl', function($scope, $location, AuthService, $ionicPopup, $state) {
  $scope.user = {
    email: '',
    password: ''
  };
   console.log("Hello World from  Login controller");
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
         console.log("Login controller 1");
        var alertPopup = $ionicPopup.alert({
        title: 'Good to see you. Have fun Searching Professionals!',
        template: msg
      });
      $state.go('menu.professionalslist');
    }, function(errMsg) {
        console.log("Login controller 2");
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})
  
//    $scope.authenticate = function(provider) {
//  
//      AuthService.authenticate(provider).then(function(msg) {
//        var alertPopup = $ionicPopup.alert({
//        title: 'Authenticate Successfully!',
//        template: msg
//      });
//      $state.go('profile');
//    }, function(errMsg) {
//      var alertPopup = $ionicPopup.alert({
//        title: 'Authentication failed!',
//        template: errMsg
//      });
//    });  
//          
//     };
 // })
 
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    displayName: '',
      email: '',
    password: ''
  };
 
      console.log("Hello World from  Register controller");
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})


.controller('ProfileCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
    
    console.log("Hello World from  Profile controller");
 
  $scope.logout = function() {
    AuthService.logout();
       console.log("Logout");
    $state.go('login');
  };
})

.controller('LogoutCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
    
    console.log("Hello World from  Logout controller");
 
  $scope.logout = function() {
    AuthService.logout();
       console.log("Logout");
    $state.go('login');
  };
})


.controller('ContactCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
    
    $scope.contact = {
    name: '',
    email: '',
    number: ''
    };

    
var refresh = function(){                      $http.get(API_ENDPOINT.url + '/contactlist').success(function(response){
        console.log("I got the data I requested");
            $scope.contactlist = response;
        });
 };
    
refresh();


    
    
    
    
$scope.addContact = function() {
  console.log($scope.contact);
     $http.post(API_ENDPOINT.url + '/contactlist', $scope.contact).success(function(response) {  console.log(response);
refresh();                                                   
});
};
    
 
$scope.remove = function(id){
console.log(id);
$http.delete(API_ENDPOINT.url + '/contactlist/' + id).success(function(response){
refresh();
})
};  
    
$scope.edit = function(id){
console.log(id);
    $http.get(API_ENDPOINT.url + '/contactlist/' + id).success(function(response){
    $scope.contact = response;
    });
};    
    
    

 
  $scope.logout = function() {
    AuthService.logout();
    $state.go('menu.professionalslist');
  };
})

.controller('ProfessionalCtrl',  function($scope, $rootScope, AuthService, API_ENDPOINT, $http, $state, $filter) {
    
    
    console.log("Hello World from Professional controller");
  
 $scope.filter = {};
  $scope.filter.city = "";
  $scope.filter.designation = "";
    
    
    
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
    
    
    
var refresh = function(){                      $http.get(API_ENDPOINT.url + '/professional').success(function(response){
        console.log("I got the data I requested");
            $scope.professional = response;
        });
 };
    
refresh();
    
//     $scope.addProfess = function() {
//          console.log("Added Professional");
//  console.log($scope.profess);
//     $http.post(API_ENDPOINT.url + '/professional', $scope.profess).success(function(response) { 
//console.log(response);
//  //refresh();                                               
//});
//};
    
 $scope.p = {
    username: '',
    fname: '',
    lname: '',
    image: '',
    designation: '',
    email: '',
    mobile: '',
    phone: '',
    services: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    company: '',
    timefrom: '',
    timeto: '',
    days: '',
    workdescription: ''
    };   
    
  $scope.addProfess = function() {
  console.log($scope.p);
     $http.post(API_ENDPOINT.url + '/professional', $scope.p).success(function(response) { 
console.log(response);

});
};   

$scope.pro = {
    username: '',
    designation: '',
    city: ''
    };
   
$scope.addPro = function() {
  console.log($scope.pro);
     $http.post(API_ENDPOINT.url + '/prof', $scope.pro).success(function(response) {  console.log(response);
                                                                 });
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
})


.controller('DetailCtrl',  function($scope, $rootScope, AuthService, API_ENDPOINT, $http, $state, $ionicPopover, $ionicModal,  $ionicHistory) {
    console.log("Hello World from Detail controller");
   
 $scope.showProfessionals = function(professional){
    
    console.log("I entered in show details function");
$rootScope.professional = professional;
    console.log($rootScope.professional);   
   
}; 
    
    $scope.goBack = function(){
    $ionicHistory.goBack();
}
    
 $ionicPopover.fromTemplateUrl('templates/professional-detail-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

   $scope.$on('$destroy', function () {
      $scope.popover.remove();
    });
            
            
    $scope.openPopover = function($event) {
   $scope.popover.show($event);
 };
    
              
            
     $ionicModal.fromTemplateUrl('templates/professional-review.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reviewform = modal;
  });

  // Triggered in the comment modal to close it
  $scope.closeReview = function() {
    $scope.reviewform.hide();
  };

  // Open the comment modal
  $scope.review = function() {
    $scope.reviewform.show();
     
  };

  // Perform the comment action when the user submits the comment form
  $scope.doReview = function() {
      
   $scope.reviews.date = new Date().toISOString();
      console.log('Submit Review', $scope.reviews);
      
			$scope.reviews.rating = parseInt($scope.reviews.rating);
      
			$scope.professional.reviews.push($scope.reviews);
			menuFactory.update({id:$scope.professional.id}, $scope.professional);
			console.log($scope.reviews);
      
			$scope.reviews = { rating:5, author:"", comment:"", date:"" };
     
			$scope.reviewform.hide();
		
 
  }; 
   
    
})

.controller('ProfessionalReviewCtrl', function($scope){

    
    
    
});

