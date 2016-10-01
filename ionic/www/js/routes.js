angular.module('FP.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider 
  

      .state('menu.home', {
    url: '/',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
   .state('login', {
        url: '/login',
//        views: {
//          'side-menu21': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
         // }
      //  }
      })
    .state('register', {
    url: '/register',
//        views: {
//            'side-menu21': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
                 //           }
              //  }
  })

  .state('menu.profile', {
    url: '/profile',
    views: {
      'side-menu21': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('menu.professionalslist', {
    url: '/professionalslist',
    views: {
      'side-menu21': {
        templateUrl: 'templates/professionalslist.html',
        controller: 'ProfessionalCtrl'
      }
    }
  })

  .state('menu.professional', {
    url: '/professional',
    views: {
      'side-menu21': {
        templateUrl: 'templates/professional.html',
        controller: 'ProfessionalCtrl'
      }
    }
  })
  
  .state('details', {
    url: '/professionalslist/:id',          
    templateUrl: 'templates/details.html',
    controller: 'DetailCtrl'
  })

  .state('menu.aboutFP', {
    url: '/about-us',
    views: {
      'side-menu21': {
        templateUrl: 'templates/aboutFP.html',
        controller: ''
      }
    }
  })

  .state('menu.contactUs', {
    url: '/contact-us',
    views: {
      'side-menu21': {
        templateUrl: 'templates/contactUs.html',
        controller: ''
      }
    }
  })

  .state('menu.logout', {
    url: '/logout',
    views: {
      'side-menu21': {
        templateUrl: 'templates/logout.html',
        controller: 'LogoutCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

$urlRouterProvider.otherwise('/login')

   function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

});